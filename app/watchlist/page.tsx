"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useBookmarkActions } from "../hooks/useBookmarkActions";
import { useRehydrateBookmarks } from "../hooks/useRehydrateBookmarks";
import { useSyncBookmarksToLocalStorage } from "../hooks/useSyncBookmarksToLocalStorage";
import WatchlistGrid from "./components/WatchlistGrid";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const TMDB_API_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN;

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_ACCESS_TOKEN}`,
  },
};

export default function WatchlistPage() {
  const { bookmarks } = useSelector((state: RootState) => state.bookmark);
  const { isBookmarked, toggleBookmark } = useBookmarkActions();
  const [watchlistData, setWatchlistData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  
  const user = false;
  const hasRehydrated = useRehydrateBookmarks(!!user);
  useSyncBookmarksToLocalStorage(bookmarks, !!user, hasRehydrated);

  useEffect(() => {
    if (hasRehydrated) {
      fetchWatchlistData();
    }
  }, [hasRehydrated, bookmarks]);

  const fetchWatchlistData = async () => {
    if (bookmarks.length === 0) {
      setLoading(false);
      setWatchlistData([]);
      return;
    }

    setLoading(true);
    
    try {
      const promises = bookmarks.map(async (bookmark) => {
        try {
          if (bookmark.type === "anime") {
            const res = await fetch(`https://api.jikan.moe/v4/anime/${bookmark.id}`);
            const data = await res.json();
            return {
              ...data.data,
              type: "anime",
              id: data.data.mal_id,
              title: data.data.title,
              name: data.data.title,
              poster_path: data.data.images?.webp?.large_image_url,
              release_date: data.data.aired?.string,
              first_air_date: data.data.aired?.string,
            };
          } else {
            const endpoint = bookmark.type === "movies" ? "movie" : "tv";
            const res = await fetch(
              `${TMDB_BASE_URL}/${endpoint}/${bookmark.id}?language=en-US`,
              API_OPTIONS
            );
            const data = await res.json();
            return {
              ...data,
              type: bookmark.type,
              id: data.id,
              poster_path: data.poster_path,
              release_date: data.release_date || data.first_air_date,
              first_air_date: data.first_air_date || data.release_date,
            };
          }
        } catch (error) {
          console.error(`Error fetching ${bookmark.type} ${bookmark.id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      const validData = results.filter((item) => item !== null);
      setWatchlistData(validData);
    } catch (error) {
      console.error("Error fetching watchlist data:", error);
      setWatchlistData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire watchlist?")) {
      setClearing(true);
      bookmarks.forEach((bookmark) => {
        toggleBookmark(bookmark, false);
      });
      setTimeout(() => {
        setClearing(false);
      }, 500);
    }
  };

  if (!hasRehydrated) {
    return (
      <div className="p-8">
        <div className="space-y-4 max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-[300px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
            <p className="text-zinc-400">
              {bookmarks.length} {bookmarks.length === 1 ? "show" : "shows"} saved
            </p>
          </div>
          
          {bookmarks.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAll}
              disabled={clearing}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {clearing ? "Clearing..." : "Clear All"}
            </Button>
          )}
        </div>

        {/* Watchlist Grid */}
        <WatchlistGrid
          watchlistData={watchlistData}
          loading={loading}
          onToggleBookmark={toggleBookmark}
          isBookmarked={isBookmarked}
        />
      </div>
    </div>
  );
}