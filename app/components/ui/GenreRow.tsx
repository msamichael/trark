"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { getGenresForCategory } from "@/app/lib/genres";

export default function GenreRow() {
  const categoryTab = useSelector((state: RootState) => state.tab.categoryTab);
  const genres = getGenresForCategory(categoryTab);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-sm font-semibold text-zinc-300">Browse by Genre</h3>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {genres.map((genre) => (
          <Link
            key={genre.slug}
            href={`/genre/${categoryTab}/${genre.slug}`}
            className="shrink-0 rounded-full border border-zinc-700 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-200 hover:bg-zinc-800/70 hover:text-white transition-colors"
          >
            {genre.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
