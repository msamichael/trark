"use client";

import Image from "next/image";
import { CalendarDays, BookmarkIcon, Clock } from "lucide-react";
import Link from "next/link";
import { Toggle } from "@/components/ui/toggle";

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
    
    // Try to extract date from string
    const dateMatch = dateString.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const date = new Date(dateMatch[1]);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    
    // If no standard date format, return as is
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

  return (
    <div className="relative w-full sm:w-[350px] bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800 group">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 opacity-90" />
      
      {/* Card content */}
      <div className="relative flex items-center gap-4 p-4">
        {/* Poster */}
        <div className="relative flex-shrink-0">
          <div className="w-[80px] h-[120px] rounded-md overflow-hidden border border-zinc-700 shadow-lg">
            <Image
              src={showImage}
              width={80}
              height={120}
              className="object-cover w-full h-full"
              alt={`${showName} poster`}
            />
          </div>
        </div>

        {/* Show Details */}
        <div className="flex-1 min-w-0">
          <Link href={`/${showType}/${showId}`} className="block">
            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1 group-hover:text-indigo-400 transition-colors">
              {showName}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
            <CalendarDays size={12} />
            <span className="line-clamp-1">{formatDate(showReleaseDate)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-yellow-400">
            <Clock size={12} />
            <span className="font-medium">{calculateCountdown(showReleaseDate)}</span>
          </div>
        </div>

        {/* Bookmark Toggle */}
        <div className="flex-shrink-0">
          <Toggle
            aria-label="bookmark"
            size={"sm"}
            variant={"outline"}
            pressed={bookmarked}
            onPressedChange={(pressed) => {
              onToggle(pressed);
            }}
            className="cursor-pointer data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
          >
            <BookmarkIcon size={18} />
          </Toggle>
        </div>
      </div>
    </div>
  );
}