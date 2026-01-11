"use client";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

type ShowType = "anime" | "movies" | "series";

type ShowCardProps = {
  showType: ShowType;
  showImage: string;
  showName: string;
  showReleaseDate: string;
  showId: number;
};

export default function ShowCard({
  showType,
  showImage,
  showName,
  showReleaseDate,
  showId,
}: ShowCardProps) {
  return (
    <div className=" flex flex-col cursor-pointer group  w-[180px] sm:w-full ">
      <Link href={`/${showType}/${showId}`} className="block">
        <div className="relative">
          {showImage ? (
            <Image
              src={showImage}
              width={230}
              height={300}
              loading="lazy"
              className="object-cover transition-transform duration-300 ease-out
      group-hover:scale-102 group-hover:shadow-xl rounded 
      h-[240px] sm:h-[300px] w-[180px] sm:w-[230px]"
              alt={showName + " poster"}
            />
          ) : (
             <Image
              src={'/no-poster.png'}
              width={230}
              height={300}
              loading="lazy"
              className="object-cover  rounded 
      h-[170px] sm:h-[300px] w-[130px] sm:w-[230px]"
              alt={showName + " poster"}
            />
         )}

          <div
            className="flex gap-1 items-center absolute bottom-2 left-1 
            bg-black/80 text-white text-sm
  px-1 py-1 rounded-md opacity-0 translate-y-4 transition-all 
  group-hover:opacity-100 group-hover:translate-y-0 ease-out "
          >
            <CalendarDays size={15} />
            <p>
              {showReleaseDate === "Not available"
                ? "Date TBA"
                : showReleaseDate.includes("to ?")
                ? showReleaseDate.replace(/ to \?$/i, "")
                : showReleaseDate}
            </p>
          </div>
        </div>
      </Link>
      <p className="text-[12px] sm:text-sm mt-1 line-clamp-2">{showName} </p>
    </div>
  );
}
