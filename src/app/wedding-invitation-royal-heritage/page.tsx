'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RoyalHeritageWeddingInvitation } from '@/components/royal-heritage/RoyalHeritageWeddingInvitation';

function RoyalHeritageInvitationContent() {
  const searchParams = useSearchParams();
  const guestQuery = searchParams.get('guest') || 'Special Guest';
  const autoOpen = searchParams.get('open') === 'true';

  return (
    <RoyalHeritageWeddingInvitation
      guestName={guestQuery}
      autoOpen={autoOpen}
    />
  );
}

export default function RoyalHeritageInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1A2218] flex flex-col items-center justify-center font-serif text-[#F5EEDB] text-lg">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-['Cinzel',serif] tracking-widest uppercase text-xs text-[#DFC07C]">
            Opening Royal Heritage Suite...
          </p>
        </div>
      }
    >
      <RoyalHeritageInvitationContent />
    </Suspense>
  );
}
