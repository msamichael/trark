"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useBookmarkActions } from "../hooks/useBookmarkActions";
import WatchlistGrid from "../components/layout/WatchlistGrid";
import { Button } from "@/components/ui/button";
import { Trash2, Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ConfirmModal from "../components/ui/ConfirmModal";


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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    fetchWatchlistData();
  }, [bookmarks]);

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
              id: bookmark.id,
              type: "anime",
              title: data.data?.title || "Unknown",
              name: data.data?.title || "Unknown",
              poster_path: data.data?.images?.webp?.large_image_url,
              release_date: data.data?.aired?.from || "TBA",
              first_air_date: data.data?.aired?.from || "TBA",
            };
          } else {
            const endpoint = bookmark.type === "movies" ? "movie" : "tv";
            const res = await fetch(
              `${TMDB_BASE_URL}/${endpoint}/${bookmark.id}?language=en-US`,
              API_OPTIONS
            );
            const data = await res.json();
            
            return {
              id: bookmark.id,
              type: bookmark.type,
              title: data.title || data.name || "Unknown",
              name: data.title || data.name || "Unknown",
              poster_path: data.poster_path,
              release_date: data.release_date || data.first_air_date || "TBA",
              first_air_date: data.first_air_date || data.release_date || "TBA",
            };
          }
        } catch (error) {
          console.error(`Error fetching ${bookmark.type} ${bookmark.id}:`, error);
          return {
            id: bookmark.id,
            type: bookmark.type,
            title: "Error Loading",
            name: "Error Loading",
            poster_path: null,
            release_date: "TBA",
            first_air_date: "TBA",
          };
        }
      });

      const results = await Promise.all(promises);
   
      setWatchlistData(results);
    } catch (error) {
      console.error("Error fetching watchlist data:", error);
      setWatchlistData([]);
    } finally {
      setLoading(false);
    }
  };

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleClearAll = () => {
    setConfirmModalOpen(true);
  };

  const handleConfirmClear = () => {
    setClearing(true);
    bookmarks.forEach((bookmark) => {
      toggleBookmark(bookmark, false);
    });
    setTimeout(() => {
      setClearing(false);
    }, 500);
    setConfirmModalOpen(false);
  };

  const handleCancelClear = () => {
    setConfirmModalOpen(false);
  };

  // Filter and sort watchlist data
  const filteredData = watchlistData.filter((show) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const showName = (show.title || show.name || "").toLowerCase();
    if (!showName.includes(searchLower)) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case "title":
        const nameA = (a.title || a.name || "").toLowerCase();
        const nameB = (b.title || b.name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      case "date":
        const dateA = a.release_date || a.first_air_date;
        const dateB = b.release_date || b.first_air_date;
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;  // Put shows without dates at the end
        if (!dateB) return -1; 
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      default:
        return 0;
    }
  });

  if (loading) {
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
    <div className="py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
            <p className="text-zinc-400">
              {filteredData.length} {filteredData.length === 1 ? "show" : "shows"} saved
            </p>
          </div>
          
          
        </div>

        {/* Search and Sort Controls */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search watchlist..."
              className="pl-10 bg-zinc-900/50 border-zinc-700 text-white placeholder-zinc-500 focus:border-zinc-600 focus:ring-zinc-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* 2. The Clear Button - Only shows if there is text */}
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 
                     hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
          </div>
          <div className="flex justify-between">
          {bookmarks.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={clearing}
              className="flex items-center gap-2 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              {clearing ? "Clearing..." : "Clear All"}
            </Button>
          )}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-zinc-900/50 border-zinc-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="date">Release Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Watchlist Grid */}
        <WatchlistGrid
          watchlistData={filteredData}
          loading={loading}
          onToggleBookmark={toggleBookmark}
          isBookmarked={isBookmarked}
        />

        {/* Confirmation Modal */}
        <ConfirmModal
          open={confirmModalOpen}
          onOpenChange={setConfirmModalOpen}
          onConfirm={handleConfirmClear}
          onCancel={handleCancelClear}
          title="Clear Watchlist"
          description="Are you sure you want to clear your entire watchlist? This action cannot be undone."
          confirmText="Clear Watchlist"
          cancelText="Cancel"
          itemCount={bookmarks.length}
        />
      </div>
    </div>
  );
}