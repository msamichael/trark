"use client";

import { useEffect, useState } from "react";
import ShowCard from "./ShowCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setShowList } from "../store/showSlice";
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

export default function ShowGrid() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { orderBy, page } = useSelector((state: RootState) => state.show);
  const searchQuery = useSelector(
    (state: RootState) => state.search.searchQuery
  );
  const showList = useSelector((state: RootState) => state.show.showList);

  // async function fetchAnime(query = "") {
  //   setLoading(true);
  //   try {
  //     const endpoint = query
  //       ? `https://api.jikan.moe/v4/anime?q=${query}&status=upcoming`
  //       : "https://api.jikan.moe/v4/seasons/upcoming";

  //     const res = await fetch(endpoint);
  //     const result = await res.json();
  //     dispatch(setShowList(result?.data || []));
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function fetchAnime(query = "") {
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
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  // async function fetchSortedAnime(){
  //   const endpoint = `https://api.jikan.moe/v4/anime?q=${query}order_by=${orderBy}&sort=desc&page=${page}`
  //   const res = await fetch(endpoint);
  //   const result = await res.json();
  //   dispatch(setShowList(result?.data || []))
  // }

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
           gap-y-5 sm:gap-y-10 gap-x-2 sm:gap-x-7 w-full mt-5"
        >
          {showList.map((anime: any, index: number) => (
            <ShowCard
              key={anime.mal_id + 2 * index}
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
          <PaginationItem>
            <PaginationPrevious 
            href="#" 
            onClick={(e)=>{
              e.preventDefault();
              handlePageChange(page-1);
            }}/>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis/>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href='#'/>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
