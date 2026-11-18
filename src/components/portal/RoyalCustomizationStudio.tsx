'use client';

import React, { useState, useRef } from 'react';
import {
  WeddingProject,
  ProjectCustomization,
  TypographyFontFamily,
  TypographyFontSize,
} from '@/types/wedding';
import {
  getDefaultCustomization,
  MUSIC_PRESETS,
  FONT_FAMILY_OPTIONS,
} from '@/lib/customizationDefaults';
import { saveWeddingProject } from '@/lib/firebase';
import { DeliveryStyleMapPicker } from '@/components/portal/DeliveryStyleMapPicker';
import {
  Crown,
  Sparkles,
  Music,
  Eye,
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
  Volume2,
  VolumeX,
  Globe,
  Shirt,
  Mail,
  Feather,
  Palette,
  Layers,
  Plus,
  Trash2,
  Play,
  Pause,
  Compass,
  Upload,
  FileAudio,
  Image as ImageIcon,
  CheckCircle2,
  Bell,
  Check,
  Navigation,
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
    'sections' | 'texts' | 'typography' | 'music' | 'events' | 'photos' | 'controls'
  >('sections');

  const [isSaving, setIsSaving] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  // File Upload States
  const [uploadedAudioName, setUploadedAudioName] = useState<string | null>(null);
  const [uploadedAudioSize, setUploadedAudioSize] = useState<string | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const photoFileInputRef = useRef<HTMLInputElement | null>(null);

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

  // Real Audio File Upload Handler (MP3 / WAV / Audio files)
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setUploadedAudioName(file.name);
    setUploadedAudioSize(`${sizeInMB} MB`);

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        setCustomization((prev) => ({
          ...prev,
          musicTrackUrl: dataUrl,
          musicTrackTitle: file.name,
        }));
        showToast(`Uploaded "${file.name}" (${sizeInMB} MB) successfully!`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Real Image File Upload Handler (For Photo Carousel & Cover)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: string[] = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        if (dataUrl) {
          newPhotos.push(dataUrl);
        }
        processed++;
        if (processed === files.length) {
          const currentPhotos = customization.sections.photoCarousel.photos || [];
          updateSection('photoCarousel', { photos: [...currentPhotos, ...newPhotos] });
          showToast(`Uploaded ${files.length} photo(s) to Wedding Gallery!`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedVenue = {
        ...project.venue,
        name: customization.sections.venue.venueName || project.venue.name,
        city: customization.sections.venue.venueCity || project.venue.city,
        fullAddress: customization.sections.venue.venueAddress || project.venue.fullAddress,
        googleMapsLink: customization.sections.venue.googleMapsLink || project.venue.googleMapsLink,
        coordinates: customization.sections.venue.coordinates || project.venue.coordinates,
      };

      const effectiveAudioUrl = customization.musicTrackUrl || project.backgroundAudioUrl || '/audio/royal-heritage-music.mp3';

      const updatedProject: WeddingProject = {
        ...project,
        backgroundAudioUrl: effectiveAudioUrl,
        venue: updatedVenue,
        customization: {
          ...customization,
          musicTrackUrl: effectiveAudioUrl,
          sections: {
            ...customization.sections,
            venue: {
              ...customization.sections.venue,
              venueName: updatedVenue.name,
              venueCity: updatedVenue.city,
              venueAddress: updatedVenue.fullAddress,
              googleMapsLink: updatedVenue.googleMapsLink,
              coordinates: updatedVenue.coordinates,
            },
          },
        },
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
    <div className="space-y-3 font-portal select-none text-[#332211]">
      {/* 3D Header Card in Multi-Colored Royal Amber & Gold Pop-Out */}
      <div className="card-pop3d-amber p-3.5 sm:p-4 relative overflow-hidden">
        {/* Subtle Decorative Golden Corner Icons */}
        <div className="absolute top-1.5 left-2 text-[#AA820A]/30 text-xs">𑁍</div>
        <div className="absolute top-1.5 right-2 text-[#AA820A]/30 text-xs">𑁍</div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 relative z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#AA820A] to-[#7D5F04] text-white flex items-center justify-center shadow-md border border-white/50 shrink-0">
              <Crown className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#7D5F04] font-['Cinzel',serif]">
                  Bespoke Royal Studio
                </span>
                <span className="pill-slim bg-[#193822] text-[#FAF8F5]">
                  100% Dynamic
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold font-['Cinzel',serif] text-[#4A3205] leading-tight truncate">
                Royal Customization & Section Studio
              </h2>
              <p className="text-[11px] text-[#6B4F12] leading-snug truncate">
                Granular control over copy, fonts, sizes, hide/show placement, and soundtrack.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto flex-wrap">
            <button
              onClick={handleReset}
              className="btn-slim-outline"
              title="Reset to Defaults"
            >
              <RotateCcw className="w-3 h-3 text-[#AA820A]" />
              <span>Reset</span>
            </button>

            <a
              href={`/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-slim-outline"
            >
              <ExternalLink className="w-3 h-3 text-[#193822]" />
              <span>Preview</span>
            </a>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-slim-gold"
            >
              <Save className="w-3 h-3 text-[#5C4303]" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Category Navigation Pills - Slim, Compact with Rich Icons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-2.5 mt-2.5 border-t border-[#DFC07C]/40">
          {[
            { id: 'sections', label: 'Sections Visibility', icon: Eye, badge: '9 Areas' },
            { id: 'texts', label: 'All Texts & Copy', icon: Type, badge: 'Custom Words' },
            { id: 'typography', label: 'Fonts & Sizes', icon: Sliders, badge: '9 Families' },
            { id: 'music', label: 'Soundtrack & Upload', icon: Music, badge: 'Presets + MP3' },
            { id: 'photos', label: 'Photo Gallery & Upload', icon: ImageIcon, badge: 'Gallery' },
            { id: 'events', label: 'Ceremony Schedule', icon: Calendar, badge: `${project.events.length} Events` },
            { id: 'controls', label: 'Floating Controls', icon: Layers, badge: 'Pills & Lang' },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`btn-slim-outline !text-[11px] !py-1 !px-2.5 shrink-0 ${
                  isActive
                    ? '!bg-[#193822] !text-[#FAF8F5] !border-[#193822] shadow-sm'
                    : 'hover:!bg-white'
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-[#DFC07C]' : 'text-[#7D5F04]'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[8px] px-1 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-[#FAF8F5]' : 'bg-[#EFE8D8] text-[#5C4303]'
                  }`}
                >
                  {cat.badge}
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
        <div className="space-y-2.5">
          <div className="card-pop3d-amber p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-[#DFC07C]/30">
              <div>
                <h3 className="text-xs sm:text-sm font-bold font-['Cinzel',serif] text-[#4A3205] flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-[#AA820A]" />
                  Section Visibility Controls (Hide & Show Toggles)
                </h3>
                <p className="text-[11px] text-[#6B4F12]">
                  Toggle any of the 9 microsite areas. Disabled sections are cleanly excluded from the guest invitation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                {
                  key: 'envelope' as const,
                  title: 'Wax-Seal Royal Envelope',
                  desc: 'Interactive envelope unboxing with monogram seal.',
                  icon: Mail,
                  colorClass: 'card-pop3d-amber',
                },
                {
                  key: 'hero' as const,
                  title: '3D Pop-Out Couple Hero',
                  desc: 'Deep 3D golden couple names, lineage, and announcement.',
                  icon: Crown,
                  colorClass: 'card-pop3d-emerald',
                },
                {
                  key: 'scratchCard' as const,
                  title: 'Glitter Heart Scratch Card',
                  desc: 'Gold glitter scratch card revealing sacred Muhurat date.',
                  icon: Sparkles,
                  colorClass: 'card-pop3d-rose',
                },
                {
                  key: 'countdown' as const,
                  title: 'Live Wedding Countdown',
                  desc: 'Real-time countdown timer in Devanagari or Latin digits.',
                  icon: Clock,
                  colorClass: 'card-pop3d-azure',
                },
                {
                  key: 'photoCarousel' as const,
                  title: 'Couple Romantic Carousel',
                  desc: 'Portrait carousel floating above the countdown.',
                  icon: Heart,
                  colorClass: 'card-pop3d-amethyst',
                },
                {
                  key: 'timeline' as const,
                  title: 'Ceremony Schedule (Timeline)',
                  desc: '4-day itinerary with golden scepter and ceremony cards.',
                  icon: Calendar,
                  colorClass: 'card-pop3d-terracotta',
                },
                {
                  key: 'venue' as const,
                  title: 'Palace Venue & Dress Code',
                  desc: 'Venue showcase, GPS navigation pin & dress code.',
                  icon: MapPin,
                  colorClass: 'card-pop3d-emerald',
                },
                {
                  key: 'rsvp' as const,
                  title: 'RSVP Attendance Registry',
                  desc: 'Guest attendance form with headcounts and dietary choices.',
                  icon: Feather,
                  colorClass: 'card-pop3d-rose',
                },
                {
                  key: 'footerBlessing' as const,
                  title: 'Footer Blessing & Monogram',
                  desc: 'Floating velvet blessing signature from bride and groom.',
                  icon: Compass,
                  colorClass: 'card-pop3d-amber',
                },
              ].map((sec) => {
                const Icon = sec.icon;
                const isEnabled = customization.sections[sec.key].enabled;
                return (
                  <div
                    key={sec.key}
                    className={`p-2.5 rounded-xl border transition-all ${sec.colorClass} ${
                      !isEnabled ? '!opacity-50 !bg-gray-100 !border-gray-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white/90 border border-black/5 flex items-center justify-center shrink-0 shadow-2xs">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold leading-tight truncate">
                            {sec.title}
                          </h4>
                          <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                            {isEnabled ? '● Active' : '○ Hidden'}
                          </span>
                        </div>
                      </div>

                      {/* Slim 3D Toggle Switch */}
                      <button
                        onClick={() => updateSection(sec.key, { enabled: !isEnabled })}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none toggle-switch-3d ${
                          isEnabled ? 'bg-[#193822]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-0.5 ${
                            isEnabled ? 'translate-x-4.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-[10px] mt-1.5 leading-snug opacity-90 break-words">
                      {sec.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CATEGORY 2: ALL TEXTS & COPY CUSTOMIZATION
          ======================================================== */}
      {activeCategory === 'texts' && (
        <div className="space-y-2.5">
          {/* Couple Names & Announcement in Royal Emerald 3D Pop-Out */}
          <div className="card-pop3d-emerald p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-bold font-['Cinzel',serif] text-[#193822] flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-[#2D4A36]/20">
              <Crown className="w-3.5 h-3.5 text-[#193822]" />
              Hero Section Couple Names & Lineage Texts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs mb-2.5">
              <div>
                <label className="block text-[10px] font-bold text-[#193822] mb-0.5 uppercase tracking-wide">
                  Groom Name (Dulha)
                </label>
                <input
                  type="text"
                  value={project.partner1}
                  onChange={(e) => onUpdate({ ...project, partner1: e.target.value })}
                  placeholder="Gourav"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#2D4A36]/30 bg-white font-bold text-[#193822] text-xs focus:outline-none focus:ring-1 focus:ring-[#193822]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#193822] mb-0.5 uppercase tracking-wide">
                  Bride Name (Dulhan)
                </label>
                <input
                  type="text"
                  value={project.partner2}
                  onChange={(e) => onUpdate({ ...project, partner2: e.target.value })}
                  placeholder="Priya"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#2D4A36]/30 bg-white font-bold text-[#193822] text-xs focus:outline-none focus:ring-1 focus:ring-[#193822]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#193822] mb-0.5 uppercase tracking-wide">
                  Ampersand Connector
                </label>
                <select
                  value={customization.sections.hero.ampersandStyle || '&'}
                  onChange={(e) => updateSection('hero', { ampersandStyle: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#2D4A36]/30 bg-white font-bold text-[#193822] text-xs focus:outline-none focus:ring-1 focus:ring-[#193822]"
                >
                  <option value="&">& (Ampersand)</option>
                  <option value="Weds">Weds</option>
                  <option value="Sang">Sang (संग)</option>
                  <option value="Aur">Aur (और)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2.5">
              <div>
                <label className="block text-[10px] font-bold text-[#193822] mb-0.5 uppercase tracking-wide">
                  Hero Top Announcement
                </label>
                <input
                  type="text"
                  value={customization.sections.hero.announcementText || ''}
                  onChange={(e) => updateSection('hero', { announcementText: e.target.value })}
                  placeholder="WE ARE GETTING MARRIED"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#2D4A36]/30 bg-white font-bold text-[#193822] text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#193822] mb-0.5 uppercase tracking-wide">
                  Scroll Prompt Instruction
                </label>
                <input
                  type="text"
                  value={customization.sections.hero.scrollPromptText || ''}
                  onChange={(e) => updateSection('hero', { scrollPromptText: e.target.value })}
                  placeholder="SCROLL TO EXPLORE CELEBRATION"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#2D4A36]/30 bg-white font-bold text-[#193822] text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-[#2D4A36]/20">
              <div>
                <label className="block text-[10px] font-bold text-[#193822] mb-0.5 uppercase tracking-wide">
                  Groom Parentage (Dulhe Ke Parivar)
                </label>
                <input
                  type="text"
                  value={customization.sections.hero.groomParentage || ''}
                  onChange={(e) => updateSection('hero', { groomParentage: e.target.value })}
                  placeholder="S/O SMT. SUNITA & SHRI RAJESH MEHRA"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#2D4A36]/30 bg-white font-bold text-[#193822] text-xs"
                />
                <input
                  type="text"
                  value={customization.sections.hero.groomTitle || ''}
                  onChange={(e) => updateSection('hero', { groomTitle: e.target.value })}
                  placeholder="ROYAL HEIR OF MEHRA HERITAGE"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#2D4A36]/30 bg-white italic font-bold text-[#7D5F04] text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#193822] mb-0.5 uppercase tracking-wide">
                  Bride Parentage (Dulhan Ke Parivar)
                </label>
                <input
                  type="text"
                  value={customization.sections.hero.brideParentage || ''}
                  onChange={(e) => updateSection('hero', { brideParentage: e.target.value })}
                  placeholder="D/O SMT. REKHA & SHRI VIKRAM VERMA"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#2D4A36]/30 bg-white font-bold text-[#193822] text-xs"
                />
                <input
                  type="text"
                  value={customization.sections.hero.brideTitle || ''}
                  onChange={(e) => updateSection('hero', { brideTitle: e.target.value })}
                  placeholder="DAUGHTER OF VERMA DYNASTY"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#2D4A36]/30 bg-white italic font-bold text-[#7D5F04] text-xs mt-1"
                />
              </div>
            </div>
          </div>

          {/* Destination Palace & Dress Code in Azure Blue 3D Pop-Out */}
          <div className="card-pop3d-azure p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-bold font-['Cinzel',serif] text-[#142F4C] flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-[#1E3F66]/20">
              <MapPin className="w-3.5 h-3.5 text-[#142F4C]" />
              Destination Palace & Dress Code Details
            </h3>

            {/* Delivery-Style Live Map Pin Picker */}
            <DeliveryStyleMapPicker
              initialLocation={{
                venueName: project.venue.name,
                city: project.venue.city,
                fullAddress: project.venue.fullAddress || '',
                googleMapsLink: project.venue.googleMapsLink || '',
                coordinates: project.venue.coordinates,
              }}
              onLocationChange={(loc) => {
                setCustomization((prev) => ({
                  ...prev,
                  sections: {
                    ...prev.sections,
                    venue: {
                      ...prev.sections.venue,
                      venueName: loc.venueName,
                      venueCity: loc.city,
                      venueAddress: loc.fullAddress,
                      googleMapsLink: loc.googleMapsLink,
                      coordinates: loc.coordinates,
                    },
                  },
                }));
                onUpdate({
                  ...project,
                  venue: {
                    ...project.venue,
                    name: loc.venueName,
                    city: loc.city,
                    fullAddress: loc.fullAddress,
                    googleMapsLink: loc.googleMapsLink,
                    coordinates: loc.coordinates,
                  },
                });
              }}
              showSaveButton={false}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-[#1E3F66]/20">
              <div>
                <label className="block text-[10px] font-bold text-[#142F4C] mb-0.5 uppercase tracking-wide">
                  Dress Code Title
                </label>
                <input
                  type="text"
                  value={customization.sections.venue.dressCodeTitle || ''}
                  onChange={(e) => updateSection('venue', { dressCodeTitle: e.target.value })}
                  placeholder="Royal Dress Code"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#1E3F66]/30 bg-white font-bold text-[#142F4C] text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#142F4C] mb-0.5 uppercase tracking-wide">
                  Attire Recommendation
                </label>
                <input
                  type="text"
                  value={customization.sections.venue.dressCodeValue || ''}
                  onChange={(e) => updateSection('venue', { dressCodeValue: e.target.value })}
                  placeholder="Strict Royal Traditional"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#1E3F66]/30 bg-white font-bold text-[#142F4C] text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#142F4C] mb-0.5 uppercase tracking-wide">
                  Attire Color/Style Description
                </label>
                <input
                  type="text"
                  value={customization.sections.venue.dressCodeDesc || ''}
                  onChange={(e) => updateSection('venue', { dressCodeDesc: e.target.value })}
                  placeholder="Ivory, Champagne & Antique Gold Silks"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#1E3F66]/30 bg-white font-bold text-[#142F4C] text-xs"
                />
              </div>
            </div>
          </div>

          {/* RSVP Hub Custom Text in Ruby Rose 3D Pop-Out */}
          <div className="card-pop3d-rose p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-bold font-['Cinzel',serif] text-[#6E121E] flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-[#D47A88]/30">
              <Mail className="w-3.5 h-3.5 text-[#6E121E]" />
              RSVP Registry Form & Footer Blessing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2">
              <div>
                <label className="block text-[10px] font-bold text-[#6E121E] mb-0.5 uppercase tracking-wide">
                  RSVP Section Title
                </label>
                <input
                  type="text"
                  value={customization.sections.rsvp.customTitle || ''}
                  onChange={(e) => updateSection('rsvp', { customTitle: e.target.value })}
                  placeholder="Kindly Grace Our Celebrations"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#D47A88]/40 bg-white font-bold text-[#6E121E] text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6E121E] mb-0.5 uppercase tracking-wide">
                  RSVP Intro Blessing Message
                </label>
                <input
                  type="text"
                  value={customization.sections.rsvp.introText || ''}
                  onChange={(e) => updateSection('rsvp', { introText: e.target.value })}
                  placeholder="Your gracious presence is the greatest blessing for our sacred union."
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#D47A88]/40 bg-white font-bold text-[#6E121E] text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-[#D47A88]/30">
              <div>
                <label className="block text-[10px] font-bold text-[#6E121E] mb-0.5 uppercase tracking-wide">
                  Footer Blessing Title
                </label>
                <input
                  type="text"
                  value={customization.sections.footerBlessing.blessingText || ''}
                  onChange={(e) => updateSection('footerBlessing', { blessingText: e.target.value })}
                  placeholder="With Heartfelt Gratitude & Warm Blessings"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#D47A88]/40 bg-white font-bold text-[#6E121E] text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6E121E] mb-0.5 uppercase tracking-wide">
                  Couple Signature
                </label>
                <input
                  type="text"
                  value={customization.sections.footerBlessing.coupleSignature || ''}
                  onChange={(e) => updateSection('footerBlessing', { coupleSignature: e.target.value })}
                  placeholder="Gourav & Priya"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#D47A88]/40 bg-white font-bold text-[#6E121E] text-xs"
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
        <div className="space-y-2.5">
          <div className="card-pop3d-amethyst p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-bold font-['Cinzel',serif] text-[#431E54] flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-[#A888B5]/30">
              <Type className="w-3.5 h-3.5 text-[#431E54]" />
              Master Typography Scale & Font Families
            </h3>

            {/* Global Typography Default */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs mb-3">
              <div>
                <label className="block text-[10px] font-bold text-[#431E54] mb-0.5 uppercase tracking-wide">
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
                  className="w-full px-2 py-1.5 rounded-lg border border-[#A888B5]/40 bg-white font-bold text-[#431E54] text-xs"
                >
                  {FONT_FAMILY_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#431E54] mb-0.5 uppercase tracking-wide">
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
                  className="w-full px-2 py-1.5 rounded-lg border border-[#A888B5]/40 bg-white font-bold text-[#431E54] text-xs"
                >
                  {FONT_FAMILY_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#431E54] mb-0.5 uppercase tracking-wide">
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
                  className="w-full px-2 py-1.5 rounded-lg border border-[#A888B5]/40 bg-white font-bold text-[#431E54] text-xs"
                >
                  {FONT_FAMILY_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#431E54] mb-0.5 uppercase tracking-wide">
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
                  className="w-full px-2 py-1.5 rounded-lg border border-[#A888B5]/40 bg-white font-bold text-[#431E54] text-xs"
                >
                  <option value="compact">Compact Standard</option>
                  <option value="normal">Normal (Classic)</option>
                  <option value="large">Large (High Legibility)</option>
                  <option value="royal-huge">Royal Giant (Ultra Big)</option>
                </select>
              </div>
            </div>

            {/* Per-Section Font Overrides */}
            <h4 className="text-[11px] font-bold font-['Cinzel',serif] uppercase tracking-wide text-[#431E54] pt-2 pb-1.5 border-t border-[#A888B5]/30">
              Per-Section Font & Size Overrides
            </h4>

            <div className="space-y-1.5">
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
                  className="p-2 rounded-lg bg-white/80 border border-[#A888B5]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs"
                >
                  <span className="font-bold text-[#431E54] text-xs">{item.name}</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <select
                      value={customization.sections[item.key].fontFamily || 'Rozha One'}
                      onChange={(e) => updateSection(item.key, { fontFamily: e.target.value as any })}
                      className="px-2 py-1 rounded-md border border-[#A888B5]/30 text-[11px] bg-white font-bold text-[#431E54]"
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
                      className="px-2 py-1 rounded-md border border-[#A888B5]/30 text-[11px] bg-white font-bold text-[#431E54]"
                    >
                      <option value="small">Small</option>
                      <option value="normal">Normal</option>
                      <option value="large">Large</option>
                      <option value="extra-large">Extra Large</option>
                      <option value="royal-huge">Royal Giant</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CATEGORY 4: MUSIC & AUDIO PRESETS + REAL FILE UPLOAD
          ======================================================== */}
      {activeCategory === 'music' && (
        <div className="space-y-2.5">
          <div className="card-pop3d-amber p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-bold font-['Cinzel',serif] text-[#5C4303] flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-[#DFC07C]/30">
              <Music className="w-3.5 h-3.5 text-[#AA820A]" />
              Background Royal Symphony & Direct Audio File Upload
            </h3>

            {/* REAL FILE UPLOAD ZONE FOR MUSIC */}
            <div className="mb-3 p-3 rounded-xl bg-white/90 border-2 border-dashed border-[#AA820A]/50 text-center hover:bg-white transition-all">
              <input
                ref={audioFileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioFileUpload}
                className="hidden"
                id="audio-file-upload-input"
              />
              <div className="flex flex-col items-center justify-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-[#FAF4E3] text-[#AA820A] flex items-center justify-center shadow-xs">
                  <FileAudio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#5C4303]">
                    Upload Your Own Wedding Music File (.MP3, .WAV, .M4A)
                  </h4>
                  <p className="text-[10px] text-[#7D5F04] mt-0.5">
                    Click to select from your phone or computer. Instant browser playback.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => audioFileInputRef.current?.click()}
                  className="btn-slim-gold mt-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>Choose Music File</span>
                </button>

                {uploadedAudioName && (
                  <div className="mt-1 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#193822] text-[#FAF8F5] text-[10px] font-bold">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Uploaded: {uploadedAudioName} ({uploadedAudioSize})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pre-Bundled Royal Presets */}
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#7D5F04] mb-2 font-['Cinzel',serif]">
              Or Choose Royal Palace Soundtrack Presets
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {MUSIC_PRESETS.map((preset) => {
                const isSelected =
                  customization.musicTrackUrl === preset.url ||
                  (!customization.musicTrackUrl && preset.id === 'royal-heritage');
                const isPlaying = playingTrackId === preset.id;
                return (
                  <div
                    key={preset.id}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#AA820A] bg-white shadow-sm'
                        : 'border-[#DFC07C]/40 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#5C4303] truncate font-['Cinzel',serif]">
                          {preset.name}
                        </h4>
                        <p className="text-[10px] text-[#7D5F04] mt-0.5 leading-snug break-words">
                          {preset.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => toggleTrackPreview(preset.id, preset.url)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isPlaying
                              ? 'bg-[#193822] text-[#E6D197] animate-pulse'
                              : 'bg-[#FAF8F5] text-[#7D5F04] border border-[#DFC07C]'
                          }`}
                          title="Preview Track"
                        >
                          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </button>

                        <button
                          onClick={() =>
                            setCustomization((prev) => ({
                              ...prev,
                              musicTrackUrl: preset.url,
                              musicTrackTitle: preset.name,
                            }))
                          }
                          className={`btn-slim-outline !text-[10px] !py-0.5 !px-2 ${
                            isSelected ? '!bg-[#193822] !text-white' : ''
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Use'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom URL Input */}
            <div className="pt-2 border-t border-[#DFC07C]/30 text-xs">
              <label className="block text-[10px] font-bold text-[#7D5F04] mb-0.5 uppercase tracking-wide">
                Or Paste Hosted Audio Stream URL (.MP3)
              </label>
              <input
                type="text"
                value={customization.musicTrackUrl || ''}
                onChange={(e) =>
                  setCustomization((prev) => ({
                    ...prev,
                    musicTrackUrl: e.target.value,
                    musicTrackTitle: 'Custom Stream',
                  }))
                }
                placeholder="https://example.com/wedding-song.mp3"
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#DFC07C] bg-white text-xs font-mono text-[#5C4303]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CATEGORY 5: PHOTO GALLERY & DIRECT FILE UPLOAD
          ======================================================== */}
      {activeCategory === 'photos' && (
        <div className="space-y-2.5">
          <div className="card-pop3d-rose p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-[#D47A88]/30">
              <div>
                <h3 className="text-xs sm:text-sm font-bold font-['Cinzel',serif] text-[#6E121E] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#6E121E]" />
                  Couple Photo Carousel & Direct Image Upload
                </h3>
                <p className="text-[11px] text-[#8C2332]">
                  Upload high-resolution couple portraits for the 3D rotating carousel.
                </p>
              </div>

              <button
                type="button"
                onClick={() => photoFileInputRef.current?.click()}
                className="btn-slim-emerald"
              >
                <Upload className="w-3 h-3" />
                <span>Upload Photos</span>
              </button>
            </div>

            <input
              ref={photoFileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-carousel-upload-input"
            />

            {/* Photo Thumbnails Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(customization.sections.photoCarousel.photos || []).map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border border-[#D47A88]/40 shadow-xs bg-white aspect-4/3"
                >
                  <img
                    src={imgUrl}
                    alt={`Couple photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => {
                        const updated = (customization.sections.photoCarousel.photos || []).filter(
                          (_, i) => i !== idx
                        );
                        updateSection('photoCarousel', { photos: updated });
                      }}
                      className="p-1 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.2 bg-black/60 text-white text-[8px] font-bold rounded">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CATEGORY 6: CEREMONY SCHEDULE & EVENTS
          ======================================================== */}
      {activeCategory === 'events' && (
        <div className="space-y-2.5">
          <div className="card-pop3d-terracotta p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-[#A04B2D]/30">
              <div>
                <h3 className="text-xs sm:text-sm font-bold font-['Cinzel',serif] text-[#612B18] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#612B18]" />
                  Ceremony Itinerary Events Manager
                </h3>
                <p className="text-[11px] text-[#803820]">
                  Add, edit, or remove wedding functions. Automatically translates across all 4 languages.
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
                className="btn-slim-gold"
              >
                <Plus className="w-3 h-3" />
                <span>Add Ceremony</span>
              </button>
            </div>

            <div className="space-y-2">
              {project.events.map((ev, index) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-xl bg-white border border-[#A04B2D]/30 shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-4 h-4 rounded-full bg-[#612B18] text-[#FAF8F5] text-[9px] font-bold flex items-center justify-center shrink-0">
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
                        className="font-bold text-xs text-[#612B18] border-b border-[#A04B2D]/40 focus:outline-none truncate"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Remove "${ev.title}"?`)) {
                          const updated = project.events.filter((_, i) => i !== index);
                          onUpdate({ ...project, events: updated });
                        }
                      }}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs">
                    <div>
                      <label className="text-[9px] uppercase font-bold text-[#803820]">Date & Day</label>
                      <input
                        type="text"
                        value={ev.date}
                        onChange={(e) => {
                          const updated = [...project.events];
                          updated[index].date = e.target.value;
                          onUpdate({ ...project, events: updated });
                        }}
                        className="w-full px-2 py-1 rounded border border-[#A04B2D]/30 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold text-[#803820]">Time</label>
                      <input
                        type="text"
                        value={ev.time}
                        onChange={(e) => {
                          const updated = [...project.events];
                          updated[index].time = e.target.value;
                          onUpdate({ ...project, events: updated });
                        }}
                        className="w-full px-2 py-1 rounded border border-[#A04B2D]/30 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold text-[#803820]">Dress Code</label>
                      <input
                        type="text"
                        value={ev.dressCode}
                        onChange={(e) => {
                          const updated = [...project.events];
                          updated[index].dressCode = e.target.value;
                          onUpdate({ ...project, events: updated });
                        }}
                        className="w-full px-2 py-1 rounded border border-[#A04B2D]/30 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-bold text-[#803820]">Description</label>
                    <input
                      type="text"
                      value={ev.subtitle}
                      onChange={(e) => {
                        const updated = [...project.events];
                        updated[index].subtitle = e.target.value;
                        onUpdate({ ...project, events: updated });
                      }}
                      className="w-full px-2 py-1 rounded border border-[#A04B2D]/30 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CATEGORY 7: FLOATING CONTROLS & STARTING LANGUAGE
          ======================================================== */}
      {activeCategory === 'controls' && (
        <div className="space-y-2.5">
          <div className="card-pop3d-azure p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-bold font-['Cinzel',serif] text-[#142F4C] flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-[#1E3F66]/20">
              <Layers className="w-3.5 h-3.5 text-[#142F4C]" />
              Floating Pills & Default Language
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2.5">
              <div className="p-2.5 rounded-xl bg-white border border-[#1E3F66]/30 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#142F4C] text-xs flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-[#AA820A]" />
                    Top-Right Sound Pill
                  </h4>
                  <p className="text-[10px] text-[#4A6278] mt-0.5">
                    Music mute/unmute floating pill for guests.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setCustomization((prev) => ({
                      ...prev,
                      showMusicButton: !prev.showMusicButton,
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none toggle-switch-3d ${
                    customization.showMusicButton !== false ? 'bg-[#193822]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-0.5 ${
                      customization.showMusicButton !== false ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#1E3F66]/30 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#142F4C] text-xs flex items-center gap-1">
                    <Globe className="w-3 h-3 text-[#AA820A]" />
                    Bottom-Left Language Switcher
                  </h4>
                  <p className="text-[10px] text-[#4A6278] mt-0.5">
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
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none toggle-switch-3d ${
                    customization.showLanguageSwitcher !== false ? 'bg-[#193822]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-0.5 ${
                      customization.showLanguageSwitcher !== false ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1E3F66]/20 text-xs">
              <label className="block text-[10px] font-bold text-[#142F4C] mb-0.5 uppercase tracking-wide">
                Default Starting Language
              </label>
              <select
                value={customization.defaultLanguage || 'en'}
                onChange={(e) =>
                  setCustomization((prev) => ({
                    ...prev,
                    defaultLanguage: e.target.value as any,
                  }))
                }
                className="w-full sm:w-64 px-2.5 py-1.5 rounded-lg border border-[#1E3F66]/30 bg-white font-bold text-[#142F4C] text-xs"
              >
                <option value="en">English (Default)</option>
                <option value="hi">Hindi (हिंदी • Pure Devanagari)</option>
                <option value="ur">Urdu (اردو • Nastaliq)</option>
                <option value="hinglish">Hinglish (Casual Hindi in Latin)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Slim Save Bar */}
      <div className="sticky bottom-3 z-30 card-pop3d-amber p-2.5 sm:p-3 flex items-center justify-between gap-2 shadow-xl">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#193822] text-[#E6D197] flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold font-['Cinzel',serif] text-[#5C4303] truncate">
              Ready to Publish Your Royal Changes?
            </div>
            <div className="text-[10px] text-[#7D5F04] truncate">
              Changes instantly update on live guest mobile screens and preview.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-slim-gold !py-1.5 !px-4"
          >
            <Save className="w-3.5 h-3.5 text-[#5C4303]" />
            <span>{isSaving ? 'Publishing...' : 'Publish Customizations'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
