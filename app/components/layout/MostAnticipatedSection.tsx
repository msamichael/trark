"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, TrendingUp, Flame } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

type ShowType = "anime" | "movies" | "series";

interface Show {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  popularity?: number;
  members?: number;
  type: ShowType;
}

interface MostAnticipatedData {
  movies: Show[];
  tv: Show[];
  anime: Show[];
}

export default function MostAnticipatedSection() {
  // Get current category from Redux store
  const categoryTab = useSelector((state: RootState) => state.tab.categoryTab);
  const [data, setData] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch data when category changes
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/most-anticipated');
        const result: MostAnticipatedData = await res.json();
        
        // Select shows based on current category
        let shows: Show[] = [];
        switch (categoryTab) {
          case 'movies':
            shows = result.movies || [];
            break;
          case 'series':
            shows = result.tv || [];
            break;
          case 'anime':
            shows = result.anime || [];
            break;
        }
        setData(shows);
      } catch (error) {
        console.error('Error fetching most anticipated:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryTab]);

  // Handle horizontal scroll
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Helper functions
  const getShowName = (show: Show) => show.title || show.name || 'Unknown';
  const getAnticipationScore = (show: Show) => {
    return show.members || show.popularity || 0;
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="text-orange-500" size={20} />
          <h2 className="text-xl font-bold text-white">Most Anticipated</h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[140px] h-[200px] bg-zinc-800/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Don't render if no data
  if (data.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-8 relative group">
      {/* Header with show count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="text-orange-500" size={20} />
          <h2 className="text-xl font-bold text-white">Most Anticipated</h2>
          <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-full">
            {data.length} shows
          </span>
        </div>
        
        {/* Navigation buttons - show on hover */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => scroll('left')}
            className="p-2 bg-zinc-800/80 hover:bg-zinc-700 rounded-full transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} className="text-white" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 bg-zinc-800/80 hover:bg-zinc-700 rounded-full transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {data.map((show, index) => (
          <Link
            key={`${show.type}-${show.id}`}
            href={`/${categoryTab === 'series' ? 'series' : categoryTab}/${show.id}`}
            className="flex-shrink-0 group/card"
          >
            <div className="relative w-[140px]">
              {/* Rank badge with gradient */}
              <div className="absolute -top-2 -left-2 z-20">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                </div>
              </div>

              {/* Poster with hover effects */}
              <div className="relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover/card:scale-105 group-hover/card:shadow-2xl">
                {show.poster_path ? (
                  <Image
                    src={show.poster_path}
                    alt={getShowName(show)}
                    width={140}
                    height={200}
                    className="object-cover w-[140px] h-[200px]"
                  />
                ) : (
                  <div className="w-[140px] h-[200px] bg-zinc-800 flex items-center justify-center">
                    <span className="text-zinc-600 text-xs">No Image</span>
                  </div>
                )}

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

                {/* Anticipation score badge */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <TrendingUp size={12} className="text-orange-400" />
                    <span className="text-xs font-medium text-white">
                      {getAnticipationScore(show).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Show title */}
              <p className="mt-2 text-xs font-medium text-zinc-300 line-clamp-2 group-hover/card:text-white transition-colors">
                {getShowName(show)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Fade effect on right side */}
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none" />
    </div>
  );
}
