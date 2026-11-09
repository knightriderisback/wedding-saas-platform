'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRESSED_LOVE_TEMPLATES } from '@/lib/pressedLoveTemplates';
import { PressedLoveInvitation } from '@/components/pressedlove/PressedLoveInvitation';

function FloralContent() {
  const searchParams = useSearchParams();
  const guestQuery = searchParams.get('guest') || 'Special Guest';
  const template = PRESSED_LOVE_TEMPLATES['floral'];

  return (
    <PressedLoveInvitation
      initialTemplate={template}
      guestName={guestQuery}
      autoOpen={false}
    />
  );
}

export default function FloralInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF6F2] flex items-center justify-center font-serif text-[#d4a574] text-lg">
          Opening Floral Garden...
        </div>
      }
    >
      <FloralContent />
    </Suspense>
  );
}
