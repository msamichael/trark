"use client";

import { Skeleton } from "@/components/ui/skeleton";
import ShowCard from "@/app/components/ui/ShowCard";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface WatchlistGridProps {
  watchlistData: any[];
  loading: boolean;
  onToggleBookmark: (bookmark: any, pressed: boolean) => void;
  isBookmarked: (bookmark: any) => boolean;
}

export default function WatchlistGrid({
  watchlistData,
  loading,
  onToggleBookmark,
  isBookmarked,
}: WatchlistGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-[300px]" />
        ))}
      </div>
    );
  }

  if (watchlistData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="bg-zinc-900/50 p-6 rounded-full mb-4">
          <Search className="h-10 w-10 text-zinc-600" />
        </div>
        <h3 className="text-xl font-semibold text-white">Your watchlist is empty</h3>
        <p className="text-zinc-500 max-w-xs mt-2">
          Start browsing and add shows you're excited about to your watchlist!
        </p>

        <Button
          variant="link"
          className="mt-4 text-indigo-400 hover:text-indigo-300"
        >
          <Link href="/">Browse Shows</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {watchlistData.map((show, index) => (
        <ShowCard
          key={`${show.type}-${show.id}-${index}`}
          showId={show.id}
          showType={show.type}
          showName={show.title || show.name || "Untitled"}
          showImage={
            show.poster_path
              ? show.type === "anime"
                ? show.poster_path
                : `https://image.tmdb.org/t/p/w500${show.poster_path}`
              : "/no-poster.png"
          }
          showReleaseDate={
            show.release_date || show.first_air_date || show.aired?.string || "TBA"
          }
          bookmarked={isBookmarked({
            id: show.id,
            type: show.type,
          })}
          onToggle={(pressed) => {
            onToggleBookmark(
              {
                id: show.id,
                type: show.type,
              },
              pressed
            );
          }}
        />
      ))}
    </div>
  );
}