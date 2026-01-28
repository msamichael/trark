import {BookmarkedShow} from "@/app/store/bookmarkSlice"

const KEY = 'bookmarks';

export function loadLocalBookmarks(): BookmarkedShow[]{
    if (typeof window === 'undefined') {
        console.log('⚠️ loadLocalBookmarks: window is undefined');
        return [];
    }

    try {
        const raw = localStorage.getItem(KEY);
        console.log('📦 loadLocalBookmarks: raw data from localStorage:', raw);
        const parsed = raw ? JSON.parse(raw) : [];
        console.log('📦 loadLocalBookmarks: parsed data:', parsed);
        return parsed;
    } catch (e) {
        console.error("❌ Failed to load bookmarks", e);
        return []; 
    }
}

export function saveLocalBookmarks(bookmarks: BookmarkedShow[]){
    console.log('💾 saveLocalBookmarks: saving to localStorage:', bookmarks);
    localStorage.setItem(KEY, JSON.stringify(bookmarks));
}

export function clearLocalBookmarks(){
    localStorage.removeItem(KEY);
}