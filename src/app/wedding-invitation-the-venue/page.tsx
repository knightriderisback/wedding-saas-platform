'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRESSED_LOVE_TEMPLATES } from '@/lib/pressedLoveTemplates';
import { PressedLoveInvitation } from '@/components/pressedlove/PressedLoveInvitation';

function TheVenueContent() {
  const searchParams = useSearchParams();
  const guestQuery = searchParams.get('guest') || 'Special Guest';
  const template = PRESSED_LOVE_TEMPLATES['the-venue'];

  return (
    <PressedLoveInvitation
      initialTemplate={template}
      guestName={guestQuery}
      autoOpen={false}
    />
  );
}

export default function TheVenueInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-serif text-[#4a7c8e] text-lg">
          Opening The Venue...
        </div>
      }
    >
      <TheVenueContent />
    </Suspense>
  );
}
