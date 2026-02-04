import {BookmarkedShow} from "@/app/store/bookmarkSlice"

const KEY = 'bookmarks';

export function loadLocalBookmarks(): BookmarkedShow[]{
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const raw = localStorage.getItem(KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return parsed;
    } catch (e) {
        console.error("❌ Failed to load bookmarks", e);
        return []; 
    }
}

export function saveLocalBookmarks(bookmarks: BookmarkedShow[]){
    localStorage.setItem(KEY, JSON.stringify(bookmarks));
}

export function clearLocalBookmarks(){
    localStorage.removeItem(KEY);
}