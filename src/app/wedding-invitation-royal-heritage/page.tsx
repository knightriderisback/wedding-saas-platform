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

function RoyalHeritageInvitationContent() {
  const searchParams = useSearchParams();
  const guestQuery = searchParams.get('guest') || 'Special Guest';
  const autoOpen = searchParams.get('open') === 'true';
  const slugQuery = searchParams.get('slug') || searchParams.get('client') || '';
  const requestedTemplate = searchParams.get('template');

  const [project, setProject] = useState<WeddingProject | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string>(requestedTemplate || 'royal-heritage');

  useEffect(() => {
    if (slugQuery) {
      getWeddingProject(slugQuery).then((data) => {
        setProject(data || parseProjectFromSlug(slugQuery));
      });
    } else {
      getWeddingProject('rohit-weds-priya').then((data) => {
        setProject(data || parseProjectFromSlug('rohit-weds-priya'));
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

  const effectiveProject = project || (slugQuery ? parseProjectFromSlug(slugQuery) : parseProjectFromSlug('rohit-weds-priya'));

  let templateView = null;
  if (activeTemplate === 'royal-heritage') {
    templateView = (
      <RoyalHeritageWeddingInvitation
        key="royal-heritage"
        project={effectiveProject}
        guestName={guestQuery}
        autoOpen={autoOpen}
        weddingSlug={slugQuery || 'royal-heritage'}
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
      PRESSED_LOVE_TEMPLATES['the-palace'] ||
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
      <UniversalFloatingSuiteSwitcher
        activeTemplate={activeTemplate}
        onSwitchTemplate={handleSwitchTemplate}
        currentSlug={slugQuery || 'wedding-invitation-royal-heritage'}
      />
    </div>
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
