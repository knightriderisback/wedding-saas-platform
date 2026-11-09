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
} from '@/lib/firebase';
import { exportDjPlaylistPdf } from '@/lib/djPdfGenerator';
import { defaultWeddingProject } from '@/lib/mockData';
import { TEMPLATE_LIST } from '@/lib/pressedLoveTemplates';
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
  const clientId = (params?.clientId as string) || 'client-rohit-priya';

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
    setProject(data || defaultWeddingProject);
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
  const handleSwitchSuite = async (suiteSlug: string) => {
    if (!project) return;
    const updated = { ...project, slug: suiteSlug };
    await saveWeddingProject(updated);
    setProject(updated);
    showToast(`Activated ${suiteSlug} as your primary wedding suite!`);
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

  // Tab Config mapping
  const tabConfig = {
    overview: {
      title: 'Celebration Dashboard & Live Telemetry',
      shortTitle: 'Overview',
      icon: Crown,
      subtitle: `${project?.partner1 || 'Couple'} & ${project?.partner2 || ''} Wedding Portal`,
      badge: `${attendingCount} Attending`,
      bgGradient: 'from-[#2C2218] via-[#4A3B2C] to-[#2C2218]',
      border: 'border-[#AA820A]/60',
      shadowGlow: 'shadow-[0_10px_30px_rgba(170,130,10,0.18)]',
      iconBg: 'bg-[#FAF4E3]',
      iconColor: 'text-[#AA820A]',
      breadcrumbColor: 'text-[#D4AF37]',
      badgeBg: 'bg-[#FAF4E3]',
      badgeText: 'text-[#7D5F04]',
      badgeBorder: 'border-[#AA820A]/40',
      subtitleColor: 'text-[#FAF8F5]/90',
      pillBg: 'bg-black/40',
      pillBorder: 'border-[#AA820A]/40',
      pillText: 'text-[#FAF8F5]',
      highlightText: 'text-[#D4AF37]',
    },
    guests: {
      title: 'Guest & Invitation Hub (Phone Import & 1-Click WhatsApp)',
      shortTitle: 'Guest Hub',
      icon: Users,
      subtitle: 'Import phone contacts, dispatch wa.me invites, and monitor live RSVPs',
      badge: `${dispatchedCount}/${guests.length} Sent`,
      bgGradient: 'from-[#3A281A] via-[#543C28] to-[#3A281A]',
      border: 'border-[#D4AF37]/50',
      shadowGlow: 'shadow-[0_10px_30px_rgba(212,175,55,0.15)]',
      iconBg: 'bg-[#FDFBF7]',
      iconColor: 'text-[#9B1C2E]',
      breadcrumbColor: 'text-[#F3E5AB]',
      badgeBg: 'bg-[#FDF2F4]',
      badgeText: 'text-[#9B1C2E]',
      badgeBorder: 'border-[#B8283D]/40',
      subtitleColor: 'text-[#FAF8F5]/90',
      pillBg: 'bg-black/40',
      pillBorder: 'border-[#D4AF37]/40',
      pillText: 'text-[#FAF8F5]',
      highlightText: 'text-[#F3E5AB]',
    },
    dj: {
      title: 'Sangeet DJ Playlist Manager & 1-Click PDF Export',
      shortTitle: 'DJ Playlist',
      icon: Music,
      subtitle: 'Guest-submitted dance anthems with dedication notes and phone verification',
      badge: `${djPlaylist.length} Songs Queued`,
      bgGradient: 'from-[#243328] via-[#354B3B] to-[#243328]',
      border: 'border-[#849E7C]/60',
      shadowGlow: 'shadow-[0_10px_30px_rgba(85,122,101,0.2)]',
      iconBg: 'bg-[#F1F6F3]',
      iconColor: 'text-[#2D4A36]',
      breadcrumbColor: 'text-[#A3C4B0]',
      badgeBg: 'bg-[#E3EDE7]',
      badgeText: 'text-[#2D4A36]',
      badgeBorder: 'border-[#849E7C]/50',
      subtitleColor: 'text-[#FAF8F5]/90',
      pillBg: 'bg-black/40',
      pillBorder: 'border-[#849E7C]/50',
      pillText: 'text-[#FAF8F5]',
      highlightText: 'text-[#A3C4B0]',
    },
    blessings: {
      title: 'Voice Notes Audio Player & Blessings Hub',
      shortTitle: 'Voice Blessings',
      icon: Mic,
      subtitle: 'Personal microphone voice recordings left by family and cherished friends',
      badge: `${blessings.length} Recorded`,
      bgGradient: 'from-[#422228] via-[#5B3038] to-[#422228]',
      border: 'border-[#D4AF37]/50',
      shadowGlow: 'shadow-[0_10px_30px_rgba(155,28,46,0.2)]',
      iconBg: 'bg-[#FAF4E3]',
      iconColor: 'text-[#AA820A]',
      breadcrumbColor: 'text-[#F3E5AB]',
      badgeBg: 'bg-[#FAF4E3]',
      badgeText: 'text-[#7D5F04]',
      badgeBorder: 'border-[#AA820A]/40',
      subtitleColor: 'text-[#FAF8F5]/90',
      pillBg: 'bg-black/40',
      pillBorder: 'border-[#AA820A]/40',
      pillText: 'text-[#FAF8F5]',
      highlightText: 'text-[#F3E5AB]',
    },
    content: {
      title: 'Event Schedule, Royal Menu & Story Editor',
      shortTitle: 'Content Editor',
      icon: Edit2,
      subtitle: 'Customise your couple names, wedding date, dress codes, and food dishes',
      badge: 'Live Editor',
      bgGradient: 'from-[#332A15] via-[#4A3D1F] to-[#332A15]',
      border: 'border-[#D4AF37]/60',
      shadowGlow: 'shadow-[0_10px_30px_rgba(212,175,55,0.2)]',
      iconBg: 'bg-[#FAF4E3]',
      iconColor: 'text-[#AA820A]',
      breadcrumbColor: 'text-[#F3E5AB]',
      badgeBg: 'bg-[#FAF4E3]',
      badgeText: 'text-[#7D5F04]',
      badgeBorder: 'border-[#AA820A]/40',
      subtitleColor: 'text-[#FAF8F5]/90',
      pillBg: 'bg-black/40',
      pillBorder: 'border-[#AA820A]/40',
      pillText: 'text-[#FAF8F5]',
      highlightText: 'text-[#D4AF37]',
    },
    media: {
      title: 'Media Uploader & Cover Gallery',
      shortTitle: 'Media Studio',
      icon: Camera,
      subtitle: 'Upload couple portraits, background audio, and cover visuals to storage',
      badge: 'Cloud Storage',
      bgGradient: 'from-[#242A36] via-[#353D4E] to-[#242A36]',
      border: 'border-[#7D8FA9]/60',
      shadowGlow: 'shadow-[0_10px_30px_rgba(70,85,115,0.2)]',
      iconBg: 'bg-[#F2F5F8]',
      iconColor: 'text-[#242A36]',
      breadcrumbColor: 'text-[#B5C4D8]',
      badgeBg: 'bg-[#E5ECF4]',
      badgeText: 'text-[#242A36]',
      badgeBorder: 'border-[#7D8FA9]/40',
      subtitleColor: 'text-[#FAF8F5]/90',
      pillBg: 'bg-black/40',
      pillBorder: 'border-[#7D8FA9]/40',
      pillText: 'text-[#FAF8F5]',
      highlightText: 'text-[#B5C4D8]',
    },
    suites: {
      title: '13 Luxury Design Suites Switcher',
      shortTitle: 'Design Suites',
      icon: Palette,
      subtitle: 'Select any PressedLove or Royal Palace template for your wedding microsite',
      badge: '13 Suites',
      bgGradient: 'from-[#2C2218] via-[#4A3B2C] to-[#2C2218]',
      border: 'border-[#AA820A]/60',
      shadowGlow: 'shadow-[0_10px_30px_rgba(170,130,10,0.18)]',
      iconBg: 'bg-[#FAF4E3]',
      iconColor: 'text-[#AA820A]',
      breadcrumbColor: 'text-[#D4AF37]',
      badgeBg: 'bg-[#FAF4E3]',
      badgeText: 'text-[#7D5F04]',
      badgeBorder: 'border-[#AA820A]/40',
      subtitleColor: 'text-[#FAF8F5]/90',
      pillBg: 'bg-black/40',
      pillBorder: 'border-[#AA820A]/40',
      pillText: 'text-[#FAF8F5]',
      highlightText: 'text-[#D4AF37]',
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
    <div className="min-h-screen bg-[#FAF8F5] pb-24 text-[#2C2218] selection:bg-[#D4AF37]/30 selection:text-[#2C2218]">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-3 right-3 z-50 bg-[#2C2218] text-[#FAF8F5] px-4 py-2 rounded-xl border border-[#AA820A] shadow-xl text-xs font-cinzel flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ULTRA-SLIM STICKY CLIENT HEADER (Rajhara Express Pattern in Luxury Gold/Ivory) */}
      <header className="bg-[#2C2218] text-white sticky top-0 z-30 border-b border-[#AA820A]/40 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          {/* Left: Store Link & Title */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin"
              className="p-1.5 rounded-lg bg-[#3E3022] hover:bg-[#523F2D] text-[#D4AF37] transition"
              title="Return to Master Admin"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#AA820A] via-[#D4AF37] to-[#FAF4E3] flex items-center justify-center text-black font-cinzel font-bold text-xs shadow-xs">
              {project.partner1[0]}&{project.partner2[0]}
            </div>
            <div className="leading-tight">
              <span className="font-cinzel font-black text-xs sm:text-sm tracking-tight text-[#FAF8F5]">
                {project.partner1.split(' ')[0]} & {project.partner2.split(' ')[0]} Wedding Studio
              </span>
              <span className="text-[10px] text-[#D4AF37] font-serif ml-1.5 hidden sm:inline">
                • {project.venue.city}
              </span>
            </div>
          </div>

          {/* Right: Preview Live Microsite, + Add Guest & Shadow Status */}
          <div className="flex items-center gap-1.5">
            <Link
              href={`/${project.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#3E3022] hover:bg-[#523F2D] text-[#FAF4E3] text-xs font-cinzel font-bold transition shadow-xs border border-[#AA820A]/40"
              title="Preview Live Wedding Microsite"
            >
              <Eye className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
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
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-[#D4AF37] text-xs font-mono font-bold flex items-center gap-1 border border-amber-500/40">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline text-[10px]">Shadow Mode (Super Admin)</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-4 py-3 space-y-3">
        {/* Dynamic Section Heading Banner */}
        <div
          className={`bg-gradient-to-r ${currentTab.bgGradient} text-white rounded-2xl p-3 sm:p-4 shadow-md ${currentTab.shadowGlow} border ${currentTab.border} flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${currentTab.iconBg} ${currentTab.iconColor} flex items-center justify-center shrink-0 shadow-md font-black`}
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
                  className={`text-[9px] ${currentTab.badgeBg} ${currentTab.badgeText} border ${currentTab.badgeBorder} px-2 py-0.5 rounded-full font-bold font-mono`}
                >
                  {currentTab.badge}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-cinzel font-black text-white tracking-tight leading-tight mt-0.5 truncate">
                {currentTab.title}
              </h1>
              <p className={`text-[10px] sm:text-[11px] ${currentTab.subtitleColor} mt-0.5 leading-snug font-sans`}>
                {currentTab.subtitle}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 self-start sm:self-auto shrink-0 ${currentTab.pillBg} px-3 py-1.5 rounded-xl border ${currentTab.pillBorder} text-[10px] ${currentTab.pillText}`}
          >
            <span>Active Option:</span>
            <span className={`font-black ${currentTab.highlightText} bg-black/40 px-2 py-0.5 rounded-md`}>
              {currentTab.shortTitle}
            </span>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E8DFC8] shadow-2xs">
                <div className="text-[10px] font-cinzel font-bold text-[#7D5F04] uppercase">Total Guests</div>
                <div className="text-base sm:text-xl font-black text-[#2C2218]">{guests.length}</div>
                <div className="text-[9px] text-[#7D5F04] font-medium mt-0.5">Invited in Registry</div>
              </div>

              <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E8DFC8] shadow-2xs">
                <div className="text-[10px] font-cinzel font-bold text-[#7D5F04] uppercase">Invites Sent</div>
                <div className="text-base sm:text-xl font-black text-[#AA820A]">{dispatchedCount}</div>
                <div className="text-[9px] text-emerald-700 font-medium mt-0.5">
                  {guests.length > 0 ? Math.round((dispatchedCount / guests.length) * 100) : 0}% WhatsApp coverage
                </div>
              </div>

              <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E8DFC8] shadow-2xs">
                <div className="text-[10px] font-cinzel font-bold text-[#7D5F04] uppercase">Attending Headcount</div>
                <div className="text-base sm:text-xl font-black text-[#9B1C2E]">{totalAttendingHeadcount}</div>
                <div className="text-[9px] text-[#9B1C2E] font-medium mt-0.5">{attendingCount} VIP RSVP Passes</div>
              </div>

              <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E8DFC8] shadow-2xs">
                <div className="text-[10px] font-cinzel font-bold text-[#7D5F04] uppercase">DJ Song Requests</div>
                <div className="text-base sm:text-xl font-black text-[#557A65]">{djPlaylist.length}</div>
                <div className="text-[9px] text-neutral-500 font-medium mt-0.5">Ready for Sangeet PDF</div>
              </div>
            </div>

            {/* Quick Action Hub */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-3">
              <h3 className="font-cinzel text-xs font-bold uppercase text-[#7D5F04] tracking-wider">
                Quick Wedding Concierge Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={handleImportPhoneContacts}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] hover:border-[#AA820A] text-left transition flex flex-col justify-between cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#AA820A] mb-1" />
                  <span className="font-bold text-[#2C2218]">Import Contacts</span>
                  <span className="text-[10px] text-neutral-500">From Mobile Phone</span>
                </button>

                <button
                  onClick={handleExportDjPdf}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] hover:border-[#AA820A] text-left transition flex flex-col justify-between cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#557A65] mb-1" />
                  <span className="font-bold text-[#2C2218]">Export DJ PDF</span>
                  <span className="text-[10px] text-neutral-500">1-Click Printable PDF</span>
                </button>

                <button
                  onClick={() => setActiveTab('content')}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] hover:border-[#AA820A] text-left transition flex flex-col justify-between cursor-pointer"
                >
                  <Edit2 className="w-4 h-4 text-[#9B1C2E] mb-1" />
                  <span className="font-bold text-[#2C2218]">Edit Schedule</span>
                  <span className="text-[10px] text-neutral-500">Haldi, Sangeet & Menu</span>
                </button>

                <button
                  onClick={() => setActiveTab('suites')}
                  className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] hover:border-[#AA820A] text-left transition flex flex-col justify-between cursor-pointer"
                >
                  <Palette className="w-4 h-4 text-[#7D5F04] mb-1" />
                  <span className="font-bold text-[#2C2218]">Switch Suite</span>
                  <span className="text-[10px] text-neutral-500">13 Luxury Templates</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GUEST & INVITATION HUB */}
        {activeTab === 'guests' && (
          <div className="space-y-3">
            {/* Top Toolbar */}
            <div className="bg-white p-3 rounded-2xl border border-[#E8DFC8] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleImportPhoneContacts}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF4E3] hover:bg-[#F3E5AB] text-[#7D5F04] border border-[#AA820A]/40 text-xs font-cinzel font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Import from Mobile Device Contacts via Web Contact Picker API"
                >
                  <Phone className="w-3.5 h-3.5 text-[#AA820A]" />
                  <span>Import Phone Contacts</span>
                </button>

                <button
                  onClick={() => setShowAddGuestModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#2C2218] text-xs font-cinzel font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
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
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] focus:outline-none focus:border-[#AA820A]"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-cinzel font-bold transition whitespace-nowrap cursor-pointer ${
                    guestFilter === pill.id
                      ? 'bg-[#2C2218] text-[#FAF8F5] shadow-xs'
                      : 'bg-white text-[#7D5F04] hover:bg-[#FAF4E3] border border-[#E8DFC8]'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Guests Table */}
            <div className="bg-white rounded-2xl border border-[#E8DFC8] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[10px] uppercase font-cinzel font-bold text-[#7D5F04] border-b border-[#E8DFC8]">
                    <tr>
                      <th className="py-2.5 px-3">Guest Name</th>
                      <th className="py-2.5 px-3">Phone Number</th>
                      <th className="py-2.5 px-3">WhatsApp Status</th>
                      <th className="py-2.5 px-3">RSVP Status</th>
                      <th className="py-2.5 px-3">Dietary / Notes</th>
                      <th className="py-2.5 px-3 text-right">1-Click Dispatch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFC8]/60">
                    {filteredGuests.map((guest) => {
                      return (
                        <tr key={guest.id} className="hover:bg-[#FDFBF7]">
                          <td className="py-3 px-3 font-semibold text-[#2C2218]">{guest.name}</td>
                          <td className="py-3 px-3 font-mono text-[11px] text-[#544230]">{guest.phone}</td>
                          <td className="py-3 px-3">
                            {guest.sentWhatsApp ? (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Dispatched
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                                <Clock className="w-3 h-3 text-amber-600" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                                guest.rsvpStatus === 'attending'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : guest.rsvpStatus === 'declined'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-neutral-100 text-neutral-700'
                              }`}
                            >
                              {guest.rsvpStatus?.toUpperCase() || 'AWAITING'}
                              {guest.attendingCount ? ` (${guest.attendingCount})` : ''}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[11px] text-[#544230]">
                            {guest.dietaryChoice || 'Standard Royal Feast'}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDispatchWhatsApp(guest)}
                              className="px-2.5 py-1 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-cinzel font-bold text-xs inline-flex items-center gap-1 shadow-2xs cursor-pointer"
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
            <div className="bg-white p-3 rounded-2xl border border-[#E8DFC8] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h3 className="font-cinzel text-xs font-bold uppercase text-[#7D5F04]">
                  Official Sangeet DJ Playlist Ledger
                </h3>
                <p className="text-[11px] text-[#544230]">
                  Songs requested by guests via their digital invitation forms, mapped with phone numbers
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportDjPdf}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#2C2218] text-xs font-cinzel font-bold flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>1-Click Export DJ PDF</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8DFC8] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[10px] uppercase font-cinzel font-bold text-[#7D5F04] border-b border-[#E8DFC8]">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Song Title & Artist</th>
                      <th className="py-2.5 px-3">Requested By Guest</th>
                      <th className="py-2.5 px-3">Guest WhatsApp Phone</th>
                      <th className="py-2.5 px-3">Timing / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFC8]/60">
                    {djPlaylist.map((song, idx) => (
                      <tr key={song.id} className="hover:bg-[#FDFBF7]">
                        <td className="py-3 px-3 font-mono font-bold text-[#AA820A]">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="font-serif font-bold text-sm text-[#2C2218]">{song.songTitle}</div>
                          <div className="text-[11px] text-[#7D5F04] italic">{song.artist || 'Bollywood Sangeet'}</div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#2C2218]">{song.requestedByGuest}</td>
                        <td className="py-3 px-3 font-mono text-[11px] text-[#544230]">{song.guestPhone}</td>
                        <td className="py-3 px-3 text-xs text-[#544230] italic">
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
            <div className="bg-white p-3 rounded-2xl border border-[#E8DFC8] shadow-2xs">
              <h3 className="font-cinzel text-xs font-bold uppercase text-[#7D5F04]">
                Audio Wishing Well & Voice Notes Hub
              </h3>
              <p className="text-[11px] text-[#544230]">
                Spoken blessings recorded by family members directly through their digital invitation
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {blessings.map((b) => {
                const isPlaying = playingBlessingId === b.id;
                return (
                  <div
                    key={b.id}
                    className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#FAF4E3] border border-[#AA820A]/40 flex items-center justify-center text-[#AA820A]">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-serif font-bold text-sm text-[#2C2218]">{b.guestName}</div>
                          <div className="text-[10px] text-neutral-400">{b.timestamp}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#7D5F04] font-bold">
                        {b.durationSec}s audio
                      </span>
                    </div>

                    {/* Simulated Waveform & Play button */}
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] flex items-center gap-3">
                      <button
                        onClick={() => setPlayingBlessingId(isPlaying ? null : b.id)}
                        className="w-8 h-8 rounded-full bg-[#2C2218] text-[#FAF8F5] flex items-center justify-center hover:scale-105 transition"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div className="flex-1 flex items-center gap-0.5 h-6">
                        {[40, 70, 30, 90, 60, 80, 50, 95, 45, 65, 85, 35, 75, 55, 90, 40].map((h, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all ${
                              isPlaying ? 'bg-[#AA820A] animate-pulse' : 'bg-[#E8DFC8]'
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
            <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-2xs space-y-4">
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
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] focus:outline-none"
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
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] focus:outline-none"
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
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={async () => {
                    await saveWeddingProject(project);
                    showToast('Celebration changes saved successfully!');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#2C2218] font-cinzel font-bold text-xs shadow-md"
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
            <div className="bg-white p-3 rounded-2xl border border-[#E8DFC8] shadow-2xs">
              <h3 className="font-cinzel text-xs font-bold uppercase text-[#7D5F04]">
                Choose Your Active Invitation Suite
              </h3>
              <p className="text-[11px] text-[#544230]">
                Switch instantly between all 13 luxury templates without losing any guest RSVPs or DJ requests
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TEMPLATE_LIST.map((suite) => {
                const isActive = project.slug === suite.slug;
                return (
                  <div
                    key={suite.id}
                    className={`bg-white rounded-2xl border p-3.5 space-y-2 flex flex-col justify-between transition-all ${
                      isActive ? 'border-[#AA820A] ring-2 ring-[#AA820A]/40 shadow-md' : 'border-[#E8DFC8]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-cinzel uppercase font-bold text-[#AA820A] bg-[#FAF4E3] px-2 py-0.5 rounded-md">
                          {suite.badge}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#2C2218] mt-1">{suite.name}</h4>
                      <p className="text-xs text-[#544230] leading-snug">{suite.tagline}</p>
                    </div>

                    <div className="pt-2 border-t border-[#FAF4E3] flex items-center justify-between">
                      <Link
                        href={`/wedding-invitation-${suite.id}`}
                        target="_blank"
                        className="text-xs text-[#AA820A] hover:underline font-bold font-cinzel"
                      >
                        Preview Live
                      </Link>
                      <button
                        onClick={() => handleSwitchSuite(suite.slug)}
                        disabled={isActive}
                        className={`px-3 py-1 rounded-lg text-xs font-cinzel font-bold ${
                          isActive
                            ? 'bg-neutral-100 text-neutral-400 cursor-default'
                            : 'bg-[#2C2218] hover:bg-[#4A3B2C] text-white cursor-pointer'
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

      {/* ULTRA-SLIM BOTTOM FLOATING ICON NAVIGATION BAR (Rajhara Express Pattern) */}
      <nav className="fixed bottom-2 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md z-40 bg-[#2C2218]/95 backdrop-blur-md border border-[#AA820A]/50 rounded-2xl p-1.5 shadow-2xl flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
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
                  : 'text-[#FAF4E3]/80 hover:text-white hover:bg-[#3E3022]'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-[#E8DFC8] animate-in zoom-in-95">
            <div className="bg-[#2C2218] text-white p-3.5 flex items-center justify-between border-b border-[#AA820A]/40">
              <h3 className="font-cinzel font-black text-xs uppercase tracking-wider">
                Add Wedding Guest
              </h3>
              <button
                onClick={() => setShowAddGuestModal(false)}
                className="p-1 rounded-full hover:bg-[#3E3022] text-[#FAF4E3] transition"
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
