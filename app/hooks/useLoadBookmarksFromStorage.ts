'use client';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { loadLocalBookmarks, clearLocalBookmarks } from '../lib/bookmarkStorage';
import { getBookmarksFromFirebase, saveBookmarksToFirebase } from '../lib/firebaseStorage';
import { setBookmarks } from '../store/bookmarkSlice';

export function useLoadBookmarksFromStorage(
  isLoggedIn: boolean,
  userId: string | null
) {
  const dispatch = useDispatch();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setHasLoaded(false);

      if (isLoggedIn && userId) {
        const guestBookmarks = loadLocalBookmarks();
        if (guestBookmarks.length > 0) {
          try {
            await saveBookmarksToFirebase(userId, guestBookmarks);
            clearLocalBookmarks();
          } catch (error) {
            console.error('❌ Failed to migrate local bookmarks:', error);
          }
        }

        try {
          const bookmarks = await getBookmarksFromFirebase(userId);
          if (!cancelled) {
            dispatch(setBookmarks(bookmarks));
          }
        } catch (error) {
          console.error('❌ Failed to load bookmarks from Firebase:', error);
        } finally {
          if (!cancelled) {
            setHasLoaded(true);
          }
        }
        return;
      }

      const local = loadLocalBookmarks();
      if (!cancelled) {
        dispatch(setBookmarks(local));
        setHasLoaded(true);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, userId, dispatch]);

  return hasLoaded;
}
