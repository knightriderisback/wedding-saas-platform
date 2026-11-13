'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { WeddingProject } from '@/types/wedding';
import { getWeddingProject } from '@/lib/firebase';
import { defaultWeddingProject } from '@/lib/mockData';
import { PRESSED_LOVE_TEMPLATES } from '@/lib/pressedLoveTemplates';
import { PressedLoveInvitation } from '@/components/pressedlove/PressedLoveInvitation';
import { ZareqiaWeddingInvitation } from '@/components/zareqia/ZareqiaWeddingInvitation';
import { RoyalHeritageWeddingInvitation } from '@/components/royal-heritage/RoyalHeritageWeddingInvitation';
import { Sparkles } from 'lucide-react';

function LuxuryGuestMicrositeContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.weddingSlug as string) || 'rohit-weds-priya';
  const guestQuery = searchParams.get('guest') || 'Special Guest';
  const requestedTemplate = searchParams.get('template');
  const autoOpen = searchParams.get('open') === 'true';

  const [project, setProject] = useState<WeddingProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getWeddingProject(slug);
      setProject(data || defaultWeddingProject);
      setLoading(false);
    };
    loadData();
  }, [slug]);

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#7D5F04] flex items-center justify-center font-['Cinzel',serif] text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2 text-[#D4AF37]" />
        Unfolding Auspicious Wedding Suite...
      </div>
    );
  }

  const effectiveProject = project || defaultWeddingProject;

  // Determine active template key
  const templateKey =
    requestedTemplate ||
    effectiveProject.suite ||
    effectiveProject.template ||
    (slug === 'wedding-invitation-royal-heritage'
      ? 'royal-heritage'
      : slug === 'wedding-invitation-zareqia-emerald'
      ? 'zareqia-emerald'
      : slug.startsWith('wedding-invitation-')
      ? slug.replace('wedding-invitation-', '')
      : 'royal-heritage');

  // 1. Royal Heritage 3D Scrolly Suite (Default & Flagship)
  if (templateKey === 'royal-heritage' || slug === 'wedding-invitation-royal-heritage') {
    return (
      <RoyalHeritageWeddingInvitation
        project={effectiveProject}
        guestName={guestQuery}
        autoOpen={autoOpen}
        weddingSlug={slug}
      />
    );
  }

  // 2. Zareqia Emerald Suite
  if (templateKey === 'zareqia-emerald' || slug === 'wedding-invitation-zareqia-emerald') {
    return <ZareqiaWeddingInvitation guestName={guestQuery} autoOpen={autoOpen} />;
  }

  // 3. Other Pressed Love Suites
  const selectedTemplate =
    PRESSED_LOVE_TEMPLATES[templateKey] ||
    PRESSED_LOVE_TEMPLATES['the-palace'] ||
    PRESSED_LOVE_TEMPLATES['the-venue'];

  return (
    <PressedLoveInvitation
      initialTemplate={selectedTemplate}
      guestName={guestQuery}
      autoOpen={autoOpen}
      showCategorySwitcher={false}
    />
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
