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

    // Calculate date range for filtering (past 5 days)
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5);
    const fiveDaysAgoStr = fiveDaysAgo.toISOString().split('T')[0];

    // Fetch most anticipated upcoming movies, TV shows, and anime
    // Using vote_count for TMDB and members for Jikan
    // Include shows from past 5 days
    const [moviesRes, tvRes, animeRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/discover/movie?language=en-US&page=1&primary_release_date.gte=${fiveDaysAgoStr}&sort_by=popularity.desc&limit=100`, API_OPTIONS),
      fetch(`https://api.themoviedb.org/3/discover/tv?language=en-US&page=1&first_air_date.gte=${fiveDaysAgoStr}&sort_by=popularity.desc&limit=100`, API_OPTIONS),
      fetch('https://api.jikan.moe/v4/anime?status=upcoming&order_by=members&sort=desc&limit=25')
    ]);

    const moviesData = await moviesRes.json();
    const tvData = await tvRes.json();
    const animeData = await animeRes.json();

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

    const filteredTV = tvResults
      .filter((item: any) => item && item.poster_path)
      .slice(0, 25)
      .map((item: any) => ({
        ...item,
        poster_path: `${TMDB_IMAGE_BASE}${item.poster_path}`,
        backdrop_path: item.backdrop_path ? `${TMDB_IMAGE_BASE}${item.backdrop_path}` : undefined,
        type: 'tv' as const
      }));

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
