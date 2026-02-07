import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'movie'; // 'movie' or 'tv'
    const query = searchParams.get('query');
    const page = searchParams.get('page') || '1';
    const orderBy = searchParams.get('orderBy');
    const language = searchParams.get('language') || 'en-US';

    const API_OPTIONS = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`
      }
    };

    const ENHANCE_LIMIT = 20;

    let url = '';
    const params = new URLSearchParams({
      page,
      language
    });

    if (query) {
      // Search endpoint
      url = `${TMDB_BASE_URL}/search/${type}`;
      params.append('query', query);
    } else {
      // Discover endpoint
      url = `${TMDB_BASE_URL}/discover/${type}`;
      const today = new Date().toISOString().split('T')[0];
      const dateKey = type === 'movie' ? 'primary_release_date.gte' : 'first_air_date.gte';
      params.append(dateKey, today);
      
      if (orderBy) {
        let sortValue = 'popularity.desc';
        if (orderBy === 'title') {
          sortValue = type === 'movie' ? 'original_title.asc' : 'name.asc';
        } else if (orderBy === 'start_date') {
          sortValue = type === 'movie' ? 'primary_release_date.asc' : 'first_air_date.asc';
        }
        params.append('sort_by', sortValue);
      }
    }

    const response = await fetch(`${url}?${params.toString()}`, API_OPTIONS);
    const data = await response.json();

    const isFutureDate = (dateString?: string | null) => {
      if (!dateString) return false;
      const date = new Date(dateString);
      const today = new Date();
      date.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return date >= today;
    };

    const enrichTvResults = async (results: any[]) => {
      if (!results?.length) return [];
      const slice = results.slice(0, ENHANCE_LIMIT);
      const details = await Promise.all(
        slice.map((item) =>
          fetch(`${TMDB_BASE_URL}/tv/${item.id}?language=${language}`, API_OPTIONS)
            .then((r) => r.json())
            .catch(() => null)
        )
      );
      const detailMap = new Map(details.filter(Boolean).map((d: any) => [d.id, d]));

      return results.map((item) => {
        const detail = detailMap.get(item.id);
        const nextEpisodeDate = detail?.next_episode_to_air?.air_date;
        const nextSeasonNumber = detail?.next_episode_to_air?.season_number;

        if (nextEpisodeDate) {
          return {
            ...item,
            upcoming_air_date: nextEpisodeDate,
            next_season_number: nextSeasonNumber
          };
        }
        return item;
      });
    };

    if (type === 'tv') {
      let results = data?.results || [];

      if (query) {
        results = await enrichTvResults(results);
      } else {
        // If no query, also pull ongoing shows that have a future next episode
        if (page === "1") {
        const onAirRes = await fetch(
          `${TMDB_BASE_URL}/tv/on_the_air?language=${language}&page=1`,
          API_OPTIONS
        );
        const onAirData = await onAirRes.json();
        const onAirSlice = (onAirData?.results || []).slice(0, ENHANCE_LIMIT);
        const onAirDetails = await Promise.all(
          onAirSlice.map((item: any) =>
            fetch(`${TMDB_BASE_URL}/tv/${item.id}?language=${language}`, API_OPTIONS)
              .then((r) => r.json())
              .catch(() => null)
          )
        );
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

        const merged = new Map<number, any>();
        for (const item of results) merged.set(item.id, item);
        for (const item of upcomingOnAir) merged.set(item.id, item);
        results = Array.from(merged.values());
        }
      }

      // Filter to upcoming (future first air OR future next episode)
      results = results.filter((item: any) => {
        const candidate = item.upcoming_air_date || item.first_air_date;
        return isFutureDate(candidate);
      });

      data.results = results;
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('TMDB API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TMDB data', details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined },
      { status: 500 }
    );
  }
}
