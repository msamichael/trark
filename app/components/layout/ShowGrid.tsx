"use client";

import { useCallback, useEffect, useState } from "react";
import ShowCard from "../ui/ShowCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setLastPage, setPage, setShowList } from "../../store/showSlice";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const TMDB_API_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN;

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_ACCESS_TOKEN}`,
  },
};

export default function ShowGrid() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { orderBy, page, lastPage } = useSelector(
    (state: RootState) => state.show
  );
  const searchQuery = useSelector(
    (state: RootState) => state.search.searchQuery
  );
  const showList = useSelector((state: RootState) => state.show.showList);
  const categoryTab = useSelector((state: RootState) => state.tab.categoryTab);

  function handlePageChange(newPage: number) {
    if (newPage >= 1 && newPage <= lastPage) {
      dispatch(setPage(newPage));
    }
  }

  //   const fetchTMDB = async(query = "" as string) =>{
  //     try{
  // const [movieRes, tvRes] = await Promise.all([
  //     fetch(`${TMDB_BASE_URL}/movie/upcoming?language=en-US&page=1`, API_OPTIONS),
  //     fetch(`${TMDB_BASE_URL}/discover/tv?include_adult=false&language=
  //       en-US&page=1&sort_by=first_air_date.desc&first_air_date.gte=2026-01-01`, API_OPTIONS)
  //   ]);
  //     }catch(e){

  //     }
  //   }

  const fetchTMDB = async (type: "movie" | "tv", query?: string) => {
    setLoading(true);

    const baseUrl = query
      ? `${TMDB_BASE_URL}/search/${type}`
      : `${TMDB_BASE_URL}/discover/${type}`;

    const params = new URLSearchParams({
      page: page.toString(),
      language: "en-US",
    });

    if (query) {
      params.append("query", query);
    } else {
      const isMovie = categoryTab === "movies";
      const sortValue =
        orderBy === "title"
          ?  isMovie ? "original_title.asc" : "original_name.asc"
          : orderBy === "start_date"
          ? isMovie ? "primary_release_date.asc" : "first_air_date.asc"
          : "popularity.desc";
      params.append("sort_by", sortValue);
    }
try {
  const res = await fetch(`${baseUrl}?${params.toString()}`, API_OPTIONS);
  const result = await res.json();
  dispatch(setShowList(result?.results || []));

  if (result.total_pages){
    dispatch(setLastPage(result.total_pages));
  }

}catch(err){
console.error("Fetch error:", err);
}finally{
setLoading(false);
}
  };

  const fetchAnime = async (query = "" as string) => {
    setLoading(true);

    const baseUrl = "https://api.jikan.moe/v4/anime";

    const params = new URLSearchParams({
      status: "upcoming",
      filter: "upcoming",
      order_by: orderBy,
      sort: "asc",
      page: page.toString(),
    });

    if (query) {
      params.append("q", query);
    }

    try {
      const res = await fetch(`${baseUrl}?${params.toString()}`);
      const result = await res.json();
      dispatch(setShowList(result?.data || []));

      if (result.pagination) {
        dispatch(setLastPage(result.pagination.last_visible_page));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = searchQuery ? 500 : 0;

    const timer = setTimeout(() => {
    if (categoryTab === "movies") {
      fetchTMDB('movie', searchQuery);
    } else if (categoryTab === "series") {
      fetchTMDB('tv', searchQuery);    
    } else {
      fetchAnime(searchQuery);
    }
  }, delay);

    return () => clearTimeout(timer);
  }, [searchQuery, orderBy, page, categoryTab]);

  return (
    <div>
      {loading ? (
        <div
          className=" overflow-x-hidden grid grid-cols-2 
        sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
         place-items-center items-start 
         space-y-5 sm:space-y-10 space-x-2 sm:space-x-7 w-full mt-5"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[170px] sm:h-[300px] w-[130px] sm:w-[230px]"
            />
          ))}
        </div>
      ) : (
        <div
          className=" overflow-x-hidden overflow-y-hidden grid grid-cols-2 
          sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
           place-items-center items-start 
           gap-y-5 sm:gap-y-10  sm:gap-x-7 w-full mt-5"
        >
          {showList.map((show: any, index: number) => {
            
            const showName = show.title || show.name || 'Untitled';
            const showImage = show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}`:
            show.images?.webp?.large_image_url ? show.images?.webp?.large_image_url :  null;
            const showId = show.id || show.mal_id;     
            const showReleaseDate = show.release_date || show.first_air_date || show.aired?.string || "TBA";

            return (
              <ShowCard
                key={`${showId} - ${index}`}
                showImage={showImage}
                showName={showName}
                showReleaseDate={showReleaseDate}
                showType={categoryTab}
                showId={showId}
              />
            );
          })}
        </div>
      )}

     
<Pagination className="my-10">
  <PaginationContent>
    {/* Previous */}
    <PaginationItem>
      <PaginationPrevious
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (page > 1) handlePageChange(page - 1);
        }}
        className={cn(page === 1 && "pointer-events-none opacity-50")}
      />
    </PaginationItem>

    {/* Dynamic page numbers */}
    {(() => {
      if (lastPage <= 1) return null;

      const pages: (number | "ellipsis")[] = [];
      const maxVisible = 5; // Adjust if you want more/less around current page

      // Always show page 1
      pages.push(1);

      // Add ellipsis if needed
      if (page > 3) {
        pages.push("ellipsis");
      }

      // Show range around current page (e.g., current-2 to current+2, clamped)
      const start = Math.max(2, page - 2);
      const end = Math.min(lastPage - 1, page + 2);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (page < lastPage - 2) {
        pages.push("ellipsis");
      }

      // Always show last page (if > 1)
      if (lastPage > 1) {
        pages.push(lastPage);
      }

      // Remove duplicate ellipsis or pages
      const uniquePages = pages.filter((p, index) => 
        p === "ellipsis" ? pages[index - 1] !== "ellipsis" : true
      );

      return uniquePages.map((p, index) =>
        p === "ellipsis" ? (
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        ) : (
          <PaginationItem
            key={p}
            className={cn(p === page && "border border-zinc-200 rounded-md")}
          >
            <PaginationLink
              href="#"
              isActive={p === page}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(p as number);
              }}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        )
      );
    })()}

    {/* Next */}
    <PaginationItem>
      <PaginationNext
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (page < lastPage) handlePageChange(page + 1);
        }}
        className={cn(page === lastPage && "pointer-events-none opacity-50")}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>
    </div>
  );
}
