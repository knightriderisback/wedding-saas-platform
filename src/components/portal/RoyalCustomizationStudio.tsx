'use client';

import React, { useState } from 'react';
import {
  WeddingProject,
  ProjectCustomization,
  TypographyFontFamily,
  TypographyFontSize,
  TypographyFontStyle,
  TypographyFontWeight,
} from '@/types/wedding';
import {
  getDefaultCustomization,
  MUSIC_PRESETS,
  FONT_FAMILY_OPTIONS,
} from '@/lib/customizationDefaults';
import { saveWeddingProject } from '@/lib/firebase';
import {
  Crown,
  Sparkles,
  Music,
  Eye,
  EyeOff,
  Type,
  Layout,
  MapPin,
  Calendar,
  Clock,
  Heart,
  Save,
  RotateCcw,
  ExternalLink,
  Sliders,
  Check,
  Volume2,
  VolumeX,
  Globe,
  Shirt,
  Mail,
  Feather,
  Palette,
  Layers,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Play,
  Pause,
  Compass,
} from 'lucide-react';

interface RoyalCustomizationStudioProps {
  project: WeddingProject;
  onUpdate: (updatedProject: WeddingProject) => void;
  showToast: (msg: string) => void;
}

export const RoyalCustomizationStudio: React.FC<RoyalCustomizationStudioProps> = ({
  project,
  onUpdate,
  showToast,
}) => {
  // Merge project customization with full defaults
  const [customization, setCustomization] = useState<ProjectCustomization>(() => {
    const defaults = getDefaultCustomization(project);
    if (!project.customization) return defaults;
    return {
      ...defaults,
      ...project.customization,
      sections: {
        ...defaults.sections,
        ...project.customization.sections,
      },
      typography: {
        ...defaults.typography,
        ...project.customization.typography,
      },
    };
  });

  const [activeCategory, setActiveCategory] = useState<
    'sections' | 'texts' | 'typography' | 'music' | 'events' | 'controls'
  >('sections');

  const [isSaving, setIsSaving] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  // Audio preview toggle
  const toggleTrackPreview = (trackId: string, url: string) => {
    if (playingTrackId === trackId) {
      if (previewAudio) {
        previewAudio.pause();
      }
      setPlayingTrackId(null);
      return;
    }

    if (previewAudio) {
      previewAudio.pause();
    }

    if (!url) {
      showToast('Live Web-Audio Sitar plays on the guest invitation page!');
      setPlayingTrackId(null);
      return;
    }

    const audio = new Audio(url);
    audio.volume = 0.6;
    audio.play().catch(() => {});
    audio.onended = () => setPlayingTrackId(null);
    setPreviewAudio(audio);
    setPlayingTrackId(trackId);
  };

  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedProject: WeddingProject = {
        ...project,
        backgroundAudioUrl: customization.musicTrackUrl || project.backgroundAudioUrl,
        customization,
      };
      await saveWeddingProject(updatedProject);
      onUpdate(updatedProject);
      showToast('All Royal Customizations saved successfully!');
    } catch {
      showToast('Customizations saved to local memory.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to Defaults
  const handleReset = () => {
    if (confirm('Reset all customization settings back to Royal Heritage standard defaults?')) {
      const defaults = getDefaultCustomization(project);
      setCustomization(defaults);
      showToast('Reset to Royal Heritage defaults. Click "Save" to apply.');
    }
  };

  // Helper to update specific section
  const updateSection = <K extends keyof ProjectCustomization['sections']>(
    sectionKey: K,
    patch: Partial<ProjectCustomization['sections'][K]>
  ) => {
    setCustomization((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          ...patch,
        },
      },
    }));
  };

  return (
    <div className="space-y-4 text-[#2C2218] select-none">
      {/* 3D Header Card in Rajhara Express Royal Style */}
      <div className="card-rajhara-elevated-3d p-4 sm:p-5 relative overflow-hidden">
        {/* Decorative Golden Corner Flourishes */}
        <div className="absolute top-2 left-2 text-[#D4AF37]/40 text-xs">❧</div>
        <div className="absolute top-2 right-2 text-[#D4AF37]/40 text-xs">☙</div>
        <div className="absolute bottom-2 left-2 text-[#D4AF37]/40 text-xs">☙</div>
        <div className="absolute bottom-2 right-2 text-[#D4AF37]/40 text-xs">❧</div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#AA820A] to-[#7D5F04] text-white flex items-center justify-center shadow-md border border-white/50 shrink-0">
              <Crown className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-['Cinzel',serif] uppercase tracking-widest text-[#7D5F04] font-black">
                  Bespoke Royal Studio
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#273822] text-[#FAF8F5] font-bold font-mono shadow-xs">
                  100% Dynamic
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-['Rozha_One',serif] text-[#1E2E1B] font-bold tracking-normal leading-tight">
                Royal Heritage Customization & Section Studio
              </h2>
              <p className="text-xs text-[#544230] leading-snug mt-0.5 font-medium">
                Customize every text, font, font-size, hide/show placement, and soundtrack of your wedding microsite.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-[#7D5F04] border border-[#DFC07C] text-xs font-bold font-['Cinzel',serif] shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reset to Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <a
              href={`/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-[#273822] border border-[#B59A57]/60 text-xs font-bold font-['Cinzel',serif] shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#B59A57]" />
              <span>Live Preview</span>
            </a>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-rajhara-3d px-5 py-2 rounded-xl text-xs font-['Cinzel',serif] tracking-wider uppercase flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-4 mt-3 border-t border-[#DFC07C]/40">
          {[
            { id: 'sections', label: 'Hide & Show Sections', icon: Eye, count: '9 Sections' },
            { id: 'texts', label: 'All Texts & Titles', icon: Type, count: 'Custom Copy' },
            { id: 'typography', label: 'Fonts & Sizes', icon: Sliders, count: 'Global & Per-Section' },
            { id: 'music', label: 'Music & Audio', icon: Music, count: 'Royal Presets' },
            { id: 'events', label: 'Ceremony Schedule', icon: Calendar, count: `${project.events.length} Events` },
            { id: 'controls', label: 'Floating Controls', icon: Layers, count: 'Pills & Language' },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer font-['Cinzel',serif] ${
                  isActive
                    ? 'btn-rajhara-emerald-3d shadow-md'
                    : 'bg-white/80 hover:bg-white text-[#544230] border border-[#DFC07C]/60 hover:border-[#AA820A]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#DFC07C]' : 'text-[#7D5F04]'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-sans font-bold ${
                    isActive ? 'bg-white/20 text-[#FAF8F5]' : 'bg-[#EFE8D8] text-[#544230]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          CATEGORY 1: HIDE & SHOW SECTIONS (Placement & Visibility)
          ======================================================== */}
      {activeCategory === 'sections' && (
        <div className="space-y-3">
          <div className="card-rajhara-3d p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#DFC07C]/30">
              <div>
                <h3 className="text-sm sm:text-base font-bold font-['Rozha_One',serif] text-[#1E2E1B] flex items-center gap-2">
                  <Layout className="w-4 h-4 text-[#AA820A]" />
                  Section Visibility & Placement Controls
                </h3>
                <p className="text-xs text-[#544230] mt-0.5">
                  Toggle any section on or off. Disabled sections will magically disappear from the live invitation!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  key: 'envelope' as const,
                  title: 'Stage 1: Wax-Seal Royal Envelope',
                  desc: 'Interactive envelope unboxing with personalized wax seal stamp.',
                  icon: Mail,
                },
                {
                  key: 'hero' as const,
                  title: 'Section 1: 3D Pop-Out Couple Hero',
                  desc: 'Deep 3D golden couple names, lineage parentage, and announcement.',
                  icon: Crown,
                },
                {
                  key: 'scratchCard' as const,
                  title: 'Section 2: Glitter Heart Scratch Card',
                  desc: 'Interactive gold glitter scratch card revealing the sacred date & calendar button.',
                  icon: Sparkles,
                },
                {
                  key: 'countdown' as const,
                  title: 'Section 3: Live Wedding Countdown',
                  desc: 'Real-time countdown timer in authentic Devanagari or Latin digits.',
                  icon: Clock,
                },
                {
                  key: 'photoCarousel' as const,
                  title: 'Section 3B: Couple Photo Carousel',
                  desc: 'Romantic portrait carousel floating right above the countdown.',
                  icon: Heart,
                },
                {
                  key: 'timeline' as const,
                  title: 'Section 4: Ceremony Itinerary (Timeline)',
                  desc: 'Full 4-day itinerary with golden scepter line and event details.',
                  icon: Calendar,
                },
                {
                  key: 'venue' as const,
                  title: 'Section 5: Destination Palace & Dress Code',
                  desc: 'Venue showcase, Google Maps GPS navigation pin & royal dress code.',
                  icon: MapPin,
                },
                {
                  key: 'rsvp' as const,
                  title: 'Section 6: RSVP Attendance Registry',
                  desc: 'Interactive guest attendance form with headcount and dietary preferences.',
                  icon: Feather,
                },
                {
                  key: 'footerBlessing' as const,
                  title: 'Section 7: Footer Blessing & Monogram',
                  desc: 'Floating velvet blessing signature from the bride and groom.',
                  icon: Compass,
                },
              ].map((sec) => {
                const Icon = sec.icon;
                const isEnabled = customization.sections[sec.key].enabled;
                return (
                  <div
                    key={sec.key}
                    className={`card-rajhara-3d p-3.5 rounded-xl border transition-all ${
                      isEnabled
                        ? 'border-[#B59A57]/60 bg-gradient-to-b from-white to-[#FDFBF7]'
                        : 'border-black/10 bg-[#F4EFE6]/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                            isEnabled
                              ? 'bg-[#273822] text-[#E6D197]'
                              : 'bg-black/10 text-black/40'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#1E2E1B] leading-tight font-['Rozha_One',serif]">
                            {sec.title}
                          </h4>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider ${
                              isEnabled ? 'text-[#7D5F04]' : 'text-black/40'
                            }`}
                          >
                            {isEnabled ? '● Active on Invitation' : '○ Hidden from Guests'}
                          </span>
                        </div>
                      </div>

                      {/* 3D Toggle Switch */}
                      <button
                        onClick={() => updateSection(sec.key, { enabled: !isEnabled })}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none toggle-switch-3d ${
                          isEnabled ? 'bg-[#273822]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-0.5 ${
                            isEnabled ? 'translate-x-5.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#544230] mt-2 leading-relaxed">
                      {sec.desc}
                    </p>

                    {/* Font & Size Quick Control */}
                    <div className="mt-2.5 pt-2 border-t border-[#DFC07C]/30 flex items-center justify-between text-[10px]">
                      <span className="text-[#7D5F04] font-bold font-['Cinzel',serif]">Typography:</span>
                      <span className="text-[#1E2E1B] font-bold font-mono bg-white px-2 py-0.5 rounded border border-[#DFC07C]/40">
                        {customization.sections[sec.key].fontFamily || 'Rozha One'} • {customization.sections[sec.key].fontSize || 'normal'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CATEGORY 2: ALL TEXTS & TITLES CUSTOMIZATION
          ======================================================== */}
      {activeCategory === 'texts' && (
        <div className="space-y-3">
          {/* Couple Names & Announcement */}
          <div className="card-rajhara-3d p-4 sm:p-5">
            <h3 className="text-sm sm:text-base font-bold font-['Rozha_One',serif] text-[#1E2E1B] flex items-center gap-2 mb-3 pb-2 border-b border-[#DFC07C]/30">
              <Crown className="w-4 h-4 text-[#AA820A]" />
              Hero Section & Couple Lineage Texts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Groom Name (Dulha)
                </label>
                <input
                  type="text"
                  value={project.partner1}
                  onChange={(e) => onUpdate({ ...project, partner1: e.target.value })}
                  placeholder="Gourav"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white font-bold text-[#1E2E1B] focus:outline-none focus:ring-2 focus:ring-[#AA820A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Bride Name (Dulhan)
                </label>
                <input
                  type="text"
                  value={project.partner2}
                  onChange={(e) => onUpdate({ ...project, partner2: e.target.value })}
                  placeholder="Priya"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white font-bold text-[#1E2E1B] focus:outline-none focus:ring-2 focus:ring-[#AA820A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Ampersand Connector
                </label>
                <select
                  value={customization.sections.hero.ampersandStyle || '&'}
                  onChange={(e) => updateSection('hero', { ampersandStyle: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white font-bold text-[#1E2E1B] focus:outline-none focus:ring-2 focus:ring-[#AA820A]"
                >
                  <option value="&">& (Ampersand)</option>
                  <option value="Weds">Weds</option>
                  <option value="Sang">Sang (संग)</option>
                  <option value="Aur">Aur (और)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Hero Top Announcement
                </label>
                <input
                  type="text"
                  value={customization.sections.hero.announcementText || ''}
                  onChange={(e) => updateSection('hero', { announcementText: e.target.value })}
                  placeholder="WE ARE GETTING MARRIED"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white text-[#1E2E1B] font-bold focus:outline-none focus:ring-2 focus:ring-[#AA820A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Scroll Prompt Instruction
                </label>
                <input
                  type="text"
                  value={customization.sections.hero.scrollPromptText || ''}
                  onChange={(e) => updateSection('hero', { scrollPromptText: e.target.value })}
                  placeholder="SCROLL TO EXPLORE CELEBRATION"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white text-[#1E2E1B] font-bold focus:outline-none focus:ring-2 focus:ring-[#AA820A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-[#DFC07C]/30">
              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Groom Parentage (Dulhe Ke Parivar)
                </label>
                <input
                  type="text"
                  value={customization.sections.hero.groomParentage || ''}
                  onChange={(e) => updateSection('hero', { groomParentage: e.target.value })}
                  placeholder="S/O SMT. SUNITA & SHRI RAJESH MEHRA"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white text-[#1E2E1B] font-bold focus:outline-none focus:ring-2 focus:ring-[#AA820A]"
                />
                <input
                  type="text"
                  value={customization.sections.hero.groomTitle || ''}
                  onChange={(e) => updateSection('hero', { groomTitle: e.target.value })}
                  placeholder="ROYAL HEIR OF MEHRA HERITAGE"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white text-[#785B24] italic font-bold mt-1.5 focus:outline-none focus:ring-2 focus:ring-[#AA820A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Bride Parentage (Dulhan Ke Parivar)
                </label>
                <input
                  type="text"
                  value={customization.sections.hero.brideParentage || ''}
                  onChange={(e) => updateSection('hero', { brideParentage: e.target.value })}
                  placeholder="D/O SMT. REKHA & SHRI VIKRAM VERMA"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white text-[#1E2E1B] font-bold focus:outline-none focus:ring-2 focus:ring-[#AA820A]"
                />
                <input
                  type="text"
                  value={customization.sections.hero.brideTitle || ''}
                  onChange={(e) => updateSection('hero', { brideTitle: e.target.value })}
                  placeholder="DAUGHTER OF VERMA DYNASTY"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white text-[#785B24] italic font-bold mt-1.5 focus:outline-none focus:ring-2 focus:ring-[#AA820A]"
                />
              </div>
            </div>
          </div>

          {/* Destination Palace & Dress Code */}
          <div className="card-rajhara-3d p-4 sm:p-5">
            <h3 className="text-sm sm:text-base font-bold font-['Rozha_One',serif] text-[#1E2E1B] flex items-center gap-2 mb-3 pb-2 border-b border-[#DFC07C]/30">
              <MapPin className="w-4 h-4 text-[#AA820A]" />
              Venue & Dress Code Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Palace / Venue Name
                </label>
                <input
                  type="text"
                  value={project.venue.name}
                  onChange={(e) => onUpdate({ ...project, venue: { ...project.venue, name: e.target.value } })}
                  placeholder="The Oberoi Udaivilas"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white font-bold text-[#1E2E1B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  City & State
                </label>
                <input
                  type="text"
                  value={project.venue.city}
                  onChange={(e) => onUpdate({ ...project, venue: { ...project.venue, city: e.target.value } })}
                  placeholder="Udaipur, Rajasthan"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white font-bold text-[#1E2E1B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-[#DFC07C]/30">
              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Dress Code Title
                </label>
                <input
                  type="text"
                  value={customization.sections.venue.dressCodeTitle || ''}
                  onChange={(e) => updateSection('venue', { dressCodeTitle: e.target.value })}
                  placeholder="Royal Dress Code"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white text-[#1E2E1B] font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Attire Recommendation
                </label>
                <input
                  type="text"
                  value={customization.sections.venue.dressCodeValue || ''}
                  onChange={(e) => updateSection('venue', { dressCodeValue: e.target.value })}
                  placeholder="Strict Royal Traditional"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white text-[#1E2E1B] font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Attire Color/Style Description
                </label>
                <input
                  type="text"
                  value={customization.sections.venue.dressCodeDesc || ''}
                  onChange={(e) => updateSection('venue', { dressCodeDesc: e.target.value })}
                  placeholder="Ivory, Champagne & Antique Gold Silks"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white text-[#1E2E1B] font-bold"
                />
              </div>
            </div>
          </div>

          {/* RSVP Hub Custom Text */}
          <div className="card-rajhara-3d p-4 sm:p-5">
            <h3 className="text-sm sm:text-base font-bold font-['Rozha_One',serif] text-[#1E2E1B] flex items-center gap-2 mb-3 pb-2 border-b border-[#DFC07C]/30">
              <Mail className="w-4 h-4 text-[#AA820A]" />
              RSVP Registry Form & Footer Blessing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  RSVP Section Title
                </label>
                <input
                  type="text"
                  value={customization.sections.rsvp.customTitle || ''}
                  onChange={(e) => updateSection('rsvp', { customTitle: e.target.value })}
                  placeholder="Kindly Grace Our Celebrations"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white text-[#1E2E1B] font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  RSVP Intro Blessing Message
                </label>
                <input
                  type="text"
                  value={customization.sections.rsvp.introText || ''}
                  onChange={(e) => updateSection('rsvp', { introText: e.target.value })}
                  placeholder="Your gracious presence is the greatest blessing for our sacred union."
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white text-[#1E2E1B] font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-[#DFC07C]/30">
              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Footer Blessing Title
                </label>
                <input
                  type="text"
                  value={customization.sections.footerBlessing.blessingText || ''}
                  onChange={(e) => updateSection('footerBlessing', { blessingText: e.target.value })}
                  placeholder="With Heartfelt Gratitude & Warm Blessings"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white text-[#1E2E1B] font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Couple Signature
                </label>
                <input
                  type="text"
                  value={customization.sections.footerBlessing.coupleSignature || ''}
                  onChange={(e) => updateSection('footerBlessing', { coupleSignature: e.target.value })}
                  placeholder="Gourav & Priya"
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white text-[#1E2E1B] font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CATEGORY 3: TYPOGRAPHY, FONTS & SIZES
          ======================================================== */}
      {activeCategory === 'typography' && (
        <div className="space-y-3">
          <div className="card-rajhara-3d p-4 sm:p-5">
            <h3 className="text-sm sm:text-base font-bold font-['Rozha_One',serif] text-[#1E2E1B] flex items-center gap-2 mb-3 pb-2 border-b border-[#DFC07C]/30">
              <Type className="w-4 h-4 text-[#AA820A]" />
              Master Typography Scale & Font Families
            </h3>

            {/* Global Typography Default */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs mb-4">
              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Headings Font Family
                </label>
                <select
                  value={customization.typography?.headingFont || 'Rozha One'}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      typography: { ...prev.typography, headingFont: e.target.value as any },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white font-bold text-[#1E2E1B]"
                >
                  {FONT_FAMILY_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Subheadings Font Family
                </label>
                <select
                  value={customization.typography?.subHeadingFont || 'Cinzel'}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      typography: { ...prev.typography, subHeadingFont: e.target.value as any },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white font-bold text-[#1E2E1B]"
                >
                  {FONT_FAMILY_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Calligraphic Script Font
                </label>
                <select
                  value={customization.typography?.scriptFont || 'Alex Brush'}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      typography: { ...prev.typography, scriptFont: e.target.value as any },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white font-bold text-[#1E2E1B]"
                >
                  {FONT_FAMILY_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                  Global Text Size Scaling
                </label>
                <select
                  value={customization.typography?.sizeScale || 'large'}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      typography: { ...prev.typography, sizeScale: e.target.value as any },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#DFC07C] bg-white font-bold text-[#1E2E1B]"
                >
                  <option value="compact">Compact Standard</option>
                  <option value="normal">Normal (Classic)</option>
                  <option value="large">Large (High Legibility • Recommended)</option>
                  <option value="royal-huge">Royal Giant (Ultra Big & Bold)</option>
                </select>
              </div>
            </div>

            {/* Per-Section Font Overrides */}
            <h4 className="text-xs font-bold font-['Cinzel',serif] uppercase tracking-wider text-[#7D5F04] pt-3 pb-2 border-t border-[#DFC07C]/30">
              Per-Section Font & Size Overrides
            </h4>

            <div className="space-y-2">
              {[
                { key: 'hero' as const, name: 'Hero 3D Names & Lineage' },
                { key: 'scratchCard' as const, name: 'Heart Scratch Card & Secret Date' },
                { key: 'countdown' as const, name: 'Live Countdown Timer & Labels' },
                { key: 'timeline' as const, name: 'Ceremony Schedule & Itinerary' },
                { key: 'venue' as const, name: 'Palace Destination & Dress Code' },
                { key: 'rsvp' as const, name: 'RSVP Form & Inputs' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-3 rounded-xl bg-white/70 border border-[#DFC07C]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <span className="font-bold text-xs text-[#1E2E1B]">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={customization.sections[item.key].fontFamily || 'Rozha One'}
                      onChange={(e) => updateSection(item.key, { fontFamily: e.target.value as any })}
                      className="px-2.5 py-1.5 rounded-lg border border-[#DFC07C] text-xs bg-white text-[#1E2E1B] font-bold"
                    >
                      {FONT_FAMILY_OPTIONS.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={customization.sections[item.key].fontSize || 'large'}
                      onChange={(e) => updateSection(item.key, { fontSize: e.target.value as any })}
                      className="px-2.5 py-1.5 rounded-lg border border-[#DFC07C] text-xs bg-white text-[#1E2E1B] font-bold"
                    >
                      <option value="small">Small</option>
                      <option value="normal">Normal</option>
                      <option value="large">Large</option>
                      <option value="extra-large">Extra Large</option>
                      <option value="royal-huge">Royal Giant</option>
                    </select>

                    <select
                      value={customization.sections[item.key].fontWeight || 'bold'}
                      onChange={(e) => updateSection(item.key, { fontWeight: e.target.value as any })}
                      className="px-2.5 py-1.5 rounded-lg border border-[#DFC07C] text-xs bg-white text-[#1E2E1B] font-bold"
                    >
                      <option value="normal">Regular</option>
                      <option value="medium">Medium</option>
                      <option value="bold">Bold</option>
                      <option value="black">Black</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CATEGORY 4: MUSIC & AUDIO PRESETS
          ======================================================== */}
      {activeCategory === 'music' && (
        <div className="space-y-3">
          <div className="card-rajhara-3d p-4 sm:p-5">
            <h3 className="text-sm sm:text-base font-bold font-['Rozha_One',serif] text-[#1E2E1B] flex items-center gap-2 mb-3 pb-2 border-b border-[#DFC07C]/30">
              <Music className="w-4 h-4 text-[#AA820A]" />
              Background Royal Symphony & Soundtrack
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {MUSIC_PRESETS.map((preset) => {
                const isSelected =
                  customization.musicTrackUrl === preset.url ||
                  (!customization.musicTrackUrl && preset.id === 'royal-heritage');
                const isPlaying = playingTrackId === preset.id;
                return (
                  <div
                    key={preset.id}
                    className={`card-rajhara-3d p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#AA820A] bg-gradient-to-br from-[#FFFDF9] to-[#FBF6EC] shadow-md'
                        : 'border-[#DFC07C]/40 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-[#1E2E1B] font-['Cinzel',serif]">
                          {preset.name}
                        </h4>
                        <p className="text-[11px] text-[#544230] mt-0.5 leading-snug">
                          {preset.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleTrackPreview(preset.id, preset.url)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isPlaying
                              ? 'bg-[#273822] text-[#E6D197] animate-pulse'
                              : 'bg-[#FAF8F5] text-[#7D5F04] border border-[#DFC07C]'
                          }`}
                          title="Preview Track"
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() =>
                            setCustomization((prev) => ({
                              ...prev,
                              musicTrackUrl: preset.url,
                              musicTrackTitle: preset.name,
                            }))
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold font-['Cinzel',serif] transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#273822] text-[#FAF8F5]'
                              : 'bg-white border border-[#DFC07C] text-[#7D5F04] hover:bg-[#273822] hover:text-white'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Use This'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Audio URL Option */}
            <div className="pt-3 border-t border-[#DFC07C]/30 text-xs">
              <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                Custom Music MP3 / Audio Stream URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customization.musicTrackUrl || ''}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      musicTrackUrl: e.target.value,
                      musicTrackTitle: 'Custom Wedding Soundtrack',
                    }))
                  }
                  placeholder="https://your-domain.com/audio/my-wedding-music.mp3"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#DFC07C] bg-white font-mono text-xs text-[#1E2E1B] focus:outline-none focus:ring-2 focus:ring-[#AA820A]"
                />
              </div>
              <p className="text-[10px] text-[#785B24] mt-1 font-medium">
                Tip: Enter any hosted .mp3 link or use our pre-bundled Royal Sitar and Shehnai soundtracks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CATEGORY 5: CEREMONY SCHEDULE & EVENTS
          ======================================================== */}
      {activeCategory === 'events' && (
        <div className="space-y-3">
          <div className="card-rajhara-3d p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#DFC07C]/30">
              <div>
                <h3 className="text-sm sm:text-base font-bold font-['Rozha_One',serif] text-[#1E2E1B] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#AA820A]" />
                  Ceremony Itinerary Events Manager
                </h3>
                <p className="text-xs text-[#544230] mt-0.5">
                  Add, edit, or remove wedding functions. All functions automatically translate in Hindi, Urdu, and English!
                </p>
              </div>

              <button
                onClick={() => {
                  const newEvent = {
                    id: `ev-${Date.now()}`,
                    title: 'Royal Celebration Function',
                    subtitle: 'Grand festivities, music & dining',
                    date: 'Sunday, November 21, 2027',
                    time: '7:00 PM Onwards',
                    venue: project.venue.name,
                    address: project.venue.city,
                    dressCode: 'Royal Indian Formal',
                    dressCodeDetails: 'Formal Traditional Attire',
                    dressCodeColors: ['#D4AF37', '#273822'],
                    googleMapsLink: project.venue.googleMapsLink,
                  };
                  onUpdate({ ...project, events: [...project.events, newEvent] });
                  showToast('New function added to ceremony schedule!');
                }}
                className="btn-rajhara-3d px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ceremony</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {project.events.map((ev, index) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-xl bg-white border border-[#DFC07C]/50 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#273822] text-[#E6D197] text-[10px] font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={ev.title}
                        onChange={(e) => {
                          const updated = [...project.events];
                          updated[index].title = e.target.value;
                          onUpdate({ ...project, events: updated });
                        }}
                        className="font-bold text-xs text-[#1E2E1B] border-b border-[#DFC07C] focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Remove "${ev.title}"?`)) {
                          const updated = project.events.filter((_, i) => i !== index);
                          onUpdate({ ...project, events: updated });
                        }
                      }}
                      className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-[9px] uppercase font-bold text-[#7D5F04]">Date & Day</label>
                      <input
                        type="text"
                        value={ev.date}
                        onChange={(e) => {
                          const updated = [...project.events];
                          updated[index].date = e.target.value;
                          onUpdate({ ...project, events: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#DFC07C] text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold text-[#7D5F04]">Time</label>
                      <input
                        type="text"
                        value={ev.time}
                        onChange={(e) => {
                          const updated = [...project.events];
                          updated[index].time = e.target.value;
                          onUpdate({ ...project, events: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#DFC07C] text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold text-[#7D5F04]">Dress Code</label>
                      <input
                        type="text"
                        value={ev.dressCode}
                        onChange={(e) => {
                          const updated = [...project.events];
                          updated[index].dressCode = e.target.value;
                          onUpdate({ ...project, events: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#DFC07C] text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-bold text-[#7D5F04]">Description</label>
                    <input
                      type="text"
                      value={ev.subtitle}
                      onChange={(e) => {
                        const updated = [...project.events];
                        updated[index].subtitle = e.target.value;
                        onUpdate({ ...project, events: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#DFC07C] text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CATEGORY 6: FLOATING CONTROLS & LANGUAGE
          ======================================================== */}
      {activeCategory === 'controls' && (
        <div className="space-y-3">
          <div className="card-rajhara-3d p-4 sm:p-5">
            <h3 className="text-sm sm:text-base font-bold font-['Rozha_One',serif] text-[#1E2E1B] flex items-center gap-2 mb-3 pb-2 border-b border-[#DFC07C]/30">
              <Layers className="w-4 h-4 text-[#AA820A]" />
              Floating Pills & Default Language
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
              <div className="card-rajhara-3d p-3.5 rounded-xl border border-[#DFC07C]/50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#1E2E1B] flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-[#AA820A]" />
                    Top-Right Sound Pill
                  </h4>
                  <p className="text-[11px] text-[#544230] mt-0.5">
                    Floating music mute/unmute button for guests.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setCustomization((prev) => ({
                      ...prev,
                      showMusicButton: !prev.showMusicButton,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none toggle-switch-3d ${
                    customization.showMusicButton !== false ? 'bg-[#273822]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-0.5 ${
                      customization.showMusicButton !== false ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="card-rajhara-3d p-3.5 rounded-xl border border-[#DFC07C]/50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#1E2E1B] flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#AA820A]" />
                    Bottom-Left Language Switcher
                  </h4>
                  <p className="text-[11px] text-[#544230] mt-0.5">
                    Floating 4-language pill (Hindi, English, Urdu, Hinglish).
                  </p>
                </div>
                <button
                  onClick={() =>
                    setCustomization((prev) => ({
                      ...prev,
                      showLanguageSwitcher: !prev.showLanguageSwitcher,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none toggle-switch-3d ${
                    customization.showLanguageSwitcher !== false ? 'bg-[#273822]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-0.5 ${
                      customization.showLanguageSwitcher !== false ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DFC07C]/30 text-xs">
              <label className="block text-[10px] font-['Cinzel',serif] uppercase font-bold text-[#7D5F04] mb-1">
                Default Starting Language When Guest Opens Invitation
              </label>
              <select
                value={customization.defaultLanguage || 'en'}
                onChange={(e) =>
                  setCustomization((prev) => ({
                    ...prev,
                    defaultLanguage: e.target.value as any,
                  }))
                }
                className="w-full sm:w-72 px-3 py-2 rounded-xl border border-[#DFC07C] bg-white font-bold text-[#1E2E1B]"
              >
                <option value="en">English (Default)</option>
                <option value="hi">Hindi (हिंदी • Pure Devanagari)</option>
                <option value="ur">Urdu (اردو • Nastaliq)</option>
                <option value="hinglish">Hinglish (Casual Hindi in English Script)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Save Action Bar */}
      <div className="sticky bottom-4 z-30 card-rajhara-elevated-3d p-3 sm:p-4 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#273822] text-[#E6D197] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold font-['Rozha_One',serif] text-[#1E2E1B]">
              Ready to Publish Your Royal Changes?
            </div>
            <div className="text-[10px] text-[#544230]">
              Changes instantly update across guest mobile screens and desktop preview.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-rajhara-3d px-6 py-2.5 rounded-xl text-xs font-['Cinzel',serif] tracking-wider uppercase flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Publishing...' : 'Publish Customizations'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
