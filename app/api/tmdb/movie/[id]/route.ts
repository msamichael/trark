import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const API_OPTIONS = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`
      }
    };

    const [movieRes, creditsRes, videoRes] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/${id}?language=en-US`, API_OPTIONS),
      fetch(`${TMDB_BASE_URL}/movie/${id}/credits?language=en-US`, API_OPTIONS),
      fetch(`${TMDB_BASE_URL}/movie/${id}/videos?language=en-US`, API_OPTIONS)
    ]);

    const movieData = await movieRes.json();
    const creditsData = await creditsRes.json();
    const videoData = await videoRes.json();

    return NextResponse.json({
      movie: movieData,
      credits: creditsData,
      videos: videoData
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
      }
    });
  } catch (error) {
    console.error('TMDB Movie Details API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details', details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined },
      { status: 500 }
    );
  }
}
