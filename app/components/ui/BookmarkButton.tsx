'use client';

import { useBookmarkActions } from "@/app/hooks/useBookmarkActions";
import { BookmarkedShow } from "@/app/store/bookmarkSlice";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Check, Plus } from "lucide-react";

type BookmarkButtonProp = {
    
    show: BookmarkedShow

}

export default function BookmarkButton({
    
    
    show
}:BookmarkButtonProp
) {

   const { isBookmarked, toggleBookmark } = useBookmarkActions();
    const bookmarked = isBookmarked(show);

return(<Button 
              className={clsx("hover:cursor-pointer border-none font-semibold", !bookmarked?"bg-white text-black hover:bg-zinc-200 ":"bg-green-600 text-white hover:bg-green-700")}
              onClick={
                ()=> {toggleBookmark(show, !bookmarked)
                 }
              }
              >
               {

                bookmarked ? (<><Check className="h-5 w-5" /> Added to Watchlist</>):
                (<><Plus className="h-5 w-5" /> Add to Watchlist</>)
               }
              </Button>)

            }