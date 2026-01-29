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

  return (
    <div className="relative w-full sm:w-[350px] bg-gradient-to-br from-purple-900/10 to-blue-900/10 rounded-2xl overflow-hidden border border-purple-500/20 group hover:shadow-2xl hover:border-purple-500/40 transition-all duration-300">
      {/* Card content */}
      <div className="relative flex items-center gap-4 p-4">
        {/* Poster */}
        <div className="relative flex-shrink-0">
          <div className="w-[80px] h-[120px] rounded-lg overflow-hidden border border-purple-500/30 shadow-lg group-hover:shadow-xl transition-all duration-300">
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
         <Link href={`/${showType}/${showId}`} className="block">
        <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1 group-hover:text-purple-400 transition-colors">
              {showName}
            </h3>
          
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
            <CalendarDays size={12} />
            <span className="line-clamp-1">{formatDate(showReleaseDate)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-cyan-400">
            <Clock size={12} />
            <span className="font-medium">{calculateCountdown(showReleaseDate)}</span>
          </div>
        </div>
</Link>
        {/* Bookmark Toggle */}
        <div className="flex-shrink-100">
          <Toggle
            aria-label="bookmark"
            size={"sm"}
            variant={"outline"}
            pressed={bookmarked}
            onPressedChange={(pressed) => {
              onToggle(pressed);
            }}
            className="cursor-pointer data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-white data-[state=on]:*:[svg]:stroke-white"
          >
            <BookmarkIcon size={18} />
          </Toggle>
        </div>
      </div>
    </div>
  );
}