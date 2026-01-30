'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useLoadBookmarksFromStorage } from '../hooks/useLoadBookmarksFromStorage';
import { useSyncBookmarksToLocalStorage } from '../hooks/useSyncBookmarksToLocalStorage';

export default function BookmarkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { bookmarks } = useSelector((state: RootState) => state.bookmark);
  
  // For now, user is always false (not logged in)
  // In the future, this could come from auth context
  const user = false;
  
  // Load bookmarks from localStorage on app load
  const hasLoaded = useLoadBookmarksFromStorage(!!user);
  
  // Sync bookmarks to localStorage whenever they change
  useSyncBookmarksToLocalStorage(bookmarks, !!user, hasLoaded);

  return <>{children}</>;
}
