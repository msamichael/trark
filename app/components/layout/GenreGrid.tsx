"use client";

import { useEffect, useState } from "react";
import ShowCard from "../ui/ShowCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookmarkActions } from "@/app/hooks/useBookmarkActions";

type Category = "movies" | "series" | "anime";

type GenreGridProps = {
  category: Category;
  slug: string;
};

export default function GenreGrid({ category, slug }: GenreGridProps) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(40);
  const { isBookmarked, toggleBookmark } = useBookmarkActions();

  useEffect(() => {
    const fetchGenre = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/genre?category=${category}&slug=${slug}`);
        const data = await res.json();
        setResults(data?.results || []);
      } catch (error) {
        console.error("Genre fetch error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGenre();
  }, [category, slug]);

  if (loading) {
    return (
      <div
        className="overflow-x-hidden grid grid-cols-2 
        sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
        place-items-center items-start 
        gap-y-5 sm:gap-y-10 gap-x-2 sm:gap-x-7 w-full mt-5"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[240px] sm:h-[300px] w-[180px] sm:w-[230px] sm:w-full"
          />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center px-4">
        <h3 className="text-lg font-semibold text-white">No upcoming results</h3>
        <p className="text-zinc-500 max-w-xs mt-2">
          Try another genre or category.
        </p>
      </div>
    );
  }

  const visibleResults = results.slice(0, visibleCount);
  const canLoadMore = visibleCount < results.length;

  return (
    <>
      <div
        className="overflow-x-hidden overflow-y-hidden grid grid-cols-2 
        sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
        place-items-center items-start 
        gap-y-5 sm:gap-y-10 sm:gap-x-7 w-full mt-5"
      >
        {visibleResults.map((show: any, index: number) => {
          const showName = show.title || show.name || "Untitled";
          const rawPoster = show.poster_path || show.images?.webp?.large_image_url;
          const showImage =
            rawPoster && rawPoster.startsWith("http")
              ? rawPoster
              : rawPoster
              ? `https://image.tmdb.org/t/p/w500${rawPoster}`
              : null;
          const showId = show.id || show.mal_id;
          const showReleaseDate =
            show.upcoming_air_date ||
            show.release_date ||
            show.first_air_date ||
            show.aired?.string ||
            "TBA";

          return (
            <ShowCard
              key={`${showId}-${index}`}
              showImage={showImage}
              showName={showName}
              showReleaseDate={showReleaseDate}
              showType={category}
              showId={showId}
              bookmarked={isBookmarked({ id: showId, type: category })}
              onToggle={(pressed) =>
                toggleBookmark({ id: showId, type: category }, pressed)
              }
            />
          );
        })}
      </div>
      {canLoadMore ? (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            className="rounded-full border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800/70 hover:text-white transition-colors"
            onClick={() => setVisibleCount((count) => count + 40)}
          >
            Load more
          </button>
        </div>
      ) : null}
    </>
  );
}
