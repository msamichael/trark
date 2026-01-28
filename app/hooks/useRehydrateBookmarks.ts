'use client';
import { useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { loadLocalBookmarks } from '../lib/bookmarkStorage';
import { setBookmarks } from '../store/bookmarkSlice';

export function useRehydrateBookmarks(isLoggedIn: boolean){
    const dispatch = useDispatch();
    const [hasRehydrated, setHasRehydrated] = useState(false);
    const hasLoadedRef = useRef(false);

    console.log('🎯 useRehydrateBookmarks CALLED', { isLoggedIn, hasLoadedRef: hasLoadedRef.current });

    useEffect(() => {
        console.log('🔍 useRehydrateBookmarks effect triggered', { 
            isLoggedIn,
            hasLoadedRef: hasLoadedRef.current,
            hasRehydrated
        });

        // Only run once
        if (hasLoadedRef.current) {
            console.log('⏭️ Already loaded, skipping');
            return;
        }
        
        hasLoadedRef.current = true;
        
        if (isLoggedIn) {
            console.log('✅ User logged in, skipping localStorage load');
            setHasRehydrated(true);
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
        
        setHasRehydrated(true);
        console.log('✅ setHasRehydrated(true) called');
    }, [isLoggedIn, dispatch]);

    console.log('🔄 useRehydrateBookmarks returning:', hasRehydrated);
    return hasRehydrated;
}