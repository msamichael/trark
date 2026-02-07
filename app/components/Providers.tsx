'use client';

import type { ReactNode } from 'react';
import ReduxProvider from '../store/ReduxProvider';
import BookmarkProvider from './BookmarkProvider';
import { AuthProvider } from '../hooks/useAuth';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <AuthProvider>
        <BookmarkProvider>{children}</BookmarkProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
