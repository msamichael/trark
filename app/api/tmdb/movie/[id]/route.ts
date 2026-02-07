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

    const [movieRes, creditsRes, videoRes, releaseDatesRes] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/${id}?language=en-US`, API_OPTIONS),
      fetch(`${TMDB_BASE_URL}/movie/${id}/credits?language=en-US`, API_OPTIONS),
      fetch(`${TMDB_BASE_URL}/movie/${id}/videos?language=en-US`, API_OPTIONS),
      fetch(`${TMDB_BASE_URL}/movie/${id}/release_dates`, API_OPTIONS)
    ]);

    const movieData = await movieRes.json();
    const creditsData = await creditsRes.json();
    const videoData = await videoRes.json();
    const releaseDatesData = await releaseDatesRes.json();

    const pickUsReleaseDate = (data: any) => {
      const results = data?.results;
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

    const usReleaseDate = pickUsReleaseDate(releaseDatesData);
    if (usReleaseDate) {
      movieData.release_date = usReleaseDate;
    }

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
