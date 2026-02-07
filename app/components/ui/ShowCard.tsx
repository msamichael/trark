"use client";

import Image from "next/image";
import { CalendarDays, BookmarkIcon } from "lucide-react";
import Link from "next/link";
import { Toggle } from "@/components/ui/toggle";
import ImageFallback from "@/app/components/ui/ImageFallback";

type ShowType = "anime" | "movies" | "series";

type ShowCardProps = {
  showType: ShowType;
  showImage: string;
  showName: string;
  showReleaseDate: string;
  showId: number;
  bookmarked: boolean;
  onToggle: (value: boolean) => void;
};

export default function ShowCard({
  showType,
  showImage,
  showName,
  showReleaseDate,
  showId,
  bookmarked,
  onToggle,
}: ShowCardProps) {

  return (
    <div className="relative flex flex-col cursor-pointer group w-[180px] sm:w-full">
      {/* Bookmark toggle with drop shadow */}
      <div className="absolute top-0.5 right-0.5 z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] bg-gradient-to-t from-black/20 via-black/40 to-transparent">
        <Toggle
          aria-label="bookmark"
          size="lg"
          variant="outline"
          pressed={bookmarked}
          onPressedChange={(pressed) => onToggle(pressed)}
          onClick={(e) => e.stopPropagation()}
          className="cursor-pointer data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-white data-[state=on]:*:[svg]:stroke-white"
        >
          <BookmarkIcon />
        </Toggle>
      </div>

      {/* Show poster with link */}
      <Link href={`/${showType}/${showId}`} className="block">
        <div className="relative">
          {showImage ? (
            <Image
              src={showImage}
              width={230}
              height={300}
              className="object-cover transition-all duration-400 ease-out 
      group-hover:scale-105 group-hover:shadow-2xl rounded-lg 
      h-[240px] sm:h-[300px] w-[180px] sm:w-[230px]"
              alt={`${showName} poster`}
            />
          ) : (
            <ImageFallback
              className="h-[240px] sm:h-[300px] w-[180px] sm:w-[230px]"
              label="No Poster"
            />
          )}

          {/* Date badge with backdrop blur */}
          <div
            className="flex gap-1.5 items-center absolute bottom-3 left-2 
            bg-black/85 text-white text-sm px-2 py-1.5 rounded-lg md:opacity-0 
            md:translate-y-2 md:transition-all duration-300 
            md:group-hover:opacity-100 md:group-hover:translate-y-0 backdrop-blur-sm"
          >
            <CalendarDays size={16} />
            <p className="font-medium">
              {showReleaseDate === "Not available"
                ? "Date TBA"
                : showReleaseDate.includes("to ?")
                ? showReleaseDate.replace(/ to \?$/i, "")
                : showReleaseDate}
            </p>
          </div>
        </div>
      </Link>
      <p className="text-[12px] sm:text-sm mt-2 font-medium text-zinc-200 line-clamp-2">{showName}</p>
    </div>
  );
}
