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
