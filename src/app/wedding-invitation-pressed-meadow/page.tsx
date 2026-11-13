'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRESSED_LOVE_TEMPLATES } from '@/lib/pressedLoveTemplates';
import { PressedLoveInvitation } from '@/components/pressedlove/PressedLoveInvitation';
import { RoyalHeritageWeddingInvitation } from '@/components/royal-heritage/RoyalHeritageWeddingInvitation';
import { ZareqiaWeddingInvitation } from '@/components/zareqia/ZareqiaWeddingInvitation';
import { UniversalFloatingSuiteSwitcher } from '@/components/common/UniversalFloatingSuiteSwitcher';
import { getWeddingProject, parseProjectFromSlug } from '@/lib/firebase';
import { WeddingProject } from '@/types/wedding';

function PressedMeadowContent() {
  const searchParams = useSearchParams();
  const guestQuery = searchParams.get('guest') || 'Special Guest';
  const slugQuery = searchParams.get('slug') || searchParams.get('client') || '';
  const requestedTemplate = searchParams.get('template');
  const autoOpen = searchParams.get('open') === 'true';

  const [project, setProject] = useState<WeddingProject | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string>(requestedTemplate || 'pressed-meadow');

  useEffect(() => {
    if (slugQuery) {
      getWeddingProject(slugQuery).then((data) => {
        setProject(data || parseProjectFromSlug(slugQuery));
      });
    }
  }, [slugQuery]);

  useEffect(() => {
    if (requestedTemplate) {
      setActiveTemplate(requestedTemplate);
    }
  }, [requestedTemplate]);

  const handleSwitchTemplate = (templateId: string) => {
    setActiveTemplate(templateId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('template', templateId);
      window.history.pushState({}, '', url.toString());
    }
  };

  const effectiveProject = project || (slugQuery ? parseProjectFromSlug(slugQuery) : null);

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
      PRESSED_LOVE_TEMPLATES['pressed-meadow'];

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
      <UniversalFloatingSuiteSwitcher
        activeTemplate={activeTemplate}
        onSwitchTemplate={handleSwitchTemplate}
        currentSlug={slugQuery || 'wedding-invitation-pressed-meadow'}
      />
    </div>
  );
}

export default function PressedMeadowInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-serif text-[#3E5F43] text-lg">
          Opening Pressed Meadow...
        </div>
      }
    >
      <PressedMeadowContent />
    </Suspense>
  );
}
