'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRESSED_LOVE_TEMPLATES } from '@/lib/pressedLoveTemplates';
import { PressedLoveInvitation } from '@/components/pressedlove/PressedLoveInvitation';
import { RoyalHeritageWeddingInvitation } from '@/components/royal-heritage/RoyalHeritageWeddingInvitation';
import { ZareqiaWeddingInvitation } from '@/components/zareqia/ZareqiaWeddingInvitation';
import { getWeddingProject, parseProjectFromSlug } from '@/lib/firebase';
import { WeddingProject } from '@/types/wedding';

function TheVenueContent() {
  const searchParams = useSearchParams();
  const guestQuery = searchParams.get('guest') || 'Special Guest';
  const slugQuery = searchParams.get('slug') || searchParams.get('client') || '';
  const requestedTemplate = searchParams.get('template');
  const autoOpen = searchParams.get('open') === 'true';

  const [project, setProject] = useState<WeddingProject | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string>(requestedTemplate || 'the-venue');

  useEffect(() => {
    const effectiveSlug = slugQuery || 'gourav-weds-priya';
    getWeddingProject(effectiveSlug).then((data) => {
      const p = data || parseProjectFromSlug(effectiveSlug);
      setProject(p);
      if (p?.partner1 && p?.partner2) {
        document.title = `${p.partner1} Weds ${p.partner2} | Shubh Vivah`;
      }
    });
  }, [slugQuery]);

  useEffect(() => {
    if (requestedTemplate) {
      setActiveTemplate(requestedTemplate);
    }
  }, [requestedTemplate]);

  const effectiveProject = project || parseProjectFromSlug(slugQuery || 'gourav-weds-priya');

  let templateView = null;
  if (activeTemplate === 'royal-heritage') {
    templateView = (
      <RoyalHeritageWeddingInvitation
        key="royal-heritage"
        project={effectiveProject}
        guestName={guestQuery}
        autoOpen={autoOpen}
        weddingSlug={slugQuery || 'wedding-invitation-royal-heritage'}
      />
    );
  } else if (activeTemplate === 'zareqia-emerald') {
    templateView = (
      <ZareqiaWeddingInvitation
        key="zareqia-emerald"
        project={effectiveProject}
        guestName={guestQuery}
        autoOpen={autoOpen}
      />
    );
  } else {
    const selectedTemplate =
      PRESSED_LOVE_TEMPLATES[activeTemplate] ||
      PRESSED_LOVE_TEMPLATES['the-venue'];

    templateView = (
      <PressedLoveInvitation
        key={activeTemplate}
        initialTemplate={selectedTemplate}
        project={effectiveProject}
        guestName={guestQuery}
        autoOpen={autoOpen}
        showCategorySwitcher={false}
      />
    );
  }

  return (
    <div className="relative min-h-screen">
      {templateView}
    </div>
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
