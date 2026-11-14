'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { WeddingProject } from '@/types/wedding';
import { getWeddingProject, parseProjectFromSlug } from '@/lib/firebase';
import { defaultWeddingProject } from '@/lib/mockData';
import { PRESSED_LOVE_TEMPLATES, TEMPLATE_LIST } from '@/lib/pressedLoveTemplates';
import { SUITE_CATEGORY_METAS } from '@/lib/suiteCategoryMetas';
import { PressedLoveInvitation } from '@/components/pressedlove/PressedLoveInvitation';
import { ZareqiaWeddingInvitation } from '@/components/zareqia/ZareqiaWeddingInvitation';
import { RoyalHeritageWeddingInvitation } from '@/components/royal-heritage/RoyalHeritageWeddingInvitation';
import { Sparkles } from 'lucide-react';

function LuxuryGuestMicrositeContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = (params?.weddingSlug as string) || 'gourav-weds-priya';
  const guestQuery = searchParams.get('guest') || 'Special Guest';
  const requestedTemplate = searchParams.get('template');
  const autoOpen = searchParams.get('open') === 'true';

  const [project, setProject] = useState<WeddingProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState<string>('royal-heritage');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getWeddingProject(slug);
      const effective = data || parseProjectFromSlug(slug);
      setProject(effective);

      // Update browser tab title dynamically
      if (effective?.partner1 && effective?.partner2) {
        document.title = `${effective.partner1} Weds ${effective.partner2} | Shubh Vivah`;
      } else if (effective?.partner1) {
        document.title = `${effective.partner1} | Shubh Vivah`;
      }

      // Determine initial active template
      let suiteFromSlug: string | null = null;
      if (slug === 'wedding-invitation-royal-heritage') {
        suiteFromSlug = 'royal-heritage';
      } else if (slug === 'wedding-invitation-zareqia-emerald') {
        suiteFromSlug = 'zareqia-emerald';
      } else if (slug.startsWith('wedding-invitation-')) {
        const potential = slug.replace('wedding-invitation-', '');
        if (PRESSED_LOVE_TEMPLATES[potential] || potential === 'royal-heritage' || potential === 'zareqia-emerald') {
          suiteFromSlug = potential;
        }
      }

      const resolved =
        requestedTemplate ||
        suiteFromSlug ||
        effective.suite ||
        effective.template ||
        'royal-heritage';

      setActiveTemplate(resolved);
      setLoading(false);
    };
    loadData();
  }, [slug, requestedTemplate]);

  // Keep activeTemplate in sync if requestedTemplate query param changes
  useEffect(() => {
    if (requestedTemplate) {
      setActiveTemplate(requestedTemplate);
    }
  }, [requestedTemplate]);

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#7D5F04] flex items-center justify-center font-['Cinzel',serif] text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2 text-[#D4AF37]" />
        Unfolding Auspicious Wedding Suite...
      </div>
    );
  }

  const effectiveProject = project || parseProjectFromSlug(slug);

  // Render the selected template
  let templateView = null;

  if (activeTemplate === 'royal-heritage') {
    templateView = (
      <RoyalHeritageWeddingInvitation
        key="royal-heritage"
        project={effectiveProject}
        guestName={guestQuery}
        autoOpen={autoOpen}
        weddingSlug={slug}
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
        project={effectiveProject}
        initialTemplate={selectedTemplate}
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

export default function LuxuryGuestMicrosite() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] text-[#7D5F04] flex items-center justify-center font-['Cinzel',serif] text-sm">
          <Sparkles className="w-5 h-5 animate-spin mr-2 text-[#D4AF37]" />
          Unfolding Auspicious Wedding Suite...
        </div>
      }
    >
      <LuxuryGuestMicrositeContent />
    </Suspense>
  );
}
