"use client";

import { Input } from "@/components/ui/input";



export default function SearchBar() {
  return (
    <Input
      placeholder="Search movies, series, anime..."
      className="placeholder:text-sm p-1 max-w-190 px-3  border-zinc-500 border rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-600"
      
    />
  );
}
