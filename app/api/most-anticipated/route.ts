import { NextRequest, NextResponse } from 'next/server';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export async function GET(request: NextRequest) {
  try {
    const API_OPTIONS = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`
      }
    };

    const ENHANCE_LIMIT = 25;

    // Calculate date range for filtering (past 5 days)
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5);
    const fiveDaysAgoStr = fiveDaysAgo.toISOString().split('T')[0];

    // Fetch most anticipated upcoming movies, TV shows, and anime
    // Using vote_count for TMDB and members for Jikan
    // Include shows from past 5 days
    const [moviesRes, tvRes, animeRes, onAirRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/discover/movie?language=en-US&page=1&primary_release_date.gte=${fiveDaysAgoStr}&sort_by=popularity.desc&limit=100`, API_OPTIONS),
      fetch(`https://api.themoviedb.org/3/discover/tv?language=en-US&page=1&first_air_date.gte=${fiveDaysAgoStr}&sort_by=popularity.desc&limit=100`, API_OPTIONS),
      fetch('https://api.jikan.moe/v4/anime?status=upcoming&order_by=members&sort=desc&limit=25'),
      fetch('https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1', API_OPTIONS)
    ]);

    const moviesData = await moviesRes.json();
    const tvData = await tvRes.json();
    const animeData = await animeRes.json();
    const onAirData = await onAirRes.json();

    const isFutureDate = (dateString?: string | null) => {
      if (!dateString) return false;
      const date = new Date(dateString);
      const todayDate = new Date();
      date.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);
      return date >= todayDate;
    };

    const onAirSlice = (onAirData?.results || []).slice(0, ENHANCE_LIMIT);
    const onAirDetails = await Promise.all(
      onAirSlice.map((item: any) =>
        fetch(`https://api.themoviedb.org/3/tv/${item.id}?language=en-US`, API_OPTIONS)
          .then((r) => r.json())
          .catch(() => null)
      )
    );
    const upcomingOnAir = onAirDetails
      .filter((detail: any) => isFutureDate(detail?.next_episode_to_air?.air_date))
      .map((detail: any) => ({
        id: detail.id,
        title: detail.name,
        name: detail.name,
        poster_path: detail.poster_path ? `${TMDB_IMAGE_BASE}${detail.poster_path}` : undefined,
        backdrop_path: detail.backdrop_path ? `${TMDB_IMAGE_BASE}${detail.backdrop_path}` : undefined,
        overview: detail.overview,
        popularity: detail.popularity,
        vote_average: detail.vote_average,
        upcoming_air_date: detail?.next_episode_to_air?.air_date,
        next_season_number: detail?.next_episode_to_air?.season_number,
        type: 'tv' as const
      }));

    // Safely filter and limit to 20 items per category
    const moviesResults = Array.isArray(moviesData.results) ? moviesData.results : [];
    const tvResults = Array.isArray(tvData.results) ? tvData.results : [];
    const animeResults = Array.isArray(animeData.data) ? animeData.data : [];

    const filteredMovies = moviesResults
      .filter((item: any) => item && item.poster_path)
      .slice(0, 25)
      .map((item: any) => ({
        ...item,
        poster_path: `${TMDB_IMAGE_BASE}${item.poster_path}`,
        backdrop_path: item.backdrop_path ? `${TMDB_IMAGE_BASE}${item.backdrop_path}` : undefined,
        type: 'movie' as const
      }));

    const filteredTVBase = tvResults
      .filter((item: any) => item && item.poster_path)
      .slice(0, 25)
      .map((item: any) => ({
        ...item,
        poster_path: `${TMDB_IMAGE_BASE}${item.poster_path}`,
        backdrop_path: item.backdrop_path ? `${TMDB_IMAGE_BASE}${item.backdrop_path}` : undefined,
        type: 'tv' as const
      }));

    const mergedTv = new Map<number, any>();
    for (const item of filteredTVBase) mergedTv.set(item.id, item);
    for (const item of upcomingOnAir) mergedTv.set(item.id, item);
    const filteredTV = Array.from(mergedTv.values())
      .sort((a, b) => (b?.popularity || 0) - (a?.popularity || 0))
      .slice(0, 25);

    const filteredAnime = animeResults
      .filter((item: any) => item && item.images?.jpg?.large_image_url)
      .slice(0, 25)
      .map((item: any) => ({
        id: item.mal_id,
        title: item.title,
        name: item.title,
        poster_path: item.images?.jpg?.large_image_url,
        backdrop_path: item.images?.jpg?.large_image_url,
        overview: item.synopsis,
        members: item.members,
        type: 'anime' as const,
        release_date: item.aired?.from || item.start_date,
        first_air_date: item.aired?.from || item.start_date
      }));

    return NextResponse.json({
      movies: filteredMovies,
      tv: filteredTV,
      anime: filteredAnime
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Most Anticipated API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch most anticipated data', details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined, movies: [], tv: [], anime: [] },
      { status: 500 }
    );
  }
}
