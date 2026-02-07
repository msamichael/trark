import { NextRequest, NextResponse } from "next/server";
import { getGenreDef } from "@/app/lib/genres";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as
      | "movies"
      | "series"
      | "anime"
      | null;
    const slug = searchParams.get("slug");

    if (!category || !slug) {
      return NextResponse.json({ results: [] }, { status: 400 });
    }

    const genre = getGenreDef(category, slug);
    if (!genre) {
      return NextResponse.json({ results: [] }, { status: 404 });
    }

    if (category === "anime") {
      const perPage = 25;
      const maxPages = 4; // up to 100 results
      let collected: any[] = [];

      for (let page = 1; page <= maxPages; page++) {
        const url = `${JIKAN_BASE_URL}/anime?genres=${genre.jikanId}&status=upcoming&order_by=members&sort=desc&limit=${perPage}&page=${page}`;
        const response = await fetch(url);
        const data = await response.json();
        const pageResults = Array.isArray(data?.data) ? data.data : [];
        if (pageResults.length === 0) break;
        collected = collected.concat(pageResults);
        if (collected.length >= 100) break;
      }

      const results = collected.slice(0, 100).map((item: any) => ({
        id: item.mal_id,
        title: item.title,
        name: item.title,
        poster_path: item.images?.webp?.large_image_url,
        backdrop_path: item.images?.webp?.large_image_url,
        overview: item.synopsis,
        release_date: item.aired?.from || item.start_date,
        first_air_date: item.aired?.from || item.start_date
      }));

      return NextResponse.json({ results });
    }

    const API_OPTIONS = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`
      }
    };

    const today = new Date().toISOString().split("T")[0];
    let url = "";

    if (category === "movies") {
      if (genre.kdrama) {
        url = `${TMDB_BASE_URL}/discover/movie?language=en-US&page=1&primary_release_date.gte=${today}&sort_by=popularity.desc&include_adult=false&with_origin_country=KR`;
      } else {
        if (!genre.tmdbId) return NextResponse.json({ results: [] });
        url = `${TMDB_BASE_URL}/discover/movie?language=en-US&page=1&primary_release_date.gte=${today}&sort_by=popularity.desc&include_adult=false&with_genres=${genre.tmdbId}`;
      }
    } else {
      if (genre.kdrama) {
        url = `${TMDB_BASE_URL}/discover/tv?language=en-US&page=1&first_air_date.gte=${today}&sort_by=popularity.desc&with_origin_country=KR`;
      } else {
        if (!genre.tmdbId) return NextResponse.json({ results: [] });
        url = `${TMDB_BASE_URL}/discover/tv?language=en-US&page=1&first_air_date.gte=${today}&sort_by=popularity.desc&with_genres=${genre.tmdbId}`;
      }
    }

    const fetchTmdbPages = async (baseUrl: string, pages: number) => {
      const results: any[] = [];
      for (let page = 1; page <= pages; page++) {
        const pageUrl = `${baseUrl}&page=${page}`;
        const response = await fetch(pageUrl, API_OPTIONS);
        const data = await response.json();
        const pageResults = Array.isArray(data?.results) ? data.results : [];
        if (pageResults.length === 0) break;
        results.push(...pageResults);
        if (results.length >= 100) break;
      }
      return results.slice(0, 100);
    };

    let results = await fetchTmdbPages(url, 3);

    if (category === "series") {
      const isFutureDate = (dateString?: string | null) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const todayDate = new Date();
        date.setHours(0, 0, 0, 0);
        todayDate.setHours(0, 0, 0, 0);
        return date >= todayDate;
      };

      // Include ongoing series with upcoming next episode for this genre
      const onAirRes = await fetch(
        `${TMDB_BASE_URL}/tv/on_the_air?language=en-US&page=1`,
        API_OPTIONS
      );
      const onAirData = await onAirRes.json();
      const onAirSlice = (onAirData?.results || []).slice(0, 25);
      const onAirDetails = await Promise.all(
        onAirSlice.map((item: any) =>
          fetch(`${TMDB_BASE_URL}/tv/${item.id}?language=en-US`, API_OPTIONS)
            .then((r) => r.json())
            .catch(() => null)
        )
      );

      const upcomingOnAir = onAirDetails
        .filter(
          (detail: any) =>
            isFutureDate(detail?.next_episode_to_air?.air_date) &&
            (genre.kdrama
              ? detail?.origin_country?.includes("KR")
              : detail?.genres?.some((g: any) => g.id === genre.tmdbId))
        )
        .map((detail: any) => ({
          id: detail.id,
          name: detail.name,
          title: detail.name,
          poster_path: detail.poster_path,
          backdrop_path: detail.backdrop_path,
          overview: detail.overview,
          popularity: detail.popularity,
          vote_average: detail.vote_average,
          upcoming_air_date: detail?.next_episode_to_air?.air_date
        }));

      const merged = new Map<number, any>();
      for (const item of results) merged.set(item.id, item);
      for (const item of upcomingOnAir) merged.set(item.id, item);
      results = Array.from(merged.values()).slice(0, 100);
    }

    return NextResponse.json({ results }, {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400"
      }
    });
  } catch (error) {
    console.error("Genre API Error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
