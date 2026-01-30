'use client';
import { useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { loadLocalBookmarks } from '../lib/bookmarkStorage';
import { setBookmarks } from '../store/bookmarkSlice';

export function useLoadBookmarksFromStorage(isLoggedIn: boolean){
    const dispatch = useDispatch();
    const [hasLoaded, setHasLoaded] = useState(false);
    const hasLoadedRef = useRef(false);

    console.log('🎯 useLoadBookmarksFromStorage CALLED', { isLoggedIn, hasLoadedRef: hasLoadedRef.current });

    useEffect(() => {
        console.log('🔍 useLoadBookmarksFromStorage effect triggered', { 
            isLoggedIn,
            hasLoadedRef: hasLoadedRef.current,
            hasLoaded
        });

        // Only run once
        if (hasLoadedRef.current) {
            console.log('⏭️ Already loaded, skipping');
            return;
        }
        
        hasLoadedRef.current = true;
        
        if (isLoggedIn) {
            console.log('✅ User logged in, skipping localStorage load');
            setHasLoaded(true);
            return;
        }
        
        console.log('📦 About to call loadLocalBookmarks()...');
        const local = loadLocalBookmarks();
        console.log('📦 Loaded bookmarks:', local);
        
        if (local.length > 0) {
            console.log('✅ Dispatching setBookmarks to Redux with:', local);
            dispatch(setBookmarks(local));
        } else {
            console.log('⚠️ No bookmarks found in localStorage');
        }
        
        setHasLoaded(true);
        console.log('✅ setHasLoaded(true) called');
    }, [isLoggedIn, dispatch]);

    console.log('🔄 useLoadBookmarksFromStorage returning:', hasLoaded);
    return hasLoaded;
}
