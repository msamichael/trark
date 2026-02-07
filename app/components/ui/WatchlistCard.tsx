"use client";

import Image from "next/image";
import { CalendarDays, BookmarkIcon, Clock, Play } from "lucide-react";
import Link from "next/link";
import { Toggle } from "@/components/ui/toggle";
import ImageFallback from "@/app/components/ui/ImageFallback";

type ShowType = "anime" | "movies" | "series";

type WatchlistCardProps = {
  showType: ShowType;
  showImage: string;
  showName: string;
  showReleaseDate: string;
  showId: number;
  bookmarked: boolean;
  onToggle: (value: boolean) => void;
};

export default function WatchlistCard({
  showType,
  showImage,
  showName,
  showReleaseDate,
  showId,
  bookmarked,
  onToggle,
}: WatchlistCardProps) {
  // Format release date
  const formatDate = (dateString: string) => {
    if (!dateString) return "TBA";
    
    const dateMatch = dateString.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const date = new Date(dateMatch[1]);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    
    return dateString;
  };

  // Calculate countdown
  const calculateCountdown = (dateString: string) => {
    if (!dateString) return "TBA";
    
    const dateMatch = dateString.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const releaseDate = new Date(dateMatch[1]);
      const now = new Date();
      
      if (releaseDate > now) {
        const diffTime = releaseDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} days`;
      } else if (releaseDate < now) {
        return "Available";
      } else {
        return "Today";
      }
    }
    
    return "TBA";
  };

  const getCountdownColor = (dateString: string) => {
    const countdown = calculateCountdown(dateString);
    if (countdown === "Available") return "text-green-400";
    if (countdown === "Today") return "text-yellow-400";
    if (countdown === "TBA") return "text-zinc-500";
    return "text-cyan-400";
  };

  return (
    <div className="relative w-full sm:w-[380px] group">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/80 via-zinc-800/60 to-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1">
          
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
          
          {/* Bookmark Toggle */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
            <Toggle
              aria-label="bookmark"
              size="lg"
              variant="outline"
              pressed={bookmarked}
              onPressedChange={(pressed) => onToggle(pressed)}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.preventDefault()}
              className="cursor-pointer data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-white data-[state=on]:*:[svg]:stroke-white"
            >
              <BookmarkIcon />
            </Toggle>
          </div>

      <Link href={`/${showType}/${showId}`} className="block">
          {/* Card content */}
          <div className="relative flex gap-4 p-5">
            
            {/* Poster */}
            <div className="relative flex-shrink-0">
              <div className="relative w-[100px] h-[150px] rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:shadow-purple-500/20 transition-all duration-500">
                {showImage ? (
                  <Image
                    src={showImage}
                    width={100}
                    height={150}
                    className="object-cover w-full h-full"
                    alt={`${showName} poster`}
                  />
                ) : (
                  <ImageFallback
                    className="w-full h-full"
                    label="No Poster"
                  />
                )}
                
                {/* Play button overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play size={16} className="text-white fill-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Show Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="text-base font-semibold text-white mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors duration-300">
                {showName}
              </h3>
              
              {/* Info badges */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <CalendarDays size={14} className="text-purple-400" />
                  <span className="line-clamp-1">{formatDate(showReleaseDate)}</span>
                </div>
                
                <div className={`flex items-center gap-2 text-xs font-medium ${getCountdownColor(showReleaseDate)}`}>
                  <Clock size={14} />
                  <span>{calculateCountdown(showReleaseDate)}</span>
                </div>
              </div>
            </div>
          </div>

      </Link>
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    </div>
  );
}
