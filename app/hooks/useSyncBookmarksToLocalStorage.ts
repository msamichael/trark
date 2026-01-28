'use client';

import { useEffect, useRef } from "react";
import { BookmarkedShow } from "../store/bookmarkSlice";
import { saveLocalBookmarks } from "../lib/bookmarkStorage";


export function useSyncBookmarksToLocalStorage(
    bookmarks: BookmarkedShow[],
    isLoggedIn: boolean,
    hasRehydrated: boolean
){
    const isFirstRender = useRef(true);
    
    useEffect(() => {
        console.log("🔄 sync effect", {
            isLoggedIn,
            hasRehydrated,
            isFirstRender: isFirstRender.current,
        });

        if (isLoggedIn) {
            console.log("⛔ blocked: logged in");
            return;
        }

        if (!hasRehydrated) {
            console.log("⛔ blocked: not rehydrated");
            return;
        }

        // Skip the first render after rehydration
        if (isFirstRender.current) {
            console.log("⏭️ skipping first save after rehydration");
            isFirstRender.current = false;
            return;
        }

        console.log("✅ SAVING TO LOCALSTORAGE");
        saveLocalBookmarks(bookmarks);
    }, [bookmarks, isLoggedIn, hasRehydrated]);
}