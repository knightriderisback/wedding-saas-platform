'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RoyalHeritageWeddingInvitation } from '@/components/royal-heritage/RoyalHeritageWeddingInvitation';
import { getWeddingProject } from '@/lib/firebase';
import { defaultWeddingProject } from '@/lib/mockData';
import { WeddingProject } from '@/types/wedding';

function RoyalHeritageInvitationContent() {
  const searchParams = useSearchParams();
  const guestQuery = searchParams.get('guest') || 'Special Guest';
  const autoOpen = searchParams.get('open') === 'true';
  const slugQuery = searchParams.get('slug') || searchParams.get('client') || '';

  const [project, setProject] = useState<WeddingProject | null>(null);

  useEffect(() => {
    if (slugQuery) {
      getWeddingProject(slugQuery).then((data) => {
        setProject(data || defaultWeddingProject);
      });
    }
  }, [slugQuery]);

  return (
    <RoyalHeritageWeddingInvitation
      project={project}
      guestName={guestQuery}
      autoOpen={autoOpen}
      weddingSlug={slugQuery || 'royal-heritage'}
    />
  );
}

export default function RoyalHeritageInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center font-serif text-[#7D5F04] text-lg">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-['Cinzel',serif] tracking-widest uppercase text-xs text-[#7D5F04]">
            Opening Royal Heritage Suite...
          </p>
        </div>
      }
    >
      <RoyalHeritageInvitationContent />
    </Suspense>
  );
}
