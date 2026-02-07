"use client";

import { useEffect, useState } from "react";
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
import { cn } from "@/config/utils";
import { Button } from "@/components/ui/button";
import { setSearchQuery } from "@/app/store/searchSlice";
import { Search } from "lucide-react";
import { useBookmarkActions } from "@/app/hooks/useBookmarkActions";

export default function ShowGrid() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const { orderBy, page, lastPage } = useSelector(
    (state: RootState) => state.show
  );
  const searchQuery = useSelector(
    (state: RootState) => state.search.searchQuery
  );
  const bookmarks = useSelector(
  (state: RootState) => state.bookmark.bookmarks
  );
  const showList = useSelector((state: RootState) => state.show.showList);
  const categoryTab = useSelector((state: RootState) => state.tab.categoryTab);

const { isBookmarked, toggleBookmark } = useBookmarkActions();

  // ... rest of your code stays the same ...

  const displayList = showList.filter((show: any) => {
    if (categoryTab === "anime") return true;

    const dateStr = show.upcoming_air_date || show.release_date || show.first_air_date;
    if (!dateStr) return false;
    const releaseDate = new Date(dateStr);
    const bufferDate = new Date();

    // Set today's time to the very beginning of the day
    bufferDate.setDate(bufferDate.getDate() - 7);
    bufferDate.setHours(0, 0, 0, 0);
    releaseDate.setHours(0, 0, 0, 0);

    return releaseDate >= bufferDate;
  });

  

  function handlePageChange(newPage: number) {
    if (newPage >= 1 && newPage <= lastPage) {
      dispatch(setPage(newPage));
    }
  }

  const fetchTMDB = async (type: "movie" | "tv", query?: string) => {
    setLoading(true);

    const params = new URLSearchParams({
      type,
      page: page.toString(),
      language: "en-US",
    });

    if (query) {
      params.append("query", query);
    } else if (orderBy) {
      params.append("orderBy", orderBy);
    }

    try {
      const res = await fetch(`/api/tmdb/discover?${params.toString()}`);
      const data = await res.json();
      dispatch(setShowList(data?.results || []));

      if (data.total_pages) {
        dispatch(setLastPage(data.total_pages));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnime = async (query = "" as string) => {
    setLoading(true);

    const params = new URLSearchParams({
      page: page.toString(),
      orderBy: orderBy,
      sort: "asc",
    });

    if (query) {
      params.append("query", query);
    }

    try {
      const res = await fetch(`/api/jikan/anime?${params.toString()}`);
      const data = await res.json();
      dispatch(setShowList(data?.data || []));

      if (data.pagination) {
        dispatch(setLastPage(data.pagination.last_visible_page));
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
        fetchTMDB("movie", searchQuery);
      } else if (categoryTab === "series") {
        fetchTMDB("tv", searchQuery);
      } else {
        fetchAnime(searchQuery);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [searchQuery, orderBy, page, categoryTab]);

  // Reset page to 1 whenever the search query OR the category tab changes
  useEffect(() => {
    dispatch(setPage(1));
    
  }, [searchQuery, categoryTab, dispatch]);

  useEffect(() => {
    dispatch(setSearchQuery(""));
  }, [categoryTab]);

  return (
    <div>
      {loading ? (
        <div
          className=" overflow-x-hidden grid grid-cols-2 
        sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
         place-items-center items-start 
         gap-y-5 sm:gap-y-10 gap-x-2 sm:gap-x-7 w-full mt-5"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton
              key={i}
              className=" h-[240px] sm:h-[300px] w-[180px] sm:w-[230px] sm:w-full"
            />
          ))}
        </div>
      ) : displayList.length > 0 ? (
        <div
          className=" overflow-x-hidden overflow-y-hidden grid grid-cols-2 
          sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
           place-items-center items-start 
           gap-y-5 sm:gap-y-10  sm:gap-x-7 w-full mt-5"
        >
          {displayList.map((show: any, index: number) => {
            const showName = show.title || show.name || "Untitled";
            const showImage = show.poster_path
              ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
              : show.images?.webp?.large_image_url || null;
            const showId = show.id || show.mal_id;
            const showReleaseDate =
              show.upcoming_air_date ||
              show.release_date ||
              show.first_air_date ||
              show.aired?.string ||
              "TBA";
            return (
              <ShowCard
                key={`${showId} - ${index}`}
                showImage={showImage}
                showName={showName}
                showReleaseDate={showReleaseDate}
                showType={categoryTab}
                showId={showId}
                bookmarked={isBookmarked({ id: showId, type: categoryTab })}
                onToggle={(pressed) => toggleBookmark({ id: showId, type: categoryTab }, pressed)}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
          <div className="bg-zinc-900/50 p-6 rounded-full mb-4">
            <Search className="h-10 w-10 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            No upcoming {categoryTab} found
          </h3>
          <p className="text-zinc-500 max-w-xs mt-2">
            {searchQuery
              ? `We couldn't find any future releases matching "${searchQuery}".`
              : `There are currently no upcoming ${categoryTab} scheduled.`}
          </p>

          {searchQuery && (
            <Button
              variant="link"
              className="mt-4 text-indigo-400 hover:text-indigo-300"
              onClick={() => {
                dispatch(setPage(1));
                dispatch(setSearchQuery(""));
              }}
            >
              Clear search and browse all
            </Button>
          )}
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

            // page 1
            pages.push(1);

            // Adds ellipsis if needed
            if (page > 3) {
              pages.push("ellipsis");
            }

            //range around current page
            const start = Math.max(2, page - 2);
            const end = Math.min(lastPage - 1, page + 2);
            for (let i = start; i <= end; i++) {
              pages.push(i);
            }

            // Adds ellipsis before last page if needed
            if (page < lastPage - 2) {
              pages.push("ellipsis");
            }

            //  last page
            if (lastPage > 1) {
              pages.push(lastPage);
            }

            // Removes duplicate ellipsis or pages
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
                  className={cn(
                    p === page && "border border-zinc-200 rounded-md"
                  )}
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
              className={cn(
                page === lastPage && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
