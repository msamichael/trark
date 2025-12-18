"use client";
import Image from "next/image";
import { Calendar, CalendarDays } from 'lucide-react';

async function getAnimeList() {}

type ShowCardProps = {
  showImage: string;
  showLink: string;
  showName : string
  showAired: string
};

export default function ShowCard({ showImage, showLink, showName, showAired }: ShowCardProps) {
  return (
    <div className=" flex flex-col flex-wrap cursor-pointer group  w-[130px] sm:w-full ">
     <div className="relative">

      <Image
        src={showImage}
        width={230}
        height={300}
        loading="lazy"
        className="object-cover transition-transform duration-300 ease-out
      group-hover:scale-102 group-hover:shadow-xl rounded 
      h-[170px] sm:h-[300px] w-[130px] sm:w-[230px]"
        alt={"The Show's Image"}
      />

      <div className="flex gap-1 items-center absolute bottom-2 left-1 bg-black/80 text-white text-sm
  px-1 py-1 rounded-md opacity-0 translate-y-4 transition-all 
  group-hover:opacity-100 group-hover:translate-y-0 ease-out "> 
  <CalendarDays size={15}/>
  <p>{showAired}</p></div>

      </div>
     <p className="hidden">{showLink}</p>
      <p className="text-[12px] sm:text-sm text-wrap mt-1">{showName} </p>
    </div>
  );
}
