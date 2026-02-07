'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroItem {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string;
  overview: string;
  type: 'movie' | 'tv' | 'anime' | 'hero';
  release_date?: string;
  first_air_date?: string;
  upcoming_air_date?: string;
}

// Original hero section as special slide
const originalHero: HeroItem = {
  id: 0,
  title: "Never Miss an Upcoming Release",
  name: "Never Miss an Upcoming Release",
  backdrop_path: "",
  overview: "Stay updated with all the shows you're excited about and never miss a premiere",
  type: 'hero',
  release_date: "",
  first_air_date: ""
};

export default function HeroCarousel() {
  const [items, setItems] = useState<HeroItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcoming();
  }, []);

  const fetchUpcoming = async () => {
    try {
      const res = await fetch('/api/tmdb/trending'); // Keeping same endpoint for simplicity
      const data = await res.json();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const filtered = (data as HeroItem[]).filter((item) => {
        if (item.type !== "tv") return true;
        const dateStr = item.upcoming_air_date || item.first_air_date;
        if (!dateStr) return false;
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);
        return date >= today;
      });
      // Add original hero as first slide
      setItems([originalHero, ...filtered]);
    } catch (error) {
      console.error('Failed to fetch upcoming data:', error);
      setItems([originalHero]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (items.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, 4500); // 4.5 seconds per slide

      return () => clearInterval(interval);
    }
  }, [items.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading || items.length === 0) {
    return (
      <header className="relative overflow-hidden max-w-300 mx-auto mt-5 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-blue-900/10 group mb-4 min-h-[400px]">
        <div className="absolute inset-0 z-0">
          <div className="bg-gradient-radial-top-right from-purple-500/40 via-blue-500/20 to-transparent opacity-50 w-full h-full animate-pulse"></div>
          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <header
      className="relative overflow-hidden max-w-300 mx-auto mt-5 rounded-3xl border border-purple-500/20 bg-black group mb-4 min-h-[400px]"
    >
      {/* Backdrop Image or Original Hero Gradient */}
      <div className="relative h-[600px]">
        {currentItem.type === 'hero' ? (
          // Original hero section
          <div className="absolute inset-0 z-0">
            {/* Vibrant multi-color gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-blue-500/60 to-pink-500/40 animate-pulse [animation-duration:4s]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          </div>
        ) : currentItem.type === 'anime' ? (
          // Anime backdrop (Jikan API uses direct image URLs)
          <>
            <Image
              src={currentItem.backdrop_path}
              alt={currentItem.title || currentItem.name || 'Backdrop'}
              fill
              className="object-cover opacity-70"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
          </>
        ) : (
          // Movie/TV backdrop (TMDB API)
          <>
            <Image
              src={`https://image.tmdb.org/t/p/original${currentItem.backdrop_path}`}
              alt={currentItem.title || currentItem.name || 'Backdrop'}
              fill
              className="object-cover opacity-70"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
          </>
        )}
        
        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center md:justify-end p-8 md:p-12">
          <div className="max-w-2xl">
            {currentItem.type === 'hero' ? (
              // Original hero content
              <>
                <span className="inline-flex items-center self-start sm:self-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300 backdrop-blur-sm mb-4">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
                  </span>
                  Track Your Favorites
                </span>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
                  {currentItem.title || currentItem.name}
                </h2>
                <p className="text-zinc-300 text-lg mb-8 text-center md:text-left">
                  {currentItem.overview}
                </p>

              </>
            ) : (
              // Movie/TV content
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300 backdrop-blur-sm mb-4">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
                  </span>
                  {currentItem.type === 'movie' ? 'Movie' : currentItem.type === 'tv' ? 'TV Series' : 'Anime'}
                </span>
                
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {currentItem.title || currentItem.name}
                </h2>
                
                <p className="text-zinc-300 text-lg mb-8 line-clamp-3">
                  {currentItem.overview}
                </p>

                <div>
                  <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-6 text-lg font-semibold backdrop-blur-sm flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {currentItem.release_date 
                        ? new Date(currentItem.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : currentItem.first_air_date 
                          ? new Date(currentItem.first_air_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Coming Soon'
                      }
                    </span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm rounded-full transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 z-20"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm rounded-full transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 z-20"
          onClick={handleNext}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-purple-500 rounded-full' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </header>
  );
}
