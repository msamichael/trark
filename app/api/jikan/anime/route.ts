import { NextRequest, NextResponse } from 'next/server';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const page = searchParams.get('page') || '1';
    const orderBy = searchParams.get('orderBy') || 'popularity';
    const sort = searchParams.get('sort') || 'asc';

    let url = '';
    const params = new URLSearchParams({
      page,
      order_by: orderBy,
      sort: sort
    });

    if (query) {
      // Search endpoint
      url = `${JIKAN_BASE_URL}/anime`;
      params.append('q', query);
      params.append('status', 'upcoming');
    } else {
      // Discover endpoint (upcoming anime)
      url = `${JIKAN_BASE_URL}/anime`;
      params.append('status', 'upcoming');
      params.append('filter', 'upcoming');
    }

    const response = await fetch(`${url}?${params.toString()}`);
    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Jikan API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch anime data', details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined },
      { status: 500 }
    );
  }
}
