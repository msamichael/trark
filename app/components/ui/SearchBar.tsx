"use client";

import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import type {RootState} from '@/app/store';
import {setSearchQuery} from '@/app/store/searchSlice'




export default function SearchBar() {
  const searchQuery = useSelector(
    (state:RootState)=> state.search.searchQuery
  );

  const dispatch = useDispatch();

  return (
    <div>
      <Input
        type="text"
        placeholder="Search movies, series, anime..."
        className="placeholder:text-sm p-1 max-w-190 px-3 
         border-zinc-500 border rounded-xl focus:outline-none 
         focus:ring-1 focus:ring-zinc-600"
        value={searchQuery}
        onChange={ (e) => dispatch(setSearchQuery(e.target.value))}
      />
    </div>
  );
}
