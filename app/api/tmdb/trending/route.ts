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

    // Fetch upcoming movies, TV shows, and anime with same filtering as ShowGrid
    const [moviesRes, tvRes, animeRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/discover/movie?language=en-US&page=1&primary_release_date.gte=${today}&sort_by=popularity.desc`, API_OPTIONS),
      fetch(`https://api.themoviedb.org/3/discover/tv?language=en-US&page=1&first_air_date.gte=${today}&sort_by=popularity.desc`, API_OPTIONS),
      fetch('https://api.jikan.moe/v4/seasons/upcoming?limit=25')
    ]);

    const moviesData = await moviesRes.json();
    const tvData = await tvRes.json();
    const animeData = await animeRes.json();

    // Ensure 3-way mix of movies, TV shows, and anime
    const filteredMovies = (moviesData.results as any[]).filter(item => item.backdrop_path);
    const filteredTV = (tvData.results as any[]).filter(item => item.backdrop_path);
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

    // Interleave movies, TV shows, and anime for balanced display
    const upcoming = [];
    const maxItems = Math.min(moviesWithType.length, tvWithType.length, animeWithType.length, 4); // 4 of each for total 12
    
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
