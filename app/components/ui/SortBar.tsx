"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpNarrowWide } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSort } from "@/app/store/showSlice";

export default function SortBar() {
  const [selectSortValue, setSelectSortValue] = useState("popularity");

  
  const dispatch = useDispatch();

  function handleSortChange (value:string){
    setSelectSortValue(value);
    dispatch(setSort(value));

  }

  return (
    <Select
      value={selectSortValue}
      onValueChange={handleSortChange}
    >
      <SelectTrigger className="w-28 md:w-38 flex items-start gap-1 bg-zinc-900/50 border-zinc-700 text-white">
        <ArrowUpNarrowWide className="text-zinc-400" />
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>

      <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
        <SelectItem value="popularity">Popularity</SelectItem>
        <SelectItem value="title">Title</SelectItem>
        <SelectItem value="start_date">Release Date</SelectItem>
      </SelectContent>
    </Select>
  );
}
