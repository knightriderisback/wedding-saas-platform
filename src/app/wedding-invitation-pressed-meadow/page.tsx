'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRESSED_LOVE_TEMPLATES } from '@/lib/pressedLoveTemplates';
import { PressedLoveInvitation } from '@/components/pressedlove/PressedLoveInvitation';

function PressedMeadowContent() {
  const searchParams = useSearchParams();
  const guestQuery = searchParams.get('guest') || 'Special Guest';
  const template = PRESSED_LOVE_TEMPLATES['pressed-meadow'];

  return (
    <PressedLoveInvitation
      initialTemplate={template}
      guestName={guestQuery}
      autoOpen={false}
      showCategorySwitcher={false}
    />
  );
}

export default function PressedMeadowInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F5EE] flex items-center justify-center font-serif text-[#6b7f5e] text-lg">
          Opening Pressed Meadow...
        </div>
      }
    >
      <PressedMeadowContent />
    </Suspense>
  );
}
