"use client";

import { useCallback, useEffect, useState } from "react";
import ShowCard from "./ShowCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setLastPage, setPage, setShowList } from "../store/showSlice";
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

export default function ShowGrid() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { orderBy, page, lastPage } = useSelector((state: RootState) => state.show);
  const searchQuery = useSelector(
    (state: RootState) => state.search.searchQuery
  );
  const showList = useSelector((state: RootState) => state.show.showList);

  function handlePageChange (newPage: number){
    if (newPage >= 1 && newPage <= lastPage){
      dispatch(setPage(newPage));
    }
  };


  const fetchAnime = useCallback(async(query = "" as string) => {
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

      if (result.pagination){
        dispatch(setLastPage(result.pagination.last_visible_page));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  },[orderBy, page, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnime(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, orderBy, page]);

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
              className="h-[170px] sm:h-[300px] w-[130px] sm:w-[230px]"
            />
          ))}
        </div>
      ) : (
        <div
          className=" overflow-x-hidden grid grid-cols-2 
          sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
           place-items-center items-start 
           gap-y-5 sm:gap-y-10  sm:gap-x-7 w-full mt-5"
        >
          {showList.map((anime: any, index: number) => (
            <ShowCard
              key={`${anime.mal_id} - ${index}`}
              showImage={anime.images.webp.large_image_url}
              showLink={anime.url}
              showName={anime.title}
              showAired={anime.aired.string}
            />
          ))}
        </div>
      )}

      <Pagination className="my-10">
        <PaginationContent>
            {/* Previous Page */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(page - 1);
              }}
            />
          </PaginationItem>

          {Array.from({length:3}).map((_,i)=>
          {
            const pageNumber = page + i;

            if (pageNumber > lastPage-1){
              return null;
            }
              

            return(

              <PaginationItem key={pageNumber} className={cn(pageNumber === page?"border border-zinc-200 rounded-md":"")}>
            <PaginationLink href="#" 
            
            onClick={
              (e)=>{
                e.preventDefault();
                handlePageChange(pageNumber);
              }
            }>{pageNumber}
            </PaginationLink>
          </PaginationItem>
        );
          }
  
          )}
          {/* Ellipsis */}
          
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          
        
          {/* Last Page */}
          <PaginationItem className={cn(lastPage === page?"border  border-zinc-200 rounded-md":"")}>
            <PaginationLink  href="#" onClick={
              (e)=>{
              e.preventDefault();
              handlePageChange(lastPage);
            }
            }>{lastPage}
            </PaginationLink>
          </PaginationItem>

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext href="#" onClick={(e)=>{
              e.preventDefault();
              handlePageChange(page+1);
            }} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
