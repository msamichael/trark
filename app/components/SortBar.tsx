"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpNarrowWide } from "lucide-react";
import { useState } from "react";



export default function SortBar() {
    const [sort, setSort] = useState('release_date');

  return (
  <Select value={sort} onValueChange={(value) => setSort(value)}  >
    <SelectTrigger className="w-28 md:w-38 flex items-start gap-1">
        <ArrowUpNarrowWide className="text-zinc-100"/>
        <SelectValue placeholder='Sort by'/>
    </SelectTrigger>

    <SelectContent className="bg-zinc-100">
        <SelectItem value='release_date'>Release Date</SelectItem>
        <SelectItem value='title'>Title</SelectItem>
        <SelectItem value='popularity'>Popularity</SelectItem>
    </SelectContent>
  </Select>);
}
