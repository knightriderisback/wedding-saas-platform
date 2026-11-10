'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ZareqiaWeddingInvitation } from '@/components/zareqia/ZareqiaWeddingInvitation';

function ZareqiaInvitationContent() {
  const searchParams = useSearchParams();
  const guestQuery = searchParams.get('guest') || 'Special Guest';
  const autoOpen = searchParams.get('open') === 'true';

  return (
    <ZareqiaWeddingInvitation
      guestName={guestQuery}
      autoOpen={autoOpen}
    />
  );
}

export default function ZareqiaInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#607358] flex flex-col items-center justify-center font-serif text-[#F5EEDB] text-lg">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-['Cinzel',serif] tracking-widest uppercase text-xs">
            Opening Zareqia Emerald Suite...
          </p>
        </div>
      }
    >
      <ZareqiaInvitationContent />
    </Suspense>
  );
}
