'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import CloseButton from '@/app/components/ui/CloseButton';

export default function TrailerModal({ trailerUrl }: { trailerUrl: string }) {
 
    const showTrailer = useSelector((state: RootState) => state.trailer.showTrailer);

  if (!showTrailer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative w-full max-w-4xl aspect-video">
        <iframe
          className="w-full h-full rounded"
          src={trailerUrl}
          title="Trailer"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
        <CloseButton />
      </div>
    </div>
  );
}