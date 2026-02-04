import { NextRequest, NextResponse } from 'next/server';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [animeRes, castRes] = await Promise.all([
      fetch(`${JIKAN_BASE_URL}/anime/${id}`),
      fetch(`${JIKAN_BASE_URL}/anime/${id}/characters`)
    ]);

    const animeResult = await animeRes.json();
    const castResult = await castRes.json();

    return NextResponse.json({
      anime: animeResult.data,
      characters: castResult.data
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
      }
    });
  } catch (error) {
    console.error('Jikan Anime Details API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch anime details', details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined },
      { status: 500 }
    );
  }
}
