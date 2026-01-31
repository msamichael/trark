"use client";

import { Skeleton } from "@/components/ui/skeleton";
import WatchlistCard from "../ui/WatchlistCard";
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
      <div className="space-y-4">
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-[140px] rounded-xl" />
          ))}
        </div>
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

  // Filter upcoming shows (with release dates in future)
  const upcomingShows = watchlistData.filter((show) => {
    const releaseDateStr = show.release_date || show.first_air_date;
    // If no date or "TBA", don't include in upcoming
    if (!releaseDateStr || releaseDateStr === "TBA") return false;
    const releaseDate = new Date(releaseDateStr);
    const now = new Date();
    return releaseDate > now;
  });

  // Filter available shows (already released)
  const availableShows = watchlistData.filter((show) => {
    const releaseDateStr = show.release_date || show.first_air_date;
    // If no date or "TBA", don't include in available
    if (!releaseDateStr || releaseDateStr === "TBA") return false;
    const releaseDate = new Date(releaseDateStr);
    const now = new Date();
    return releaseDate <= now;
  });

  // Filter unknown shows (no date or "TBA")
  const unknownShows = watchlistData.filter((show) => {
    const releaseDateStr = show.release_date || show.first_air_date;
    // If no date or "TBA", include in unknown
    if (!releaseDateStr || releaseDateStr === "TBA") return true;
    return false;
  });

  return (
    <div className="space-y-12">
      {/* Upcoming Shows Section */}
      {upcomingShows.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Upcoming</h2>
          <div className="space-y-3 flex flex-wrap gap-4">
            {upcomingShows.map((show, index) => (
              <WatchlistCard
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
        </div>
      )}

      {/* Available Shows Section */}
      {availableShows.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Available</h2>
          <div className="space-y-3 flex flex-wrap gap-4">
            {availableShows.map((show, index) => (
              <WatchlistCard
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
        </div>
      )}

      {/* Unknown Shows Section */}
      {unknownShows.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Unknown Release Date</h2>
          <div className="space-y-3 flex flex-wrap gap-4">
            {unknownShows.map((show, index) => (
              <WatchlistCard
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
                showReleaseDate="Unknown"
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
        </div>
      )}
    </div>
  );
}