import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const API_OPTIONS = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`
      }
    };

    const today = new Date().toISOString().split('T')[0];
    const ENHANCE_LIMIT = 20;

    // Fetch upcoming movies, TV shows, and anime with same filtering as ShowGrid
    const [moviesRes, tvRes, animeRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/discover/movie?language=en-US&page=1&primary_release_date.gte=${today}&sort_by=popularity.desc`, API_OPTIONS),
      fetch(`https://api.themoviedb.org/3/discover/tv?language=en-US&page=1&first_air_date.gte=${today}&sort_by=popularity.desc`, API_OPTIONS),
      fetch('https://api.jikan.moe/v4/seasons/upcoming?limit=25')
    ]);

    const moviesData = await moviesRes.json();
    const tvData = await tvRes.json();
    const animeData = await animeRes.json();

    const isFutureDate = (dateString?: string | null) => {
      if (!dateString) return false;
      const date = new Date(dateString);
      const todayDate = new Date();
      date.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);
      return date >= todayDate;
    };

    const pickUsReleaseDate = (releaseDatesData: any) => {
      const results = releaseDatesData?.results;
      if (!Array.isArray(results)) return null;
      const us = results.find((r: any) => r.iso_3166_1 === "US") || results[0];
      const dates = us?.release_dates;
      if (!Array.isArray(dates) || dates.length === 0) return null;
      const priority = [3, 2, 4, 5, 6, 1];
      for (const type of priority) {
        const matches = dates
          .filter((d: any) => d.type === type && d.release_date)
          .sort(
            (a: any, b: any) =>
              new Date(a.release_date).getTime() -
              new Date(b.release_date).getTime()
          );
        if (matches.length > 0) {
          return matches[0].release_date.split("T")[0];
        }
      }
      const anyDate = dates
        .filter((d: any) => d.release_date)
        .sort(
          (a: any, b: any) =>
            new Date(a.release_date).getTime() -
            new Date(b.release_date).getTime()
        )[0];
      return anyDate?.release_date?.split("T")[0] ?? null;
    };

    const fetchTvDetails = async (ids: number[]) => {
      const details = await Promise.all(
        ids.map((id) =>
          fetch(`https://api.themoviedb.org/3/tv/${id}?language=en-US`, API_OPTIONS)
            .then((r) => r.json())
            .catch(() => null)
        )
      );
      return details.filter(Boolean);
    };

    // Bring in ongoing shows that have a future next episode (proxy for upcoming season)
    const onAirRes = await fetch(
      `https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1`,
      API_OPTIONS
    );
    const onAirData = await onAirRes.json();
    const onAirSlice = (onAirData?.results || []).slice(0, ENHANCE_LIMIT);
    const onAirDetails = await fetchTvDetails(onAirSlice.map((item: any) => item.id));
    const upcomingOnAir = onAirDetails
      .filter((detail: any) => isFutureDate(detail?.next_episode_to_air?.air_date))
      .map((detail: any) => ({
        id: detail.id,
        name: detail.name,
        title: detail.name,
        overview: detail.overview,
        poster_path: detail.poster_path,
        backdrop_path: detail.backdrop_path,
        first_air_date: detail.first_air_date,
        popularity: detail.popularity,
        vote_average: detail.vote_average,
        upcoming_air_date: detail?.next_episode_to_air?.air_date,
        next_season_number: detail?.next_episode_to_air?.season_number
      }));

    const mergedTv = new Map<number, any>();
    for (const item of tvData.results || []) mergedTv.set(item.id, item);
    for (const item of upcomingOnAir) mergedTv.set(item.id, item);
    const mergedTvList = Array.from(mergedTv.values());

    // Ensure 3-way mix of movies, TV shows, and anime
    const filteredMovies = (moviesData.results as any[]).filter(item => item.backdrop_path);
    const filteredTV = mergedTvList.filter((item: any) => item.backdrop_path);
    const filteredAnime = (animeData.data as any[]).filter(item => item.images?.webp?.large_image_url);
    
    // Add type field for identification
    const moviesWithType = filteredMovies.map(item => ({
      ...item,
      type: 'movie' as const
    }));
    
    const tvWithType = filteredTV.map(item => ({
      ...item,
      type: 'tv' as const
    }));

    const animeWithType = filteredAnime.map(item => ({
      id: item.mal_id,
      title: item.title,
      name: item.title,
      backdrop_path: item.images?.webp?.large_image_url,
      overview: item.synopsis,
      type: 'anime' as const,
      release_date: item.aired?.from || item.start_date,
      first_air_date: item.aired?.from || item.start_date
    }));

    // Update movie release dates (US) for items likely to be shown
    const maxItems = Math.min(moviesWithType.length, tvWithType.length, animeWithType.length, 4); // 4 of each for total 12
    const movieSlice = moviesWithType.slice(0, maxItems);
    const movieReleaseDetails = await Promise.all(
      movieSlice.map((item) =>
        fetch(`https://api.themoviedb.org/3/movie/${item.id}/release_dates`, API_OPTIONS)
          .then((r) => r.json())
          .catch(() => null)
      )
    );
    const movieDateMap = new Map(
      movieReleaseDetails
        .map((d: any) => {
          if (!d?.id) return null;
          const date = pickUsReleaseDate(d);
          return date ? [d.id, date] : null;
        })
        .filter(Boolean) as [number, string][]
    );
    for (const item of moviesWithType) {
      const date = movieDateMap.get(item.id);
      if (date) item.release_date = date;
    }

    // Interleave movies, TV shows, and anime for balanced display
    const upcoming = [];
    
    for (let i = 0; i < maxItems; i++) {
      if (moviesWithType[i]) upcoming.push(moviesWithType[i]);
      if (tvWithType[i]) upcoming.push(tvWithType[i]);
      if (animeWithType[i]) upcoming.push(animeWithType[i]);
    }

    return NextResponse.json(upcoming, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Trending API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending data', details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined },
      { status: 500 }
    );
  }
}
