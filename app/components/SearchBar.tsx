"use client";

import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
};

export default function SearchBar({
  searchQuery,
  setSearchQuery,
}: SearchBarProps) {
  return (
    <div>
      <Input
        type="text"
        placeholder="Search movies, series, anime..."
        className="placeholder:text-sm p-1 max-w-190 px-3 
         border-zinc-500 border rounded-xl focus:outline-none 
         focus:ring-1 focus:ring-zinc-600"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
