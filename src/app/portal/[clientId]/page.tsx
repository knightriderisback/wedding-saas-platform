'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  WeddingProject,
  GuestContact,
  SongRequest,
  VoiceBlessing,
  EventScheduleItem,
  MenuItem,
} from '@/types/wedding';
import {
  getWeddingProject,
  saveWeddingProject,
  uploadMediaFile,
  markWhatsAppSent,
  parseProjectFromSlug,
} from '@/lib/firebase';
import { exportDjPlaylistPdf } from '@/lib/djPdfGenerator';
import { defaultWeddingProject } from '@/lib/mockData';
import { TEMPLATE_LIST } from '@/lib/pressedLoveTemplates';
import { AcrylicBackgroundOrbs } from '@/components/common/AcrylicBackgroundOrbs';
import {
  Crown,
  Sparkles,
  Users,
  Music,
  Heart,
  Upload,
  Plus,
  Trash2,
  Check,
  Play,
  Pause,
  Download,
  Phone,
  MessageCircle,
  Sliders,
  Eye,
  Camera,
  ExternalLink,
  Copy,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Mic,
  Palette,
  ArrowLeft,
  X,
  FileSpreadsheet,
  Edit2,
  Utensils,
  Share2,
  Search,
} from 'lucide-react';

function ClientPortalContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isShadowAdmin = searchParams.get('shadowAdmin') === 'true';
  const clientId = (params?.clientId as string) || 'client-gourav-priya';

  const [project, setProject] = useState<WeddingProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'guests' | 'dj' | 'blessings' | 'content' | 'media' | 'suites'
  >('overview');

  // Search & Filter
  const [guestSearch, setGuestSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState<'all' | 'sent' | 'pending' | 'attending' | 'declined'>('all');

  // Contact Picker & Add Guest Modal
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');

  // Add Song Modal
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [newSongTitle, setNewSongTitle] = useState('');
  const [newSongArtist, setNewSongArtist] = useState('');
  const [newSongGuest, setNewSongGuest] = useState('');
  const [newSongNotes, setNewSongNotes] = useState('');

  // Audio Playback State for Blessings
  const [playingBlessingId, setPlayingBlessingId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    const data = await getWeddingProject(clientId);
    const p = data || parseProjectFromSlug(clientId);
    setProject(p);
    if (p?.partner1) {
      document.title = `${p.partner1} & ${p.partner2 || ''} | Wedding Client Portal`;
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [clientId]);

  // Aggregated Telemetry
  const guests = useMemo(() => project?.guests || [], [project]);
  const djPlaylist = useMemo(() => project?.djPlaylist || [], [project]);
  const blessings = useMemo(() => project?.blessings || [], [project]);

  const dispatchedCount = useMemo(
    () => guests.filter((g) => g.sentWhatsApp).length,
    [guests]
  );
  const attendingCount = useMemo(
    () => guests.filter((g) => g.rsvpStatus === 'attending').length,
    [guests]
  );
  const totalAttendingHeadcount = useMemo(
    () =>
      guests
        .filter((g) => g.rsvpStatus === 'attending')
        .reduce((sum, g) => sum + (g.attendingCount || 1), 0),
    [guests]
  );

  // Filtered Guests
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchQuery =
        g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
        g.phone.includes(guestSearch);
      if (!matchQuery) return false;

      if (guestFilter === 'sent') return g.sentWhatsApp;
      if (guestFilter === 'pending') return !g.sentWhatsApp;
      if (guestFilter === 'attending') return g.rsvpStatus === 'attending';
      if (guestFilter === 'declined') return g.rsvpStatus === 'declined';
      return true;
    });
  }, [guests, guestSearch, guestFilter]);

  // 1-Click WhatsApp Dispatch for Single Guest
  const handleDispatchWhatsApp = async (guest: GuestContact) => {
    if (!project) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const inviteUrl = `${origin}/${project.slug}?guest=${encodeURIComponent(guest.name)}`;

    const message = `॥ श्री गणेशाय नमः ॥ 🙏✨\n\nRespected ${guest.name},\n\nWith the divine blessings of our elders and Almighty, ${project.partner1} & ${project.partner2} warmly invite you and your family to celebrate our wedding at ${project.venue.name}, ${project.venue.city}.\n\nPlease open your personalized royal wedding invitation below:\n${inviteUrl}\n\nKindly confirm your presence & request your favorite songs for our Sangeet night!\n\nWarm regards,\n${project.partner1.split(' ')[0]} & ${project.partner2.split(' ')[0]}`;

    const cleanPhone = guest.phone.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');

    await markWhatsAppSent(project.slug, guest.id);
    const updated = await getWeddingProject(clientId);
    if (updated) setProject(updated);
    showToast(`WhatsApp invitation dispatched to ${guest.name}!`);
  };

  // Add from Phone Contacts (Web Contact Picker API)
  const handleImportPhoneContacts = async () => {
    if (!project) return;
    try {
      if ('contacts' in navigator && 'select' in (navigator as any).contacts) {
        const props = ['name', 'tel'];
        const contacts = await (navigator as any).contacts.select(props, { multiple: true });
        if (contacts && contacts.length > 0) {
          const newGuests: GuestContact[] = contacts.map((c: any, idx: number) => ({
            id: `g-import-${Date.now()}-${idx}`,
            name: c.name?.[0] || 'Imported Guest',
            phone: c.tel?.[0] || '',
            sentWhatsApp: false,
            rsvpStatus: 'pending',
            attendingCount: 0,
          }));

          const updatedProject = {
            ...project,
            guests: [...project.guests, ...newGuests],
          };
          await saveWeddingProject(updatedProject);
          setProject(updatedProject);
          showToast(`Successfully imported ${newGuests.length} contacts from phone!`);
          return;
        }
      }
    } catch (e) {
      console.warn('Contact picker error or cancelled:', e);
    }

    // Fallback prompt if Contact Picker not supported in current browser
    setShowAddGuestModal(true);
  };

  // Add Guest Manual Submit
  const handleAddGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !newGuestName.trim()) return;

    const newGuest: GuestContact = {
      id: `g-${Date.now()}`,
      name: newGuestName.trim(),
      phone: newGuestPhone.trim(),
      sentWhatsApp: false,
      rsvpStatus: 'pending',
      attendingCount: 0,
    };

    const updated = {
      ...project,
      guests: [newGuest, ...project.guests],
    };

    await saveWeddingProject(updated);
    setProject(updated);
    setShowAddGuestModal(false);
    setNewGuestName('');
    setNewGuestPhone('');
    showToast(`Added ${newGuest.name} to guest registry!`);
  };

  // Export DJ Playlist PDF
  const handleExportDjPdf = () => {
    if (!project) return;
    exportDjPlaylistPdf(project, djPlaylist);
    showToast('Official Sangeet DJ Playlist PDF generated & downloaded!');
  };

  // Switch Active Template Suite
  const handleSwitchSuite = async (suiteId: string) => {
    if (!project) return;
    const updated: WeddingProject = { ...project, suite: suiteId, template: suiteId };
    await saveWeddingProject(updated);
    setProject(updated);
    showToast(`Activated ${suiteId} as your primary wedding suite!`);
  };

  // Bottom Navigation Items (matching Rajhara Express dock)
  const navItems = [
    { id: 'overview', icon: Crown, label: 'Overview' },
    { id: 'guests', icon: Users, label: 'Guests' },
    { id: 'dj', icon: Music, label: 'DJ Playlist' },
    { id: 'blessings', icon: Mic, label: 'Blessings' },
    { id: 'content', icon: Edit2, label: 'Editor' },
    { id: 'suites', icon: Palette, label: 'Suites' },
  ];

  // Tab Config mapping with soft acrylic styling & high-contrast deep walnut typography
  const tabConfig = {
    overview: {
      title: 'Celebration Dashboard & Live Telemetry',
      shortTitle: 'Overview',
      icon: Crown,
      subtitle: `${project?.partner1 || 'Couple'} & ${project?.partner2 || ''} Wedding Portal`,
      badge: `${attendingCount} Attending`,
      acrylicClass: 'acrylic-amber card-3d-elevated',
      border: 'border-[#AA820A]/40',
      shadowGlow: 'shadow-[0_12px_32px_rgba(170,130,10,0.12)]',
      iconBg: 'bg-white/80 shadow-xs border border-[#AA820A]/30',
      iconColor: 'text-[#AA820A]',
      breadcrumbColor: 'text-[#7D5F04]',
      badgeBg: 'bg-white/80',
      badgeText: 'text-[#7D5F04]',
      badgeBorder: 'border-[#AA820A]/40',
      titleColor: 'text-[#2C2218]',
      subtitleColor: 'text-[#544230]',
      pillBg: 'bg-white/80 backdrop-blur-sm',
      pillBorder: 'border-[#AA820A]/30',
      pillText: 'text-[#544230]',
      highlightText: 'text-[#7D5F04]',
    },
    guests: {
      title: 'Guest & Invitation Hub (Phone Import & 1-Click WhatsApp)',
      shortTitle: 'Guest Hub',
      icon: Users,
      subtitle: 'Import phone contacts, dispatch wa.me invites, and monitor live RSVPs',
      badge: `${dispatchedCount}/${guests.length} Sent`,
      acrylicClass: 'acrylic-rose card-3d-elevated',
      border: 'border-[#D47A88]/40',
      shadowGlow: 'shadow-[0_12px_32px_rgba(155,28,46,0.1)]',
      iconBg: 'bg-white/80 shadow-xs border border-[#D47A88]/30',
      iconColor: 'text-[#9B1C2E]',
      breadcrumbColor: 'text-[#9B1C2E]',
      badgeBg: 'bg-white/80',
      badgeText: 'text-[#9B1C2E]',
      badgeBorder: 'border-[#D47A88]/40',
      titleColor: 'text-[#2C2218]',
      subtitleColor: 'text-[#544230]',
      pillBg: 'bg-white/80 backdrop-blur-sm',
      pillBorder: 'border-[#D47A88]/30',
      pillText: 'text-[#544230]',
      highlightText: 'text-[#9B1C2E]',
    },
    dj: {
      title: 'Sangeet DJ Playlist Manager & 1-Click PDF Export',
      shortTitle: 'DJ Playlist',
      icon: Music,
      subtitle: 'Guest-submitted dance anthems with dedication notes and phone verification',
      badge: `${djPlaylist.length} Songs Queued`,
      acrylicClass: 'acrylic-sage card-3d-elevated',
      border: 'border-[#739B83]/40',
      shadowGlow: 'shadow-[0_12px_32px_rgba(45,74,54,0.1)]',
      iconBg: 'bg-white/80 shadow-xs border border-[#739B83]/30',
      iconColor: 'text-[#2D4A36]',
      breadcrumbColor: 'text-[#2D4A36]',
      badgeBg: 'bg-white/80',
      badgeText: 'text-[#2D4A36]',
      badgeBorder: 'border-[#739B83]/40',
      titleColor: 'text-[#2C2218]',
      subtitleColor: 'text-[#544230]',
      pillBg: 'bg-white/80 backdrop-blur-sm',
      pillBorder: 'border-[#739B83]/30',
      pillText: 'text-[#544230]',
      highlightText: 'text-[#2D4A36]',
    },
    blessings: {
      title: 'Voice Notes Audio Player & Blessings Hub',
      shortTitle: 'Voice Blessings',
      icon: Mic,
      subtitle: 'Personal microphone voice recordings left by family and cherished friends',
      badge: `${blessings.length} Recorded`,
      acrylicClass: 'acrylic-lilac card-3d-elevated',
      border: 'border-[#A888B5]/40',
      shadowGlow: 'shadow-[0_12px_32px_rgba(107,59,130,0.1)]',
      iconBg: 'bg-white/80 shadow-xs border border-[#A888B5]/30',
      iconColor: 'text-[#6B3B82]',
      breadcrumbColor: 'text-[#6B3B82]',
      badgeBg: 'bg-white/80',
      badgeText: 'text-[#6B3B82]',
      badgeBorder: 'border-[#A888B5]/40',
      titleColor: 'text-[#2C2218]',
      subtitleColor: 'text-[#544230]',
      pillBg: 'bg-white/80 backdrop-blur-sm',
      pillBorder: 'border-[#A888B5]/30',
      pillText: 'text-[#544230]',
      highlightText: 'text-[#6B3B82]',
    },
    content: {
      title: 'Event Schedule, Royal Menu & Story Editor',
      shortTitle: 'Content Editor',
      icon: Edit2,
      subtitle: 'Customise your couple names, wedding date, dress codes, and food dishes',
      badge: 'Live Editor',
      acrylicClass: 'acrylic-amber card-3d-elevated',
      border: 'border-[#AA820A]/40',
      shadowGlow: 'shadow-[0_12px_32px_rgba(170,130,10,0.12)]',
      iconBg: 'bg-white/80 shadow-xs border border-[#AA820A]/30',
      iconColor: 'text-[#AA820A]',
      breadcrumbColor: 'text-[#7D5F04]',
      badgeBg: 'bg-white/80',
      badgeText: 'text-[#7D5F04]',
      badgeBorder: 'border-[#AA820A]/40',
      titleColor: 'text-[#2C2218]',
      subtitleColor: 'text-[#544230]',
      pillBg: 'bg-white/80 backdrop-blur-sm',
      pillBorder: 'border-[#AA820A]/30',
      pillText: 'text-[#544230]',
      highlightText: 'text-[#7D5F04]',
    },
    media: {
      title: 'Media Uploader & Cover Gallery',
      shortTitle: 'Media Studio',
      icon: Camera,
      subtitle: 'Upload couple portraits, background audio, and cover visuals to storage',
      badge: 'Cloud Storage',
      acrylicClass: 'acrylic-azure card-3d-elevated',
      border: 'border-[#6B9AC4]/40',
      shadowGlow: 'shadow-[0_12px_32px_rgba(30,63,102,0.1)]',
      iconBg: 'bg-white/80 shadow-xs border border-[#6B9AC4]/30',
      iconColor: 'text-[#1E3F66]',
      breadcrumbColor: 'text-[#1E3F66]',
      badgeBg: 'bg-white/80',
      badgeText: 'text-[#1E3F66]',
      badgeBorder: 'border-[#6B9AC4]/40',
      titleColor: 'text-[#2C2218]',
      subtitleColor: 'text-[#544230]',
      pillBg: 'bg-white/80 backdrop-blur-sm',
      pillBorder: 'border-[#6B9AC4]/30',
      pillText: 'text-[#544230]',
      highlightText: 'text-[#1E3F66]',
    },
    suites: {
      title: 'Luxury Design Suites Switcher',
      shortTitle: 'Design Suites',
      icon: Palette,
      subtitle: 'Select any PressedLove or Royal Palace template for your wedding microsite',
      badge: `${TEMPLATE_LIST.length} Suites`,
      acrylicClass: 'acrylic-azure card-3d-elevated',
      border: 'border-[#6B9AC4]/40',
      shadowGlow: 'shadow-[0_12px_32px_rgba(30,63,102,0.1)]',
      iconBg: 'bg-white/80 shadow-xs border border-[#6B9AC4]/30',
      iconColor: 'text-[#1E3F66]',
      breadcrumbColor: 'text-[#1E3F66]',
      badgeBg: 'bg-white/80',
      badgeText: 'text-[#1E3F66]',
      badgeBorder: 'border-[#6B9AC4]/40',
      titleColor: 'text-[#2C2218]',
      subtitleColor: 'text-[#544230]',
      pillBg: 'bg-white/80 backdrop-blur-sm',
      pillBorder: 'border-[#6B9AC4]/30',
      pillText: 'text-[#544230]',
      highlightText: 'text-[#1E3F66]',
    },
  };

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#7D5F04] flex items-center justify-center font-cinzel text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2 text-[#D4AF37]" />
        Opening Royal Client Studio...
      </div>
    );
  }

  const currentTab = tabConfig[activeTab];
  const CurrentTabIcon = currentTab.icon;

  return (
    <div className="min-h-screen bg-khadi-fabric relative overflow-hidden pb-24 text-[#2C2218] selection:bg-[#D4AF37]/30 selection:text-[#2C2218]">
      {/* 3D Ambient Refractive Bubbles & Glass Orbs */}
      <AcrylicBackgroundOrbs variant="multi" />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-3 right-3 z-50 bg-[#2C2218] text-[#FAF8F5] px-4 py-2 rounded-xl border border-[#AA820A] shadow-xl text-xs font-cinzel flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ULTRA-SLIM STICKY CLIENT HEADER (Rajhara Express Pattern in Luxury Soft Gold/Alabaster) */}
      <header className="bg-white/90 backdrop-blur-md text-[#2C2218] sticky top-0 z-30 border-b border-[#E8DFC8] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          {/* Left: Store Link & Title */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin"
              className="p-1.5 rounded-lg bg-[#FAF4E3] hover:bg-[#F3E5AB] text-[#7D5F04] border border-[#AA820A]/30 transition shadow-2xs"
              title="Return to Master Admin"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#AA820A] via-[#D4AF37] to-[#FAF4E3] flex items-center justify-center text-white font-cinzel font-bold text-xs shadow-xs">
              {project.partner1[0]}&{project.partner2[0]}
            </div>
            <div className="leading-tight">
              <span className="font-cinzel font-black text-xs sm:text-sm tracking-tight text-[#2C2218]">
                {project.partner1.split(' ')[0]} & {project.partner2.split(' ')[0]} Wedding Studio
              </span>
              <span className="text-[10px] text-[#7D5F04] font-serif ml-1.5 hidden sm:inline">
                • {project.venue.city}
              </span>
            </div>
          </div>

          {/* Right: Preview Live Microsite, + Add Guest & Shadow Status */}
          <div className="flex items-center gap-1.5">
            <Link
              href={`/${project.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF4E3] hover:bg-[#F3E5AB] text-[#7D5F04] text-xs font-cinzel font-bold transition shadow-2xs border border-[#AA820A]/40"
              title="Preview Live Wedding Microsite"
            >
              <Eye className="w-3.5 h-3.5 text-[#AA820A] shrink-0" />
              <span className="hidden sm:inline">Live Microsite</span>
            </Link>

            <button
              onClick={() => setShowAddGuestModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 text-[#2C2218] font-cinzel font-black text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
              title="Add Guest"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Add Guest</span>
            </button>

            {isShadowAdmin && (
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-900 text-xs font-mono font-bold flex items-center gap-1 border border-amber-300 shadow-2xs">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline text-[10px]">Shadow Mode (Super Admin)</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-4 py-3 space-y-3 relative z-10">
        {/* Dynamic Section Heading Banner with soft acrylic styling */}
        <div
          className={`${currentTab.acrylicClass} rounded-2xl p-3.5 sm:p-5 shadow-md ${currentTab.shadowGlow} border ${currentTab.border} flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300 relative overflow-hidden`}
        >
          <div className="flex items-center gap-3 min-w-0 relative z-10">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${currentTab.iconBg} ${currentTab.iconColor} flex items-center justify-center shrink-0 shadow-sm font-black`}
            >
              <CurrentTabIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[9px] sm:text-[10px] uppercase font-bold font-cinzel ${currentTab.breadcrumbColor} tracking-wider`}
                >
                  Client Portal / {currentTab.shortTitle}
                </span>
                <span
                  className={`text-[9px] ${currentTab.badgeBg} ${currentTab.badgeText} border ${currentTab.badgeBorder} px-2.5 py-0.5 rounded-full font-bold font-mono shadow-2xs`}
                >
                  {currentTab.badge}
                </span>
              </div>
              <h1 className={`text-sm sm:text-base font-cinzel font-black ${currentTab.titleColor} tracking-tight leading-tight mt-0.5 truncate`}>
                {currentTab.title}
              </h1>
              <p className={`text-[10px] sm:text-[11px] ${currentTab.subtitleColor} mt-0.5 leading-snug font-sans`}>
                {currentTab.subtitle}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 self-start sm:self-auto shrink-0 ${currentTab.pillBg} px-3 py-1.5 rounded-xl border ${currentTab.pillBorder} text-[10px] ${currentTab.pillText} shadow-2xs relative z-10`}
          >
            <span className="font-medium">Active Tab:</span>
            <span className={`font-black ${currentTab.highlightText} bg-white/90 border border-black/5 px-2 py-0.5 rounded-md shadow-2xs`}>
              {currentTab.shortTitle}
            </span>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            {/* Metric Cards - 3D Soft Acrylic Cards with Bevel Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="card-3d acrylic-amber p-3.5 sm:p-4 rounded-2xl border border-[#AA820A]/30 shadow-md">
                <div className="text-[10px] font-cinzel font-bold text-[#7D5F04] uppercase tracking-wider">Total Guests</div>
                <div className="text-lg sm:text-2xl font-black text-[#2C2218] mt-0.5">{guests.length}</div>
                <div className="text-[10px] text-[#7D5F04] font-medium mt-0.5">Invited in Registry</div>
              </div>

              <div className="card-3d acrylic-sage p-3.5 sm:p-4 rounded-2xl border border-[#739B83]/30 shadow-md">
                <div className="text-[10px] font-cinzel font-bold text-[#2D4A36] uppercase tracking-wider">Invites Sent</div>
                <div className="text-lg sm:text-2xl font-black text-[#2D4A36] mt-0.5">{dispatchedCount}</div>
                <div className="text-[10px] text-[#2D4A36] font-medium mt-0.5">
                  {guests.length > 0 ? Math.round((dispatchedCount / guests.length) * 100) : 0}% WhatsApp coverage
                </div>
              </div>

              <div className="card-3d acrylic-rose p-3.5 sm:p-4 rounded-2xl border border-[#D47A88]/30 shadow-md">
                <div className="text-[10px] font-cinzel font-bold text-[#9B1C2E] uppercase tracking-wider">Attending Headcount</div>
                <div className="text-lg sm:text-2xl font-black text-[#9B1C2E] mt-0.5">{totalAttendingHeadcount}</div>
                <div className="text-[10px] text-[#9B1C2E] font-medium mt-0.5">{attendingCount} VIP Passes</div>
              </div>

              <div className="card-3d acrylic-azure p-3.5 sm:p-4 rounded-2xl border border-[#6B9AC4]/30 shadow-md">
                <div className="text-[10px] font-cinzel font-bold text-[#1E3F66] uppercase tracking-wider">DJ Song Requests</div>
                <div className="text-lg sm:text-2xl font-black text-[#1E3F66] mt-0.5">{djPlaylist.length}</div>
                <div className="text-[10px] text-[#1E3F66] font-medium mt-0.5">Ready for Sangeet PDF</div>
              </div>
            </div>

            {/* Quick Action Hub */}
            <div className="acrylic-glass card-3d p-4 rounded-2xl border border-[#E8DFC8] shadow-md space-y-3">
              <h3 className="font-cinzel text-xs font-bold uppercase text-[#7D5F04] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#AA820A]" /> Quick Wedding Concierge Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <button
                  onClick={handleImportPhoneContacts}
                  className="p-3.5 rounded-xl bg-white/70 hover:bg-white border border-[#E8DFC8] hover:border-[#AA820A] text-left transition-all duration-200 flex flex-col justify-between cursor-pointer card-3d shadow-xs hover:shadow-md"
                >
                  <Phone className="w-4 h-4 text-[#AA820A] mb-1" />
                  <span className="font-bold text-[#2C2218]">Import Contacts</span>
                  <span className="text-[10px] text-[#544230]">From Mobile Phone</span>
                </button>

                <button
                  onClick={handleExportDjPdf}
                  className="p-3.5 rounded-xl bg-white/70 hover:bg-white border border-[#E8DFC8] hover:border-[#739B83] text-left transition-all duration-200 flex flex-col justify-between cursor-pointer card-3d shadow-xs hover:shadow-md"
                >
                  <Download className="w-4 h-4 text-[#2D4A36] mb-1" />
                  <span className="font-bold text-[#2C2218]">Export DJ PDF</span>
                  <span className="text-[10px] text-[#544230]">1-Click Printable PDF</span>
                </button>

                <button
                  onClick={() => setActiveTab('content')}
                  className="p-3.5 rounded-xl bg-white/70 hover:bg-white border border-[#E8DFC8] hover:border-[#D47A88] text-left transition-all duration-200 flex flex-col justify-between cursor-pointer card-3d shadow-xs hover:shadow-md"
                >
                  <Edit2 className="w-4 h-4 text-[#9B1C2E] mb-1" />
                  <span className="font-bold text-[#2C2218]">Edit Schedule</span>
                  <span className="text-[10px] text-[#544230]">Haldi, Sangeet & Menu</span>
                </button>

                <button
                  onClick={() => setActiveTab('suites')}
                  className="p-3.5 rounded-xl bg-white/70 hover:bg-white border border-[#E8DFC8] hover:border-[#6B9AC4] text-left transition-all duration-200 flex flex-col justify-between cursor-pointer card-3d shadow-xs hover:shadow-md"
                >
                  <Palette className="w-4 h-4 text-[#1E3F66] mb-1" />
                  <span className="font-bold text-[#2C2218]">Switch Suite</span>
                  <span className="text-[10px] text-[#544230]">13 Luxury Templates</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GUEST & INVITATION HUB */}
        {activeTab === 'guests' && (
          <div className="space-y-3">
            {/* Top Colorful Telemetry Card (Rose Theme) */}
            <div className="acrylic-rose card-3d-elevated p-3.5 sm:p-4 rounded-2xl border border-[#D47A88]/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/80 border border-[#D47A88]/30 flex items-center justify-center text-[#9B1C2E] shadow-2xs shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-cinzel text-xs font-bold uppercase text-[#9B1C2E]">
                    Guest Dispatch & Live RSVP Telemetry
                  </h3>
                  <p className="text-[11px] text-[#544230]">
                    1-Click WhatsApp invites via wa.me, mobile contacts import, and real-time attendance
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-xs font-bold bg-white/90 text-[#9B1C2E] px-3 py-1 rounded-xl border border-rose-200 shadow-2xs">
                  {dispatchedCount}/{guests.length} Dispatched
                </span>
                <span className="font-mono text-xs font-bold bg-white/90 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200 shadow-2xs">
                  {attendingCount} Attending
                </span>
              </div>
            </div>

            {/* Top Toolbar */}
            <div className="acrylic-glass card-3d p-3 sm:p-4 rounded-2xl border border-[#E8DFC8] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleImportPhoneContacts}
                  className="px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-[#7D5F04] border border-[#AA820A]/40 text-xs font-cinzel font-bold flex items-center gap-1.5 cursor-pointer card-3d shadow-2xs hover:shadow-sm transition-all"
                  title="Import from Mobile Device Contacts via Web Contact Picker API"
                >
                  <Phone className="w-3.5 h-3.5 text-[#AA820A]" />
                  <span>Import Phone Contacts</span>
                </button>

                <button
                  onClick={() => setShowAddGuestModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#2C2218] text-xs font-cinzel font-bold flex items-center gap-1.5 cursor-pointer shadow-md hover:brightness-105 active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ Manual Guest</span>
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#7D5F04] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  placeholder="Search guests by name or phone..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#E8DFC8] bg-white/80 focus:bg-white focus:outline-none focus:border-[#AA820A] transition-colors shadow-2xs"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {[
                { id: 'all', label: `All Guests (${guests.length})` },
                { id: 'sent', label: `WhatsApp Dispatched (${dispatchedCount})` },
                { id: 'pending', label: `Pending Dispatch (${guests.length - dispatchedCount})` },
                { id: 'attending', label: `Attending (${attendingCount})` },
                { id: 'declined', label: 'Declined' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setGuestFilter(pill.id as typeof guestFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-cinzel font-bold transition whitespace-nowrap cursor-pointer ${
                    guestFilter === pill.id
                      ? 'bg-[#2C2218] text-[#FAF8F5] shadow-sm'
                      : 'bg-white/80 text-[#7D5F04] hover:bg-white border border-[#E8DFC8] shadow-2xs'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Guests Table */}
            <div className="acrylic-glass card-3d rounded-2xl border border-[#E8DFC8] shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF4E3]/70 text-[10px] uppercase font-cinzel font-bold text-[#7D5F04] border-b border-[#E8DFC8]">
                    <tr>
                      <th className="py-3 px-3.5">Guest Name</th>
                      <th className="py-3 px-3.5">Phone Number</th>
                      <th className="py-3 px-3.5">WhatsApp Status</th>
                      <th className="py-3 px-3.5">RSVP Status</th>
                      <th className="py-3 px-3.5">Dietary / Notes</th>
                      <th className="py-3 px-3.5 text-right">1-Click Dispatch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFC8]/60">
                    {filteredGuests.map((guest) => {
                      return (
                        <tr key={guest.id} className="hover:bg-white/60 transition-colors">
                          <td className="py-3.5 px-3.5 font-semibold text-[#2C2218]">{guest.name}</td>
                          <td className="py-3.5 px-3.5 font-mono text-[11px] text-[#544230]">{guest.phone}</td>
                          <td className="py-3.5 px-3.5">
                            {guest.sentWhatsApp ? (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Dispatched
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                                <Clock className="w-3 h-3 text-amber-600" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-3.5">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                                guest.rsvpStatus === 'attending'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : guest.rsvpStatus === 'declined'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-neutral-100 text-neutral-700 border border-neutral-300'
                              }`}
                            >
                              {guest.rsvpStatus?.toUpperCase() || 'AWAITING'}
                              {guest.attendingCount ? ` (${guest.attendingCount})` : ''}
                            </span>
                          </td>
                          <td className="py-3.5 px-3.5 text-[11px] text-[#544230]">
                            {guest.dietaryChoice || 'Standard Royal Feast'}
                          </td>
                          <td className="py-3.5 px-3.5 text-right">
                            <button
                              onClick={() => handleDispatchWhatsApp(guest)}
                              className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-cinzel font-bold text-xs inline-flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                              title="Open pre-filled wa.me invite with personalized link"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>1-Click wa.me</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DJ PLAYLIST MANAGER */}
        {activeTab === 'dj' && (
          <div className="space-y-3">
            <div className="acrylic-sage card-3d-elevated p-3.5 sm:p-4 rounded-2xl border border-[#739B83]/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/80 border border-[#739B83]/30 flex items-center justify-center text-[#2D4A36] shadow-2xs shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-cinzel text-xs font-bold uppercase text-[#2D4A36]">
                    Official Sangeet DJ Playlist Ledger
                  </h3>
                  <p className="text-[11px] text-[#544230]">
                    Guest-submitted dance anthems mapped with phone numbers & dedication notes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-xs font-bold bg-white/90 text-[#2D4A36] px-3 py-1 rounded-xl border border-[#739B83]/30 shadow-2xs">
                  {djPlaylist.length} Songs Queued
                </span>
                <button
                  onClick={handleExportDjPdf}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#2C2218] text-xs font-cinzel font-bold flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Export DJ PDF</span>
                </button>
              </div>
            </div>

            <div className="acrylic-glass card-3d rounded-2xl border border-[#E8DFC8] shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF4E3]/70 text-[10px] uppercase font-cinzel font-bold text-[#7D5F04] border-b border-[#E8DFC8]">
                    <tr>
                      <th className="py-3 px-3.5">#</th>
                      <th className="py-3 px-3.5">Song Title & Artist</th>
                      <th className="py-3 px-3.5">Requested By Guest</th>
                      <th className="py-3 px-3.5">Guest WhatsApp Phone</th>
                      <th className="py-3 px-3.5">Timing / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFC8]/60">
                    {djPlaylist.map((song, idx) => (
                      <tr key={song.id} className="hover:bg-white/60 transition-colors">
                        <td className="py-3.5 px-3.5 font-mono font-bold text-[#AA820A]">{idx + 1}</td>
                        <td className="py-3.5 px-3.5">
                          <div className="font-serif font-bold text-sm text-[#2C2218]">{song.songTitle}</div>
                          <div className="text-[11px] text-[#7D5F04] italic">{song.artist || 'Bollywood Sangeet'}</div>
                        </td>
                        <td className="py-3.5 px-3.5 font-semibold text-[#2C2218]">{song.requestedByGuest}</td>
                        <td className="py-3.5 px-3.5 font-mono text-[11px] text-[#544230]">{song.guestPhone}</td>
                        <td className="py-3.5 px-3.5 text-xs text-[#544230] italic">
                          "{song.notes || 'Play during peak dance floor face-off!'}"
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BLESSINGS HUB */}
        {activeTab === 'blessings' && (
          <div className="space-y-3">
            <div className="acrylic-lilac card-3d-elevated p-3.5 sm:p-4 rounded-2xl border border-[#A888B5]/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/80 border border-[#A888B5]/30 flex items-center justify-center text-[#6B3B82] shadow-2xs shrink-0">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-cinzel text-xs font-bold uppercase text-[#6B3B82]">
                    Audio Wishing Well & Spoken Voice Notes
                  </h3>
                  <p className="text-[11px] text-[#544230]">
                    Personal microphone voice recordings left by family and cherished friends
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold bg-white/90 text-[#6B3B82] px-3 py-1 rounded-xl border border-[#A888B5]/30 shadow-2xs shrink-0">
                {blessings.length} Voice Recordings
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {blessings.map((b) => {
                const isPlaying = playingBlessingId === b.id;
                return (
                  <div
                    key={b.id}
                    className="acrylic-lilac card-3d p-4 rounded-2xl border border-[#A888B5]/30 shadow-md space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/80 border border-[#A888B5]/40 flex items-center justify-center text-[#6B3B82] shadow-2xs">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-serif font-bold text-sm text-[#2C2218]">{b.guestName}</div>
                          <div className="text-[10px] text-[#6B3B82]/70 font-mono">{b.timestamp}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#6B3B82] font-bold">
                        {b.durationSec}s audio
                      </span>
                    </div>

                    {/* Simulated Waveform & Play button */}
                    <div className="p-2.5 rounded-xl bg-white/70 border border-[#A888B5]/30 flex items-center gap-3">
                      <button
                        onClick={() => setPlayingBlessingId(isPlaying ? null : b.id)}
                        className="w-8 h-8 rounded-full bg-[#2C2218] text-[#FAF8F5] flex items-center justify-center hover:scale-105 transition shadow-xs cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div className="flex-1 flex items-center gap-0.5 h-6">
                        {[40, 70, 30, 90, 60, 80, 50, 95, 45, 65, 85, 35, 75, 55, 90, 40].map((h, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all ${
                              isPlaying ? 'bg-[#6B3B82] animate-pulse' : 'bg-[#E8DFC8]'
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: CONTENT EDITOR */}
        {activeTab === 'content' && (
          <div className="space-y-3">
            <div className="acrylic-glass card-3d p-4 sm:p-6 rounded-2xl border border-[#E8DFC8] shadow-md space-y-4">
              <h3 className="font-cinzel text-xs font-bold uppercase text-[#7D5F04] flex items-center gap-1.5">
                <Edit2 className="w-4 h-4 text-[#AA820A]" /> Wedding Details & Schedule Editor
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-cinzel uppercase font-bold text-[#7D5F04] mb-1">
                    Partner 1
                  </label>
                  <input
                    type="text"
                    value={project.partner1}
                    onChange={(e) => setProject({ ...project, partner1: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-white/80 focus:bg-white focus:outline-none focus:border-[#AA820A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-cinzel uppercase font-bold text-[#7D5F04] mb-1">
                    Partner 2
                  </label>
                  <input
                    type="text"
                    value={project.partner2}
                    onChange={(e) => setProject({ ...project, partner2: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-white/80 focus:bg-white focus:outline-none focus:border-[#AA820A] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-[#7D5F04] mb-1">
                  Destination Venue & City
                </label>
                <input
                  type="text"
                  value={project.venue.name + ', ' + project.venue.city}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      venue: { ...project.venue, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-white/80 focus:bg-white focus:outline-none focus:border-[#AA820A] transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={async () => {
                    await saveWeddingProject(project);
                    showToast('Celebration changes saved successfully!');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#2C2218] font-cinzel font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                >
                  Save Celebration Content
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SUITES SWITCHER */}
        {activeTab === 'suites' && (
          <div className="space-y-3">
            <div className="acrylic-azure card-3d-elevated p-3.5 sm:p-4 rounded-2xl border border-[#6B9AC4]/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/80 border border-[#6B9AC4]/30 flex items-center justify-center text-[#1E3F66] shadow-2xs shrink-0">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-cinzel text-xs font-bold uppercase text-[#1E3F66]">
                    Choose Your Active Invitation Suite
                  </h3>
                  <p className="text-[11px] text-[#544230]">
                    Switch instantly between all {TEMPLATE_LIST.length} luxury design suites without losing any guest RSVPs or DJ requests
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold bg-white/90 text-[#1E3F66] px-3 py-1 rounded-xl border border-[#6B9AC4]/30 shadow-2xs shrink-0">
                {TEMPLATE_LIST.length} Couture Suites
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TEMPLATE_LIST.map((suite) => {
                const isActive = (project.suite || project.template)
                  ? (project.suite === suite.id || project.template === suite.id)
                  : project.slug === suite.slug;
                return (
                  <div
                    key={suite.id}
                    className={`acrylic-glass card-3d rounded-2xl border p-4 space-y-2 flex flex-col justify-between transition-all duration-200 hover:shadow-lg ${
                      isActive ? 'border-[#AA820A] ring-2 ring-[#AA820A]/40 shadow-md' : 'border-[#E8DFC8]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-cinzel uppercase font-bold text-[#AA820A] bg-white/80 border border-[#AA820A]/30 px-2 py-0.5 rounded-md shadow-2xs">
                          {suite.badge}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#2C2218] mt-2">{suite.name}</h4>
                      <p className="text-xs text-[#544230] leading-snug">{suite.tagline}</p>
                    </div>

                    <div className="pt-3 border-t border-[#E8DFC8]/60 flex items-center justify-between">
                      <Link
                        href={`/${project.slug}?template=${suite.id}`}
                        target="_blank"
                        className="text-xs text-[#AA820A] hover:underline font-bold font-cinzel"
                      >
                        Preview Live
                      </Link>
                      <button
                        onClick={() => handleSwitchSuite(suite.id)}
                        disabled={isActive}
                        className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition-all ${
                          isActive
                            ? 'bg-neutral-200/80 text-neutral-500 cursor-default'
                            : 'bg-[#2C2218] hover:bg-[#4A3B2C] text-white shadow-xs hover:shadow-md active:scale-95 cursor-pointer'
                        }`}
                      >
                        {isActive ? 'Current Suite' : 'Activate Suite'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ULTRA-SLIM BOTTOM FLOATING ICON NAVIGATION BAR (Soft Acrylic Luxury Glass) */}
      <nav className="fixed bottom-3 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md z-40 bg-white/90 backdrop-blur-xl border border-[#AA820A]/40 rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(170,130,10,0.14)] flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={`p-2 rounded-xl transition duration-200 flex items-center justify-center shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#2C2218] shadow-md scale-105 font-bold'
                  : 'text-[#7D5F04] hover:text-[#2C2218] hover:bg-[#FAF4E3]'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </nav>

      {/* MODAL: ADD GUEST MANUALLY */}
      {showAddGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-[#E8DFC8] animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-[#FAF4E3] to-[#F3E5AB] text-[#2C2218] p-3.5 flex items-center justify-between border-b border-[#AA820A]/30">
              <h3 className="font-cinzel font-black text-xs uppercase tracking-wider text-[#2C2218]">
                Add Wedding Guest
              </h3>
              <button
                onClick={() => setShowAddGuestModal(false)}
                className="p-1 rounded-full hover:bg-white/80 text-[#7D5F04] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddGuestSubmit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-[#7D5F04] mb-1">
                  Guest Name & Salutation
                </label>
                <input
                  type="text"
                  required
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="e.g. Vikramaditya & Priya Singhania"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] focus:outline-none focus:border-[#AA820A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-[#7D5F04] mb-1">
                  WhatsApp Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  placeholder="+919820012345"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] font-mono text-xs focus:outline-none focus:border-[#AA820A]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#2C2218] font-cinzel font-black uppercase text-xs shadow-md hover:brightness-110 active:scale-95 transition cursor-pointer"
                >
                  Save & Enable 1-Click WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] text-[#7D5F04] flex items-center justify-center font-cinzel text-sm">
          <Sparkles className="w-5 h-5 animate-spin mr-2 text-[#D4AF37]" />
          Opening Royal Client Studio...
        </div>
      }
    >
      <ClientPortalContent />
    </Suspense>
  );
}
