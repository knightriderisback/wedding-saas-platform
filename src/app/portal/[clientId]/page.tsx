'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
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
import { RoyalCustomizationStudio } from '@/components/portal/RoyalCustomizationStudio';
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon';
import {
  getLoggedInClient,
  logoutClient,
  getClientCredentials,
  updateClientCredentials,
} from '@/lib/auth';
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
  LogOut,
  Key,
  Save,
  Lock,
  Navigation,
} from 'lucide-react';

function ClientPortalContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isShadowAdmin = searchParams.get('shadowAdmin') === 'true';
  const clientId = (params?.clientId as string) || 'client-gourav-priya';

  const [project, setProject] = useState<WeddingProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'customization' | 'guests' | 'dj' | 'blessings' | 'content' | 'media' | 'suites'
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

  const router = useRouter();
  const [clientTokenInput, setClientTokenInput] = useState('');
  const [clientPasscodeInput, setClientPasscodeInput] = useState('');
  const [clientConfirmPasscodeInput, setClientConfirmPasscodeInput] = useState('');

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
    // Auth Guard: if not super admin shadow mode, verify client session
    if (!isShadowAdmin) {
      const activeClient = getLoggedInClient();
      if (!activeClient) {
        router.push('/portal/login');
        return;
      }
    }
    const creds = getClientCredentials(clientId);
    setClientTokenInput(creds.token);
    loadData();
  }, [clientId, isShadowAdmin, router]);

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
    { id: 'customization', icon: Sliders, label: 'Customization Studio' },
    { id: 'guests', icon: Users, label: 'Guests' },
    { id: 'dj', icon: Music, label: 'DJ Playlist' },
    { id: 'blessings', icon: Mic, label: 'Blessings' },
    { id: 'content', icon: Edit2, label: 'Editor' },
    { id: 'media', icon: Camera, label: 'Media & Upload' },
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
      acrylicClass: 'card-rajhara-elevated-3d',
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
    customization: {
      title: 'Royal Heritage Customization & Section Studio',
      shortTitle: 'Customization Studio',
      icon: Sliders,
      subtitle: 'Customize every text, font, font-size, hide/show placement, and soundtrack of your wedding microsite',
      badge: 'Bespoke 3D Studio',
      acrylicClass: 'card-rajhara-elevated-3d',
      border: 'border-[#AA820A]/40',
      shadowGlow: 'shadow-[0_12px_32px_rgba(170,130,10,0.12)]',
      iconBg: 'bg-gradient-to-br from-[#D4AF37] to-[#7D5F04] text-white shadow-xs',
      iconColor: 'text-white',
      breadcrumbColor: 'text-[#7D5F04]',
      badgeBg: 'bg-[#273822]',
      badgeText: 'text-[#FAF8F5]',
      badgeBorder: 'border-[#AA820A]/40',
      titleColor: 'text-[#1E2E1B]',
      subtitleColor: 'text-[#544230]',
      pillBg: 'bg-white/80 backdrop-blur-sm',
      pillBorder: 'border-[#AA820A]/30',
      pillText: 'text-[#544230]',
      highlightText: 'text-[#7D5F04]',
    },
    guests: {
      title: 'Guest & Invitation Hub (Phone Import & 1-Click Dispatch)',
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
    <div className="min-h-screen bg-khadi-fabric relative overflow-hidden pb-24 text-[#5C4303] font-portal selection:bg-[#D4AF37]/30 selection:text-[#5C4303]">
      {/* 3D Ambient Refractive Bubbles & Glass Orbs */}
      <AcrylicBackgroundOrbs variant="multi" />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-3 right-3 z-50 bg-[#193822] text-[#FAF8F5] px-4 py-2 rounded-xl border border-[#AA820A] shadow-xl text-xs font-portal font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ULTRA-SLIM STICKY CLIENT HEADER (Rajhara Express Pattern in Luxury Soft Gold/Alabaster) */}
      <header className="bg-white/95 backdrop-blur-md text-[#5C4303] sticky top-0 z-30 border-b border-[#E8DFC8] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          {/* Left: Store Link & Title */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin"
              className="p-1.5 rounded-lg bg-[#FAF4E3] hover:bg-[#F3E5AB] text-[#5C4303] border border-[#AA820A]/30 transition shadow-2xs"
              title="Return to Master Admin"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#AA820A] via-[#D4AF37] to-[#FAF4E3] flex items-center justify-center text-white font-cinzel font-bold text-xs shadow-xs">
              👑
            </div>
            <div className="leading-tight">
              <span className="font-cinzel font-black text-xs sm:text-sm tracking-tight text-[#5C4303]">
                {project.partner1.split(' ')[0]} & {project.partner2.split(' ')[0]} Wedding Studio
              </span>
              <span className="text-[10px] text-[#785B24] font-medium ml-1.5 hidden sm:inline">
                • {project.venue.city}
              </span>
            </div>
          </div>

          {/* Right: Preview Live Microsite, + Add Guest & Shadow Status */}
          <div className="flex items-center gap-1.5">
            <Link
              href={`/${project.slug}`}
              target="_blank"
              className="btn-slim-outline text-[11px] font-bold"
              title="Preview Live Wedding Microsite"
            >
              <Eye className="w-3.5 h-3.5 text-[#AA820A] shrink-0" />
              <span className="hidden sm:inline">Live Microsite</span>
            </Link>

            <button
              onClick={() => setShowAddGuestModal(true)}
              className="btn-slim-gold text-[11px] font-bold"
              title="Add Guest"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Add Guest</span>
            </button>

            {isShadowAdmin ? (
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-900 text-xs font-mono font-bold flex items-center gap-1 border border-amber-300 shadow-2xs">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline text-[10px]">Shadow Mode (Super Admin)</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  logoutClient();
                  router.push('/portal/login');
                }}
                className="btn-slim-outline text-[11px] font-bold text-[#6E121E] hover:bg-rose-50 flex items-center gap-1"
                title="Logout from Client Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-4 py-3 space-y-3 relative z-10">
        {/* Dynamic Section Heading Banner with soft acrylic styling (multi-line wrapped, zero overflow) */}
        <div
          className={`${currentTab.acrylicClass} rounded-2xl p-4 sm:p-5 shadow-md ${currentTab.shadowGlow} border ${currentTab.border} flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300 relative overflow-hidden`}
        >
          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1 relative z-10">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${currentTab.iconBg} ${currentTab.iconColor} flex items-center justify-center shrink-0 shadow-sm font-black mt-0.5 sm:mt-0`}
            >
              <CurrentTabIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
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
              <h1 className={`text-base sm:text-lg font-cinzel font-black ${currentTab.titleColor} tracking-tight leading-snug break-words [overflow-wrap:anywhere] whitespace-normal mt-1`}>
                {currentTab.title}
              </h1>
              <p className={`text-xs ${currentTab.subtitleColor} mt-1 leading-relaxed font-portal break-words [overflow-wrap:anywhere] whitespace-normal`}>
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
            {/* Metric Cards - 3D Royal Pop-out Cards in Multi-Colors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="card-pop3d-amber p-3.5 sm:p-4 rounded-2xl">
                <div className="text-[10px] font-portal font-bold text-[#785B24] uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#AA820A]" /> Total Guests
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#5C4303] mt-0.5">{guests.length}</div>
                <div className="text-[10px] text-[#785B24] font-medium mt-0.5 flex items-center gap-1">
                  <span>✨</span> Invited in Registry
                </div>
              </div>

              <div className="card-pop3d-emerald p-3.5 sm:p-4 rounded-2xl">
                <div className="text-[10px] font-portal font-bold text-[#193822] uppercase tracking-wider flex items-center gap-1">
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#193822]" /> Invites Sent
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#193822] mt-0.5">{dispatchedCount}</div>
                <div className="text-[10px] text-[#234E30] font-medium mt-0.5 flex items-center gap-1">
                  <WhatsAppIcon className="w-3 h-3 text-emerald-700" /> {guests.length > 0 ? Math.round((dispatchedCount / guests.length) * 100) : 0}% dispatched
                </div>
              </div>

              <div className="card-pop3d-rose p-3.5 sm:p-4 rounded-2xl">
                <div className="text-[10px] font-portal font-bold text-[#6E121E] uppercase tracking-wider flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-[#9B1C2E]" /> Attending
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#6E121E] mt-0.5">{totalAttendingHeadcount}</div>
                <div className="text-[10px] text-[#9B1C2E] font-medium mt-0.5 flex items-center gap-1">
                  <span>👑</span> {attendingCount} VIP Passes
                </div>
              </div>

              <div className="card-pop3d-azure p-3.5 sm:p-4 rounded-2xl">
                <div className="text-[10px] font-portal font-bold text-[#142F4C] uppercase tracking-wider flex items-center gap-1">
                  <Music className="w-3.5 h-3.5 text-[#1E3F66]" /> DJ Requests
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#142F4C] mt-0.5">{djPlaylist.length}</div>
                <div className="text-[10px] text-[#1E3F66] font-medium mt-0.5 flex items-center gap-1">
                  <span>🎵</span> Ready for Sangeet PDF
                </div>
              </div>
            </div>

            {/* Royal Customization Studio Feature Card */}
            <div className="card-pop3d-amethyst p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#AA820A] to-[#431E54] text-white flex items-center justify-center shadow-md shrink-0">
                  <Sliders className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-portal uppercase tracking-wider font-bold text-[#431E54]">
                      Bespoke Royal Studio
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#193822] text-[#FAF8F5] font-bold">
                      NEW 💎
                    </span>
                  </div>
                  <h3 className="font-['Rozha_One',serif] font-bold text-sm sm:text-base text-[#431E54] leading-tight">
                    Customise Every Text, Font, Size & Section Visibility
                  </h3>
                  <p className="text-xs text-[#6B3B82] mt-0.5 font-medium">
                    Tailor couple names, lineage, dates, music tracks, and toggle any of the 9 sections.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('customization')}
                className="btn-slim-gold text-xs font-bold shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Open Customization Studio</span>
                <span>✨</span>
              </button>
            </div>

            {/* Quick Action Hub */}
            <div className="card-pop3d-terracotta p-4 rounded-2xl space-y-3">
              <h3 className="font-portal text-xs font-bold uppercase text-[#612B18] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#AA820A]" /> Quick Wedding Concierge Actions 🏰
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <button
                  onClick={handleImportPhoneContacts}
                  className="card-pop3d-amber p-3 rounded-xl text-left flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Phone className="w-4 h-4 text-[#AA820A]" />
                    <span className="text-xs">📱</span>
                  </div>
                  <span className="font-bold text-[#5C4303] text-xs">Import Contacts</span>
                  <span className="text-[10px] text-[#785B24]">From Phone</span>
                </button>

                <button
                  onClick={handleExportDjPdf}
                  className="card-pop3d-emerald p-3 rounded-xl text-left flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Download className="w-4 h-4 text-[#193822]" />
                    <span className="text-xs">📄</span>
                  </div>
                  <span className="font-bold text-[#193822] text-xs">Export DJ PDF</span>
                  <span className="text-[10px] text-[#234E30]">1-Click PDF</span>
                </button>

                <button
                  onClick={() => setActiveTab('customization')}
                  className="card-pop3d-amethyst p-3 rounded-xl text-left flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Sliders className="w-4 h-4 text-[#431E54]" />
                    <span className="text-xs">🎨</span>
                  </div>
                  <span className="font-bold text-[#431E54] text-xs">Customize Design</span>
                  <span className="text-[10px] text-[#6B3B82]">Copy & Sections</span>
                </button>

                <button
                  onClick={() => setActiveTab('suites')}
                  className="card-pop3d-azure p-3 rounded-xl text-left flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Palette className="w-4 h-4 text-[#142F4C]" />
                    <span className="text-xs">👑</span>
                  </div>
                  <span className="font-bold text-[#142F4C] text-xs">Switch Suite</span>
                  <span className="text-[10px] text-[#1E3F66]">13 Luxury Themes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMIZATION STUDIO */}
        {activeTab === 'customization' && (
          <RoyalCustomizationStudio
            project={project}
            onUpdate={(updatedProject) => setProject(updatedProject)}
            showToast={showToast}
          />
        )}

        {/* TAB 2: GUEST & INVITATION HUB */}
        {activeTab === 'guests' && (
          <div className="space-y-3">
            {/* Top Colorful Telemetry Card (Rose Theme) */}
            <div className="card-pop3d-rose p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/80 border border-[#D47A88]/40 flex items-center justify-center text-[#9B1C2E] shadow-2xs shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-portal text-xs font-bold uppercase text-[#6E121E]">
                    Guest Dispatch & Live RSVP Telemetry 💌
                  </h3>
                  <p className="text-[11px] text-[#9B1C2E] font-medium flex items-center gap-1">
                    <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
                    <span>Instant mobile dispatch via wa.me, contact picker & real-time RSVP</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-xs font-bold bg-white/95 text-[#6E121E] px-3 py-1 rounded-xl border border-rose-200 shadow-2xs">
                  {dispatchedCount}/{guests.length} Dispatched 🚀
                </span>
                <span className="font-mono text-xs font-bold bg-white/95 text-[#193822] px-3 py-1 rounded-xl border border-emerald-200 shadow-2xs">
                  {attendingCount} Attending 👑
                </span>
              </div>
            </div>

            {/* Top Toolbar */}
            <div className="card-pop3d-amber p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleImportPhoneContacts}
                  className="btn-slim-outline text-xs font-bold flex items-center gap-1.5"
                  title="Import from Mobile Device Contacts via Web Contact Picker API"
                >
                  <Phone className="w-3.5 h-3.5 text-[#AA820A]" />
                  <span>Import Phone Contacts</span>
                  <span>📱</span>
                </button>

                <button
                  onClick={() => setShowAddGuestModal(true)}
                  className="btn-slim-gold text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ Manual Guest</span>
                  <span>✍️</span>
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#785B24] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  placeholder="Search guests by name or phone..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#AA820A]/30 bg-white/90 text-[#5C4303] placeholder-[#785B24]/70 focus:bg-white focus:outline-none focus:border-[#AA820A] transition-colors shadow-2xs"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {[
                { id: 'all', label: `All (${guests.length})`, icon: '👥' },
                { id: 'sent', label: `Dispatched (${dispatchedCount})`, icon: '🟢' },
                { id: 'pending', label: `Pending (${guests.length - dispatchedCount})`, icon: '⏳' },
                { id: 'attending', label: `Attending (${attendingCount})`, icon: '👑' },
                { id: 'declined', label: 'Declined', icon: '❌' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setGuestFilter(pill.id as typeof guestFilter)}
                  className={`pill-slim ${
                    guestFilter === pill.id
                      ? 'bg-[#193822] text-[#FAF8F5] border-[#193822]'
                      : 'bg-white/80 text-[#5C4303] hover:bg-white border-[#AA820A]/30'
                  }`}
                >
                  <span>{pill.icon}</span>
                  <span>{pill.label}</span>
                </button>
              ))}
            </div>

            {/* Guests Table */}
            <div className="card-pop3d-amber rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF4E3]/90 text-[10px] uppercase font-portal font-bold text-[#785B24] border-b border-[#E8DFC8]">
                    <tr>
                      <th className="py-3 px-3.5">Guest</th>
                      <th className="py-3 px-3.5">Phone</th>
                      <th className="py-3 px-3.5">
                        <span className="inline-flex items-center gap-1">
                          <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Status</span>
                        </span>
                      </th>
                      <th className="py-3 px-3.5">RSVP</th>
                      <th className="py-3 px-3.5">Dietary</th>
                      <th className="py-3 px-3.5 text-right">Dispatch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFC8]/60 bg-[#FAF7EE]/90">
                    {filteredGuests.map((guest) => {
                      return (
                        <tr key={guest.id} className="hover:bg-[#F3ECE0] transition-colors">
                          <td className="py-3.5 px-3.5 font-bold text-[#5C4303]">{guest.name}</td>
                          <td className="py-3.5 px-3.5 font-mono text-[11px] text-[#785B24]">{guest.phone}</td>
                          <td className="py-3.5 px-3.5">
                            {guest.sentWhatsApp ? (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Dispatched
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
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
                          <td className="py-3.5 px-3.5 text-[11px] text-[#5C4303]">
                            {guest.dietaryChoice || 'Standard Royal Feast'}
                          </td>
                          <td className="py-3.5 px-3.5 text-right">
                            <button
                              onClick={() => handleDispatchWhatsApp(guest)}
                              className="btn-slim-emerald text-[11px] font-bold inline-flex items-center gap-1.5 px-2.5 py-1"
                              title="Send WhatsApp invitation"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                              <span className="hidden sm:inline">Send</span>
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
            <div className="card-pop3d-emerald p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/80 border border-[#739B83]/30 flex items-center justify-center text-[#193822] shadow-2xs shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-portal text-xs font-bold uppercase text-[#193822]">
                    Official Sangeet DJ Playlist Ledger 🎶
                  </h3>
                  <p className="text-[11px] text-[#234E30]">
                    Guest-submitted dance anthems mapped with phone numbers & dedication notes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-xs font-bold bg-white/95 text-[#193822] px-3 py-1 rounded-xl border border-[#739B83]/30 shadow-2xs">
                  {djPlaylist.length} Songs Queued 💃
                </span>
                <button
                  onClick={handleExportDjPdf}
                  className="btn-slim-emerald text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Export DJ PDF</span>
                  <span>📄</span>
                </button>
              </div>
            </div>

            <div className="card-pop3d-emerald rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF4E3]/90 text-[10px] uppercase font-portal font-bold text-[#193822] border-b border-[#E8DFC8]">
                    <tr>
                      <th className="py-3 px-3.5">#</th>
                      <th className="py-3 px-3.5">Song Title & Artist</th>
                      <th className="py-3 px-3.5">Requested By Guest</th>
                      <th className="py-3 px-3.5">
                        <span className="inline-flex items-center gap-1">
                          <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Phone</span>
                        </span>
                      </th>
                      <th className="py-3 px-3.5">Timing / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFC8]/60 bg-[#FAF7EE]/90">
                    {djPlaylist.map((song, idx) => (
                      <tr key={song.id} className="hover:bg-[#F3ECE0] transition-colors">
                        <td className="py-3.5 px-3.5 font-mono font-bold text-[#AA820A]">{idx + 1}</td>
                        <td className="py-3.5 px-3.5">
                          <div className="font-bold text-sm text-[#193822]">{song.songTitle}</div>
                          <div className="text-[11px] text-[#234E30] italic font-medium">{song.artist || 'Bollywood Sangeet'}</div>
                        </td>
                        <td className="py-3.5 px-3.5 font-semibold text-[#5C4303]">{song.requestedByGuest}</td>
                        <td className="py-3.5 px-3.5 font-mono text-[11px] text-[#785B24]">{song.guestPhone}</td>
                        <td className="py-3.5 px-3.5 text-xs text-[#234E30] italic">
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
            <div className="card-pop3d-amethyst p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/80 border border-[#A888B5]/30 flex items-center justify-center text-[#431E54] shadow-2xs shrink-0">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-portal text-xs font-bold uppercase text-[#431E54]">
                    Audio Wishing Well & Spoken Voice Notes 🎙️
                  </h3>
                  <p className="text-[11px] text-[#6B3B82]">
                    Personal microphone voice recordings left by family and cherished friends
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold bg-white/95 text-[#431E54] px-3 py-1 rounded-xl border border-[#A888B5]/30 shadow-2xs shrink-0">
                {blessings.length} Recordings 💫
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {blessings.map((b) => {
                const isPlaying = playingBlessingId === b.id;
                return (
                  <div
                    key={b.id}
                    className="card-pop3d-amethyst p-4 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/90 border border-[#A888B5]/40 flex items-center justify-center text-[#431E54] shadow-2xs">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#431E54]">{b.guestName}</div>
                          <div className="text-[10px] text-[#6B3B82] font-mono">{b.timestamp}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#431E54] font-bold">
                        {b.durationSec}s audio
                      </span>
                    </div>

                    {/* Simulated Waveform & Play button */}
                    <div className="p-2.5 rounded-xl bg-white/80 border border-[#A888B5]/30 flex items-center gap-3">
                      <button
                        onClick={() => setPlayingBlessingId(isPlaying ? null : b.id)}
                        className="w-8 h-8 rounded-full bg-[#431E54] text-[#FAF8F5] flex items-center justify-center hover:scale-105 transition shadow-xs cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div className="flex-1 flex items-center gap-0.5 h-6">
                        {[40, 70, 30, 90, 60, 80, 50, 95, 45, 65, 85, 35, 75, 55, 90, 40].map((h, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all ${
                              isPlaying ? 'bg-[#431E54] animate-pulse' : 'bg-[#DFC07C]'
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
          <div className="space-y-4">
            {/* CARD 1: COUPLE IDENTITY & SCHEDULE */}
            <div className="card-pop3d-amber p-4 sm:p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-portal text-xs font-bold uppercase text-[#5C4303] flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#AA820A]" /> Couple Identity & Celebration Schedule 👑
                </h3>
                <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/80 border border-amber-300 px-2 py-0.5 rounded-full">
                  Live Microsite Sync
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-portal uppercase font-bold text-[#785B24] mb-1">
                    Partner 1 (Groom / Bride)
                  </label>
                  <input
                    type="text"
                    value={project.partner1}
                    onChange={(e) => setProject({ ...project, partner1: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#AA820A]/30 bg-white/90 text-[#5C4303] focus:bg-white focus:outline-none focus:border-[#AA820A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-portal uppercase font-bold text-[#785B24] mb-1">
                    Partner 2 (Bride / Groom)
                  </label>
                  <input
                    type="text"
                    value={project.partner2}
                    onChange={(e) => setProject({ ...project, partner2: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#AA820A]/30 bg-white/90 text-[#5C4303] focus:bg-white focus:outline-none focus:border-[#AA820A] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-portal uppercase font-bold text-[#785B24] mb-1">
                    Formal Invitation Title
                  </label>
                  <input
                    type="text"
                    value={project.formalTitle || `The Royal Wedding Celebrations of ${project.partner1} & ${project.partner2}`}
                    onChange={(e) => setProject({ ...project, formalTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#AA820A]/30 bg-white/90 text-[#5C4303] focus:bg-white focus:outline-none focus:border-[#AA820A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-portal uppercase font-bold text-[#785B24] mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#AA820A]" /> Wedding Date / Muhurat
                  </label>
                  <input
                    type="text"
                    value={project.weddingDate?.split('T')[0] || ''}
                    onChange={(e) => setProject({ ...project, weddingDate: e.target.value })}
                    placeholder="YYYY-MM-DD or 2026-12-12"
                    className="w-full px-3 py-2 rounded-xl border border-[#AA820A]/30 bg-white/90 text-[#5C4303] focus:bg-white focus:outline-none focus:border-[#AA820A] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* CARD 2: DEDICATED GOOGLE MAPS VENUE ACCESS & GPS NAVIGATION */}
            <div className="card-pop3d-azure p-4 sm:p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1E3F66] to-[#FAF4E3] flex items-center justify-center text-white shadow-xs">
                    <Navigation className="w-4 h-4 text-[#10243E]" />
                  </div>
                  <div>
                    <h3 className="font-portal text-xs sm:text-sm font-bold uppercase text-[#142F4C] flex items-center gap-1.5">
                      Palace Venue & Google Maps GPS Access 📍
                    </h3>
                    <p className="text-[11px] text-[#1E3F66]">
                      Guests navigate directly to the wedding entrance when tapping the map icon on their invitation.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100/80 border border-sky-300 px-2 py-0.5 rounded-full">
                  GPS Navigation
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-portal uppercase font-bold text-[#142F4C] mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#1E3F66]" /> Palace / Venue Name
                  </label>
                  <input
                    type="text"
                    value={project.venue?.name || ''}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        venue: { ...project.venue, name: e.target.value },
                      })
                    }
                    placeholder="e.g. The Oberoi Udaivilas"
                    className="w-full px-3 py-2 rounded-xl border border-[#1E3F66]/30 bg-white/90 text-[#142F4C] focus:bg-white focus:outline-none focus:border-[#1E3F66] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-portal uppercase font-bold text-[#142F4C] mb-1">
                    City / Destination State
                  </label>
                  <input
                    type="text"
                    value={project.venue?.city || ''}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        venue: { ...project.venue, city: e.target.value },
                      })
                    }
                    placeholder="e.g. Udaipur, Rajasthan"
                    className="w-full px-3 py-2 rounded-xl border border-[#1E3F66]/30 bg-white/90 text-[#142F4C] focus:bg-white focus:outline-none focus:border-[#1E3F66] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-portal uppercase font-bold text-[#142F4C] mb-1">
                  Full Street Address & Landmark
                </label>
                <input
                  type="text"
                  value={project.venue?.fullAddress || ''}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      venue: { ...project.venue, fullAddress: e.target.value },
                    })
                  }
                  placeholder="e.g. Haridas Ji Ki Magri, Mulla Talai, Udaipur, Rajasthan 313001"
                  className="w-full px-3 py-2 rounded-xl border border-[#1E3F66]/30 bg-white/90 text-[#142F4C] focus:bg-white focus:outline-none focus:border-[#1E3F66] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-portal uppercase font-bold text-[#142F4C] flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-[#1E3F66]" /> Google Maps Navigation Pin URL
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const loc = `${project.venue?.name || ''} ${project.venue?.fullAddress || project.venue?.city || ''}`.trim();
                        const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc || 'Udaipur, Rajasthan')}`;
                        setProject({
                          ...project,
                          venue: { ...project.venue, googleMapsLink: link },
                        });
                        showToast('Google Maps navigation link auto-generated! 📍');
                      }}
                      className="text-[10px] font-bold text-[#1E3F66] hover:underline cursor-pointer"
                    >
                      ⚡ Auto-Generate Link
                    </button>
                    {project.venue?.googleMapsLink && (
                      <a
                        href={project.venue.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-0.5"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>Test GPS Pin</span>
                      </a>
                    )}
                  </div>
                </div>
                <input
                  type="url"
                  value={project.venue?.googleMapsLink || ''}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      venue: { ...project.venue, googleMapsLink: e.target.value },
                    })
                  }
                  placeholder="https://maps.google.com/?q=... or https://maps.app.goo.gl/..."
                  className="w-full px-3 py-2 rounded-xl border border-[#1E3F66]/30 bg-white font-mono text-[#142F4C] text-xs focus:outline-none focus:border-[#1E3F66]"
                />
              </div>

              {/* Interactive Live Google Maps Preview */}
              <div className="rounded-xl overflow-hidden border border-[#1E3F66]/30 bg-stone-100 shadow-inner">
                <div className="bg-[#FAF4E3] px-3 py-1.5 border-b border-[#1E3F66]/20 flex items-center justify-between text-[11px] text-[#142F4C] font-bold">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#AA820A]" /> Live GPS Map Preview
                  </span>
                  <span className="text-[10px] text-stone-500 font-normal">Interactive navigation perspective</span>
                </div>
                <iframe
                  title="Google Map Venue Preview"
                  width="100%"
                  height="180"
                  loading="lazy"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    `${project.venue?.name || ''} ${project.venue?.fullAddress || project.venue?.city || ''}`.trim() || 'Udaipur, Rajasthan'
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    const effectiveMapsLink =
                      project.venue?.googleMapsLink ||
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${project.venue?.name || ''} ${project.venue?.fullAddress || project.venue?.city || ''}`.trim()
                      )}`;
                    const updated: WeddingProject = {
                      ...project,
                      venue: {
                        ...project.venue,
                        fullAddress: project.venue?.fullAddress || `${project.venue?.name || ''}, ${project.venue?.city || ''}`,
                        googleMapsLink: effectiveMapsLink,
                      },
                      customization: project.customization
                        ? {
                            ...project.customization,
                            sections: {
                              ...project.customization.sections,
                              venue: {
                                ...project.customization.sections?.venue,
                                venueName: project.venue?.name || project.customization.sections?.venue?.venueName,
                                venueCity: project.venue?.city || project.customization.sections?.venue?.venueCity,
                                venueAddress:
                                  project.venue?.fullAddress ||
                                  project.venue?.city ||
                                  project.customization.sections?.venue?.venueAddress,
                                googleMapsLink: effectiveMapsLink,
                              },
                            },
                          }
                        : undefined,
                    };
                    setProject(updated);
                    await saveWeddingProject(updated);
                    showToast('Celebration details & Google Maps synced to live microsite! ✨');
                  }}
                  className="btn-slim-emerald text-xs font-bold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Save All Celebration Details & Sync Microsite</span>
                  <span>✨</span>
                </button>
              </div>
            </div>

            {/* CLIENT ACCESS PASSCODE & CREDENTIAL SETTINGS CARD */}
            <div className="card-pop3d-emerald p-4 sm:p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2D4A36] to-[#FAF4E3] flex items-center justify-center text-white shadow-xs">
                    <Key className="w-4 h-4 text-[#193822]" />
                  </div>
                  <div>
                    <h4 className="font-portal text-xs sm:text-sm font-bold uppercase text-[#193822]">
                      Client Security & Portal Passcode Manager 🔐
                    </h4>
                    <p className="text-[11px] text-[#234E30]">
                      Change your client access token or private family passcode to protect your RSVP hub.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2.5 py-1 rounded-full">
                  Private VIP
                </span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!clientPasscodeInput.trim()) {
                    showToast('Please enter a new secret passcode.');
                    return;
                  }
                  if (clientPasscodeInput !== clientConfirmPasscodeInput) {
                    showToast('New passcodes do not match. Please re-enter.');
                    return;
                  }
                  const success = updateClientCredentials(clientId, clientPasscodeInput, clientTokenInput);
                  if (success) {
                    showToast('Client Access Passcode updated successfully! 💌');
                    setClientPasscodeInput('');
                    setClientConfirmPasscodeInput('');
                  } else {
                    showToast('Failed to update client credentials.');
                  }
                }}
                className="space-y-3 pt-2 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-portal uppercase font-bold text-[#234E30] mb-1">
                      Client Access Token
                    </label>
                    <input
                      type="text"
                      required
                      value={clientTokenInput}
                      onChange={(e) => setClientTokenInput(e.target.value)}
                      placeholder="e.g. CLT-GOURAV"
                      className="w-full px-3 py-2 rounded-xl border border-[#739B83]/40 bg-white/90 text-[#193822] focus:outline-none focus:border-[#2D4A36]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-portal uppercase font-bold text-[#234E30] mb-1">
                      New Secret Passcode
                    </label>
                    <input
                      type="password"
                      required
                      value={clientPasscodeInput}
                      onChange={(e) => setClientPasscodeInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 rounded-xl border border-[#739B83]/40 bg-white/90 text-[#193822] focus:outline-none focus:border-[#2D4A36]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-portal uppercase font-bold text-[#234E30] mb-1">
                      Confirm New Passcode
                    </label>
                    <input
                      type="password"
                      required
                      value={clientConfirmPasscodeInput}
                      onChange={(e) => setClientConfirmPasscodeInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 rounded-xl border border-[#739B83]/40 bg-white/90 text-[#193822] focus:outline-none focus:border-[#2D4A36]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <p className="text-[10px] text-[#234E30]">
                    Only authorized family members with this passcode can manage this portal.
                  </p>
                  <button
                    type="submit"
                    className="btn-slim-emerald text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save New Passcode</span>
                    <span>✨</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 6: MEDIA UPLOAD (Real File Upload for Photos & Audio) */}
        {activeTab === 'media' && (
          <div className="space-y-3">
            <div className="card-pop3d-azure p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/80 border border-[#6B9AC4]/30 flex items-center justify-center text-[#142F4C] shadow-2xs shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-portal text-xs font-bold uppercase text-[#142F4C]">
                    Royal Media & Assets Uploader 📸
                  </h3>
                  <p className="text-[11px] text-[#1E3F66]">
                    Direct file upload for couple portraits, cover photography, and royal background audio
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold bg-white/95 text-[#142F4C] px-3 py-1 rounded-xl border border-[#6B9AC4]/30 shadow-2xs shrink-0">
                Cloud Storage Ready ☁️
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Card 1: Cover Photo File Upload */}
              <div className="card-pop3d-amber p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#AA820A]" />
                    <span className="font-portal text-xs font-bold text-[#5C4303] uppercase">
                      Couple Portrait / Cover Photo
                    </span>
                  </div>
                  <span className="text-xs">🖼️</span>
                </div>
                <p className="text-[11px] text-[#785B24]">
                  Upload high-resolution couple photography for invitation banners and share cards.
                </p>

                <div className="p-3 bg-white/80 rounded-xl border border-[#AA820A]/20 flex flex-col items-center justify-center gap-2 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    id="portal-cover-photo-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (uploadEvent) => {
                        const dataUrl = uploadEvent.target?.result as string;
                        setProject({
                          ...project,
                          coverImageUrl: dataUrl,
                          media: {
                            ...(project.media || {}),
                            coverPhoto: dataUrl,
                          },
                        });
                        showToast(`Uploaded ${file.name} successfully!`);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  <label
                    htmlFor="portal-cover-photo-upload"
                    className="btn-slim-gold text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                    <span>📷</span>
                  </label>
                  <span className="text-[10px] text-[#785B24]">Supported formats: JPG, PNG, WEBP</span>
                </div>

                {project.media?.coverPhoto && (
                  <div className="relative rounded-xl overflow-hidden border border-[#AA820A]/30 aspect-video bg-neutral-100 shadow-xs">
                    <img
                      src={project.media.coverPhoto}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Live Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2: Background Music Audio File Upload */}
              <div className="card-pop3d-emerald p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#193822]" />
                    <span className="font-portal text-xs font-bold text-[#193822] uppercase">
                      Background Shehnai / Music Track
                    </span>
                  </div>
                  <span className="text-xs">🎶</span>
                </div>
                <p className="text-[11px] text-[#234E30]">
                  Upload custom MP3 audio track that plays automatically when guests unlock the wedding seal.
                </p>

                <div className="p-3 bg-white/80 rounded-xl border border-[#739B83]/30 flex flex-col items-center justify-center gap-2 text-center">
                  <input
                    type="file"
                    accept="audio/*"
                    id="portal-audio-track-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const audioUrl = URL.createObjectURL(file);
                      setProject({
                        ...project,
                        backgroundAudioUrl: audioUrl,
                        media: {
                          ...(project.media || {}),
                          backgroundMusic: audioUrl,
                        },
                      });
                      showToast(`Uploaded ${file.name} audio file!`);
                    }}
                  />
                  <label
                    htmlFor="portal-audio-track-upload"
                    className="btn-slim-emerald text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Audio File</span>
                    <span>🎵</span>
                  </label>
                  <span className="text-[10px] text-[#234E30]">Supported formats: MP3, WAV, AAC, M4A</span>
                </div>

                {project.media?.backgroundMusic && (
                  <div className="p-2.5 rounded-xl bg-white/90 border border-emerald-300 shadow-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <Music className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="text-xs text-[#193822] font-mono truncate">
                        Audio Track Loaded
                      </span>
                    </div>
                    <audio
                      src={project.media.backgroundMusic}
                      controls
                      className="h-8 max-w-[200px]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SUITES SWITCHER */}
        {activeTab === 'suites' && (
          <div className="space-y-3">
            <div className="card-pop3d-azure p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/80 border border-[#6B9AC4]/30 flex items-center justify-center text-[#142F4C] shadow-2xs shrink-0">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-portal text-xs font-bold uppercase text-[#142F4C]">
                    Choose Your Active Invitation Suite 👑
                  </h3>
                  <p className="text-[11px] text-[#1E3F66]">
                    Switch instantly between all {TEMPLATE_LIST.length} luxury design suites without losing any guest RSVPs or DJ requests
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold bg-white/95 text-[#142F4C] px-3 py-1 rounded-xl border border-[#6B9AC4]/30 shadow-2xs shrink-0">
                {TEMPLATE_LIST.length} Couture Suites 💎
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
                    className={`rounded-2xl p-4 space-y-2 flex flex-col justify-between transition-all duration-200 ${
                      isActive ? 'card-pop3d-emerald ring-2 ring-emerald-600/40' : 'card-pop3d-amber'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-portal uppercase font-bold text-[#5C4303] bg-white/90 border border-[#AA820A]/30 px-2 py-0.5 rounded-md shadow-2xs">
                          {suite.badge}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                            <Check className="w-3 h-3 stroke-[3]" /> Active Suite
                          </span>
                        )}
                      </div>
                      <h4 className="font-portal text-base font-bold text-[#5C4303] mt-2">{suite.name}</h4>
                      <p className="text-xs text-[#785B24] leading-snug">{suite.tagline}</p>
                    </div>

                    <div className="pt-3 border-t border-[#AA820A]/20 flex items-center justify-between">
                      <Link
                        href={`/${project.slug}?template=${suite.id}`}
                        target="_blank"
                        className="text-xs text-[#AA820A] hover:underline font-bold font-portal flex items-center gap-1"
                      >
                        <span>Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => handleSwitchSuite(suite.id)}
                        disabled={isActive}
                        className={`btn-slim-gold text-xs font-bold ${
                          isActive ? 'opacity-60 cursor-default' : ''
                        }`}
                      >
                        {isActive ? 'Current Suite ✨' : 'Activate Suite 👑'}
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
      <nav className="fixed bottom-3 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md z-40 bg-white/95 backdrop-blur-xl border border-[#AA820A]/40 rounded-2xl p-1 shadow-[0_12px_40px_rgba(170,130,10,0.18)] flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={`p-1.5 sm:p-2 rounded-xl transition duration-200 flex items-center justify-center shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#193822] shadow-md scale-105 font-bold'
                  : 'text-[#785B24] hover:text-[#5C4303] hover:bg-[#FAF4E3]'
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
          <div className="card-pop3d-amber rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-[#AA820A]/40 animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-[#FAF4E3] to-[#F3E5AB] text-[#5C4303] p-3.5 flex items-center justify-between border-b border-[#AA820A]/30">
              <h3 className="font-portal font-black text-xs uppercase tracking-wider text-[#5C4303] flex items-center gap-1.5">
                <span>Add Wedding Guest</span>
                <span>💌</span>
              </h3>
              <button
                onClick={() => setShowAddGuestModal(false)}
                className="p-1 rounded-full hover:bg-white/80 text-[#785B24] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddGuestSubmit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-portal uppercase font-bold text-[#785B24] mb-1">
                  Guest Name & Salutation
                </label>
                <input
                  type="text"
                  required
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="e.g. Vikramaditya & Priya Singhania"
                  className="w-full px-3 py-2 rounded-xl border border-[#AA820A]/30 bg-[#FAF8F5] text-[#5C4303] focus:outline-none focus:border-[#AA820A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-portal uppercase font-bold text-[#785B24] mb-1 flex items-center gap-1">
                  <WhatsAppIcon className="w-3 h-3 text-[#25D366]" /> Mobile Number (wa.me)
                </label>
                <input
                  type="text"
                  required
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  placeholder="+919820012345"
                  className="w-full px-3 py-2 rounded-xl border border-[#AA820A]/30 bg-[#FAF8F5] text-[#5C4303] font-mono text-xs focus:outline-none focus:border-[#AA820A]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-slim-gold w-full text-xs font-bold uppercase flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Save VIP Guest</span>
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
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
