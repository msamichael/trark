'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useLoadBookmarksFromStorage } from '../hooks/useLoadBookmarksFromStorage';
import { useSyncBookmarksToLocalStorage } from '../hooks/useSyncBookmarksToLocalStorage';
import { useAuth } from '../hooks/useAuth';

export default function BookmarkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get user authentication state
  const { user, isLoading } = useAuth();
  const { bookmarks } = useSelector((state: RootState) => state.bookmark);
  const hasLoaded = useLoadBookmarksFromStorage(!!user, user?.uid ?? null);

  // Sync bookmarks to LocalStorage whenever they change if no user is logged in
  useSyncBookmarksToLocalStorage(bookmarks, !!user, hasLoaded && !isLoading);

  return <>{children}</>;
}
