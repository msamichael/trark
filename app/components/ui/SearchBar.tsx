"use client";

import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import type {RootState} from '@/app/store';
import {setSearchQuery} from '@/app/store/searchSlice'
import { Search, X } from "lucide-react"; // 



export default function SearchBar() {
  const searchQuery = useSelector(
    (state: RootState) => state.search.searchQuery
  );

  const dispatch = useDispatch();

  return (
    <div className="relative w-full z-100">
      {/* 1. The Search Icon (Left) */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
      
      <Input
        type="text"
        placeholder="Search movies, series, anime..."
        className="placeholder:text-sm pl-10 pr-10 h-9 border-zinc-700 bg-zinc-900/50 
                   rounded-xl focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:border-zinc-600 text-white placeholder:text-zinc-500"
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      />

      {/* 2. The Clear Button - Only shows if there is text */}
      {searchQuery && (
        <button
          onClick={() => dispatch(setSearchQuery(""))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 
                     hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// export default function SearchBar() {
//   const searchQuery = useSelector(
//     (state:RootState)=> state.search.searchQuery
//   );

//   const dispatch = useDispatch();

//   return (
//     <div>
//       <Input
//         type="text"
//         placeholder="Search movies, series, anime..."
        // className="placeholder:text-sm p-1 max-w-190 px-3 
//          border-zinc-500 border rounded-xl focus:outline-none 
//          focus:ring-1 focus:ring-zinc-600"
//         value={searchQuery}
//         onChange={ (e) => dispatch(setSearchQuery(e.target.value))}
//       />
//     </div>
//   );
// }
