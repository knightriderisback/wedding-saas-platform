'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WeddingProject, GuestContact } from '@/types/wedding';
import { getAllProjects, saveWeddingProject, deleteWeddingProject } from '@/lib/firebase';
import { defaultWeddingProject } from '@/lib/mockData';
import { TEMPLATE_LIST, PRESSED_LOVE_TEMPLATES } from '@/lib/pressedLoveTemplates';
import { AcrylicBackgroundOrbs } from '@/components/common/AcrylicBackgroundOrbs';
import {
  ShieldCheck,
  Crown,
  Users,
  TrendingUp,
  Palette,
  IndianRupee,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Search,
  KeyRound,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  X,
  MessageCircle,
  Eye,
  Clock,
  MapPin,
  CheckCircle2,
  Heart,
  Music,
  Mic,
  Send,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

export default function SuperAdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<WeddingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'upcoming' | 'draft'>('all');

  // Navigation tab matching Rajhara Express pattern
  const [activeTab, setActiveTab] = useState<'projects' | 'guests' | 'analytics' | 'templates' | 'financials' | 'settings'>('projects');

  // Onboard Client Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [weddingDate, setWeddingDate] = useState('2027-11-20');
  const [venueName, setVenueName] = useState('The Oberoi Udaivilas');
  const [venueCity, setVenueCity] = useState('Udaipur, Rajasthan');
  const [selectedSuite, setSelectedSuite] = useState('the-venue');
  const [clientPhone, setClientPhone] = useState('+919820012345');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    const data = await getAllProjects();
    setProjects(data.length > 0 ? data : [defaultWeddingProject]);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handlePartnerChange = (p1: string, p2: string) => {
    setPartner1(p1);
    setPartner2(p2);
    if (!customSlug || customSlug.includes('-weds-')) {
      const s1 = p1.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const s2 = p2.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (s1 && s2) {
        setCustomSlug(`${s1}-weds-${s2}`);
      }
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner1.trim() || !partner2.trim() || !customSlug.trim()) return;

    setIsSubmitting(true);
    const cleanSlug = customSlug.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const clientId = `client-${cleanSlug}`;
    const token = `CLT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newProject: WeddingProject = {
      ...defaultWeddingProject,
      id: clientId,
      slug: cleanSlug,
      partner1: partner1.trim(),
      partner2: partner2.trim(),
      formalTitle: `The Royal Wedding Celebrations of ${partner1} & ${partner2}`,
      weddingDate: new Date(weddingDate + 'T18:00:00Z').toISOString(),
      venue: {
        name: venueName,
        city: venueCity,
        fullAddress: `${venueName}, ${venueCity}`,
        googleMapsLink: `https://maps.google.com/?q=${encodeURIComponent(venueName + ' ' + venueCity)}`,
      },
      clientAccessToken: token,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      suite: selectedSuite,
      template: selectedSuite,
      guests: [
        {
          id: `g-101`,
          name: `${partner1.split(' ')[0]} Family & VIPs`,
          phone: clientPhone,
          sentWhatsApp: false,
          rsvpStatus: 'pending',
          attendingCount: 0,
        },
      ],
      djPlaylist: [],
      blessings: [],
    };

    await saveWeddingProject(newProject);
    await loadProjects();

    setIsSubmitting(false);
    setShowCreateModal(false);
    setPartner1('');
    setPartner2('');
    setCustomSlug('');
  };

  const handleDeleteProject = async (slug: string) => {
    if (confirm(`Are you sure you want to delete celebration project "/${slug}"?`)) {
      await deleteWeddingProject(slug);
      await loadProjects();
    }
  };

  const handleCopyLink = (slug: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleCopyToken = (token: string, id: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.partner1.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.partner2.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.venue.city.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;
      if (filterStatus === 'active') return p.status === 'active';
      if (filterStatus === 'upcoming') return new Date(p.weddingDate) > new Date();
      if (filterStatus === 'draft') return p.status === 'draft';
      return true;
    });
  }, [projects, searchQuery, filterStatus]);

  // Aggregated Telemetry
  const totalGuests = useMemo(
    () => projects.reduce((acc, p) => acc + (p.guests?.length || 0), 0),
    [projects]
  );
  const totalRsvps = useMemo(
    () =>
      projects.reduce(
        (acc, p) =>
          acc + (p.guests?.filter((g) => g.rsvpStatus === 'attending').length || 0),
        0
      ),
    [projects]
  );
  const totalDispatched = useMemo(
    () =>
      projects.reduce(
        (acc, p) =>
          acc + (p.guests?.filter((g) => g.sentWhatsApp).length || 0),
        0
      ),
    [projects]
  );
  const totalDjSongs = useMemo(
    () => projects.reduce((acc, p) => acc + (p.djPlaylist?.length || 0), 0),
    [projects]
  );

  // All Guests Flat
  const allGuestsFlat = useMemo(() => {
    const list: Array<{ guest: GuestContact; projectSlug: string; couple: string }> = [];
    projects.forEach((p) => {
      (p.guests || []).forEach((g) => {
        list.push({
          guest: g,
          projectSlug: p.slug,
          couple: `${p.partner1.split(' ')[0]} & ${p.partner2.split(' ')[0]}`,
        });
      });
    });
    return list;
  }, [projects]);

  // Bottom Navigation Items (matching Rajhara Express dock)
  const navItems = [
    { id: 'projects', icon: Crown, label: 'Projects' },
    { id: 'guests', icon: Users, label: 'Guests Hub' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
    { id: 'templates', icon: Palette, label: '13 Suites' },
    { id: 'financials', icon: IndianRupee, label: 'Finance' },
    { id: 'settings', icon: ShieldCheck, label: 'Security' },
  ];

  // Dynamic Tab Information Mapping (Rajhara Express pattern adapted to Royal Wedding theme)
  const tabConfig = {
    projects: {
      title: 'Client Wedding Projects & Shadow Impersonation',
      shortTitle: 'Projects Dashboard',
      icon: Crown,
      subtitle: 'Manage bespoke wedding clients, custom vanity slugs, and shadow login portal',
      badge: `${projects.length} Total Projects`,
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
      title: 'Global Guest Registry & WhatsApp Dispatch Telemetry',
      shortTitle: 'Guest Registry',
      icon: Users,
      subtitle: 'Consolidated attendee database, contact import status, and automated wa.me delivery tags',
      badge: `${totalGuests} Guests Tracked`,
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
    analytics: {
      title: 'Celebration Telemetry, Seal Breaks & RSVP Insights',
      shortTitle: 'Telemetry & Analytics',
      icon: TrendingUp,
      subtitle: 'Real-time wax seal unboxings, scratch card reveals, and Sangeet song telemetry',
      badge: `${totalRsvps} RSVPs Confirmed`,
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
    templates: {
      title: '13 Ultra-Luxury Invitation Suites Catalog',
      shortTitle: 'Design Suites',
      icon: Palette,
      subtitle: 'All 13 PressedLove & Royal Palace couture invitation templates live on platform',
      badge: '13 Couture Suites',
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
    financials: {
      title: 'Enterprise Billing, Retainers & SaaS Accounts',
      shortTitle: 'Revenue & Accounts',
      icon: IndianRupee,
      subtitle: 'SaaS client subscriptions, custom domain fees, and concierge retainer pipeline',
      badge: '₹4,95,000 Pipeline',
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
    settings: {
      title: 'Platform Security, Storage & WhatsApp Cloud Gateway',
      shortTitle: 'System Settings',
      icon: ShieldCheck,
      subtitle: 'Master tokens, Firebase Storage configuration, and WhatsApp Cloud API credentials',
      badge: 'Production Online',
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
  };

  const currentTab = tabConfig[activeTab];
  const CurrentTabIcon = currentTab.icon;

  return (
    <div className="min-h-screen bg-khadi-fabric relative pb-24 text-[#2C2218] selection:bg-[#D4AF37]/30 selection:text-[#2C2218] overflow-x-hidden">
      {/* 3D Floating Glass Bubbles & Refraction Orbs */}
      <AcrylicBackgroundOrbs variant="multi" />

      {/* ULTRA-SLIM STICKY MERCHANT HEADER (Rajhara Express Pattern in Luxury Soft Gold/Alabaster) */}
      <header className="bg-white/90 backdrop-blur-md text-[#2C2218] sticky top-0 z-30 border-b border-[#E8DFC8] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          {/* Left: Home / Store Link & Clean Minimal Title */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-[#FAF4E3] hover:bg-[#F3E5AB] text-[#7D5F04] border border-[#AA820A]/30 transition shadow-2xs"
              title="Return to Welcome Showcase"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#AA820A] via-[#D4AF37] to-[#FAF4E3] flex items-center justify-center text-white font-cinzel font-bold text-xs shadow-xs">
              👑
            </div>
            <div className="leading-tight">
              <span className="font-cinzel font-black text-xs sm:text-sm tracking-tight text-[#2C2218]">
                Super-Admin Control Panel
              </span>
              <span className="text-[10px] text-[#7D5F04] font-serif ml-1.5 hidden sm:inline">
                • Royal Concierge Master SaaS
              </span>
            </div>
          </div>

          {/* Right: Browse Suites Link, Tiny '+' Add Project & Mode Indicator */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/templates"
              target="_blank"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF4E3] hover:bg-[#F3E5AB] text-[#7D5F04] text-xs font-cinzel font-bold transition shadow-2xs border border-[#AA820A]/40"
              title="Open 13 Luxury Design Suites in new tab"
            >
              <Palette className="w-3.5 h-3.5 text-[#AA820A] shrink-0" />
              <span className="hidden sm:inline">13 Suites Gallery</span>
            </Link>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 text-[#2C2218] font-cinzel font-black text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
              title="Onboard New Wedding Project"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">New Client</span>
            </button>

            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-mono font-bold flex items-center gap-1 border border-emerald-300 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline text-[10px]">Super Admin Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-4 py-3 space-y-3">
        {/* Dynamic Section Heading Banner with Royal Theme (Rajhara Express pattern) */}
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
                  Super Admin / {currentTab.shortTitle}
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

        {/* TAB 1: PROJECTS (Super-Admin Control & Shadow Access) */}
        {activeTab === 'projects' && (
          <div className="space-y-3">
            {/* Soft Acrylic 3D Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="acrylic-amber card-3d p-3 rounded-2xl">
                <div className="text-[10px] font-cinzel font-bold text-[#7D5F04] uppercase">Total Projects</div>
                <div className="text-base sm:text-xl font-black text-[#2C2218] mt-0.5">{projects.length}</div>
                <div className="text-[9px] text-emerald-800 font-semibold mt-1 flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> 100% Hosted
                </div>
              </div>

              <div className="acrylic-rose card-3d p-3 rounded-2xl">
                <div className="text-[10px] font-cinzel font-bold text-[#9B1C2E] uppercase">Guests Onboarded</div>
                <div className="text-base sm:text-xl font-black text-[#AA820A] mt-0.5">{totalGuests}</div>
                <div className="text-[9px] text-[#9B1C2E] font-medium mt-1">Across all client hubs</div>
              </div>

              <div className="acrylic-sage card-3d p-3 rounded-2xl">
                <div className="text-[10px] font-cinzel font-bold text-[#2D4A36] uppercase">RSVPs Confirmed</div>
                <div className="text-base sm:text-xl font-black text-[#9B1C2E] mt-0.5">{totalRsvps}</div>
                <div className="text-[9px] text-[#2D4A36] font-medium mt-1">VIP QR Passes Issued</div>
              </div>

              <div className="acrylic-azure card-3d p-3 rounded-2xl">
                <div className="text-[10px] font-cinzel font-bold text-[#242A36] uppercase">WhatsApp Invites</div>
                <div className="text-base sm:text-xl font-black text-[#1A365D] mt-0.5">{totalDispatched}</div>
                <div className="text-[9px] text-emerald-700 font-medium mt-1">Dispatched via wa.me</div>
              </div>
            </div>

            {/* Filter Pills and Search Bar in Acrylic Glass */}
            <div className="acrylic-glass card-3d p-3 sm:p-3.5 rounded-2xl space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-[#7D5F04] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by couple name, slug, or destination city..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] focus:outline-none focus:border-[#AA820A]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: `All (${projects.length})` },
                    { id: 'active', label: 'Active Celebrations' },
                    { id: 'upcoming', label: 'Upcoming' },
                    { id: 'draft', label: 'Drafts' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setFilterStatus(filter.id as typeof filterStatus)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-cinzel font-bold transition whitespace-nowrap cursor-pointer ${
                        filterStatus === filter.id
                          ? 'bg-[#2C2218] text-[#FAF8F5] shadow-xs'
                          : 'bg-[#FAF8F5] text-[#7D5F04] hover:bg-[#FAF4E3] border border-[#E8DFC8]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Client Wedding Projects Table in Acrylic Glass Card */}
            <div className="acrylic-glass card-3d rounded-2xl overflow-hidden">
              <div className="p-3 border-b border-[#E8DFC8] flex items-center justify-between">
                <h3 className="font-cinzel text-xs font-bold uppercase text-[#7D5F04] tracking-wider flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-[#AA820A]" /> Wedding Project Registry
                </h3>
                <span className="text-[11px] font-mono text-[#7D5F04]">
                  Showing {filteredProjects.length} of {projects.length}
                </span>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#7D5F04] space-y-2">
                  <p>No wedding projects found matching your search filter.</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#2C2218] font-cinzel font-bold text-xs"
                  >
                    + Create First Wedding Project
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-[10px] uppercase font-cinzel font-bold text-[#7D5F04] border-b border-[#E8DFC8]">
                      <tr>
                        <th className="py-2.5 px-3">Couple / Project</th>
                        <th className="py-2.5 px-3">Custom Slug</th>
                        <th className="py-2.5 px-3">Venue & Date</th>
                        <th className="py-2.5 px-3">Guests & Invites</th>
                        <th className="py-2.5 px-3 text-right">Actions & Shadow Login</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DFC8]/60">
                      {filteredProjects.map((p) => {
                        const guestsCount = p.guests?.length || 0;
                        const dispatchedCount = p.guests?.filter((g) => g.sentWhatsApp).length || 0;
                        const confirmedCount = p.guests?.filter((g) => g.rsvpStatus === 'attending').length || 0;
                        const dateFormatted = new Date(p.weddingDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        });

                        return (
                          <tr key={p.id} className="hover:bg-[#FDFBF7] transition-colors">
                            {/* Couple & Monogram */}
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#AA820A] to-[#FAF4E3] border border-[#D4AF37] flex items-center justify-center text-[#2C2218] font-cinzel font-black text-xs shrink-0 shadow-2xs">
                                  {p.partner1[0]}&{p.partner2[0]}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-serif font-bold text-sm text-[#2C2218] truncate">
                                    {p.partner1} & {p.partner2}
                                  </div>
                                  <div className="text-[10px] text-[#7D5F04] font-mono flex items-center gap-1">
                                    <span>Token: {p.clientAccessToken || 'CLT-ROYAL'}</span>
                                    <button
                                      onClick={() => handleCopyToken(p.clientAccessToken || 'CLT-ROYAL', p.id)}
                                      className="hover:text-black"
                                      title="Copy Client Access Token"
                                    >
                                      {copiedToken === p.id ? (
                                        <Check className="w-3 h-3 text-emerald-600 inline" />
                                      ) : (
                                        <Copy className="w-3 h-3 inline" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Slug & Link */}
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <Link
                                  href={`/${p.slug}`}
                                  target="_blank"
                                  className="font-mono text-xs text-[#AA820A] hover:underline font-semibold flex items-center gap-1"
                                  title="Open Guest Microsite"
                                >
                                  /{p.slug}
                                  <ExternalLink className="w-3 h-3 text-[#7D5F04]" />
                                </Link>
                                <button
                                  onClick={() => handleCopyLink(p.slug)}
                                  className="p-1 rounded hover:bg-[#FAF4E3] text-[#7D5F04]"
                                  title="Copy Invitation Link"
                                >
                                  {copiedSlug === p.slug ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* Venue & Date */}
                            <td className="py-3 px-3">
                              <div className="text-[#2C2218] font-medium text-xs flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#AA820A] shrink-0" />
                                {p.venue.city}
                              </div>
                              <div className="text-[10px] text-[#7D5F04] flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3 shrink-0" />
                                {dateFormatted}
                              </div>
                            </td>

                            {/* Guests & Invites Progress */}
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="text-xs font-bold text-[#2C2218]">
                                  {dispatchedCount}/{guestsCount}
                                </div>
                                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-bold">
                                  {confirmedCount} Confirmed
                                </span>
                              </div>
                              <div className="w-24 bg-[#E8DFC8] h-1.5 rounded-full mt-1 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-[#AA820A] to-emerald-600 h-full rounded-full"
                                  style={{
                                    width: `${guestsCount > 0 ? (dispatchedCount / guestsCount) * 100 : 0}%`,
                                  }}
                                />
                              </div>
                            </td>

                            {/* Actions & SHADOW ACCESS */}
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* SHADOW ACCESS BUTTON (Login As Client) */}
                                <Link
                                  href={`/portal/${p.id}?shadowAdmin=true`}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#2C2218] hover:bg-[#4A3B2C] text-[#FAF8F5] text-xs font-cinzel font-bold transition flex items-center gap-1 shadow-2xs"
                                  title="Directly manage client's portal without credentials"
                                >
                                  <KeyRound className="w-3 h-3 text-[#D4AF37]" />
                                  <span>Login As Client</span>
                                </Link>

                                <Link
                                  href={`/${p.slug}`}
                                  target="_blank"
                                  className="p-1.5 rounded-lg bg-[#FAF4E3] hover:bg-[#F3E5AB] text-[#7D5F04] border border-[#AA820A]/40 transition"
                                  title="Preview Live Guest Microsite"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </Link>

                                {p.slug !== 'rohit-weds-priya' && (
                                  <button
                                    onClick={() => handleDeleteProject(p.slug)}
                                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition"
                                    title="Delete Project"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GUESTS HUB */}
        {activeTab === 'guests' && (
          <div className="space-y-3">
            <div className="acrylic-rose card-3d p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-xs font-bold uppercase text-[#9B1C2E]">
                  Consolidated Guest Telemetry
                </h3>
                <p className="text-[11px] text-[#544230]">
                  Track all attendee invitations, WhatsApp dispatch status, and dietary requests
                </p>
              </div>
              <span className="font-mono text-xs font-bold bg-white text-[#9B1C2E] px-3 py-1 rounded-full border border-rose-200/80 shadow-2xs">
                {allGuestsFlat.length} Total Guests Across Platform
              </span>
            </div>

            <div className="acrylic-glass card-3d rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[10px] uppercase font-cinzel font-bold text-[#7D5F04] border-b border-[#E8DFC8]">
                    <tr>
                      <th className="py-2.5 px-3">Guest Name</th>
                      <th className="py-2.5 px-3">Phone Number</th>
                      <th className="py-2.5 px-3">Wedding Project</th>
                      <th className="py-2.5 px-3">WhatsApp Status</th>
                      <th className="py-2.5 px-3">RSVP Status</th>
                      <th className="py-2.5 px-3 text-right">Quick Dispatch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFC8]/60">
                    {allGuestsFlat.map((item, idx) => {
                      const g = item.guest;
                      const cleanPhone = g.phone.replace(/[^0-9]/g, '');
                      const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                        `Royal Wedding Invitation for ${item.couple}: View your invitation at https://wedding-saas-platform-iota.vercel.app/${item.projectSlug}?guest=${encodeURIComponent(
                          g.name
                        )}`
                      )}`;

                      return (
                        <tr key={idx} className="hover:bg-[#FDFBF7]">
                          <td className="py-2.5 px-3 font-semibold text-[#2C2218]">{g.name}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-[#544230]">{g.phone}</td>
                          <td className="py-2.5 px-3 font-cinzel text-[11px] text-[#AA820A]">{item.couple}</td>
                          <td className="py-2.5 px-3">
                            {g.sentWhatsApp ? (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Dispatched
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                                <Clock className="w-3 h-3 text-amber-600" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                                g.rsvpStatus === 'attending'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : g.rsvpStatus === 'declined'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-neutral-100 text-neutral-700'
                              }`}
                            >
                              {g.rsvpStatus?.toUpperCase() || 'AWAITING'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-[10px] inline-flex items-center gap-1 shadow-2xs"
                            >
                              <MessageCircle className="w-3 h-3" /> WhatsApp
                            </a>
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

        {/* TAB 3: ANALYTICS & TELEMETRY */}
        {activeTab === 'analytics' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="acrylic-amber card-3d p-3 rounded-2xl text-center">
                <span className="text-[10px] font-cinzel uppercase text-[#7D5F04] font-bold">Wax Seal Breaks</span>
                <div className="text-2xl font-black text-[#AA820A] mt-1">94.8%</div>
                <span className="text-[10px] text-emerald-800 font-semibold">Open rate verified</span>
              </div>
              <div className="acrylic-rose card-3d p-3 rounded-2xl text-center">
                <span className="text-[10px] font-cinzel uppercase text-[#9B1C2E] font-bold">Scratch Card Clears</span>
                <div className="text-2xl font-black text-[#9B1C2E] mt-1">88.2%</div>
                <span className="text-[10px] text-neutral-600">Gold foil revealed</span>
              </div>
              <div className="acrylic-sage card-3d p-3 rounded-2xl text-center">
                <span className="text-[10px] font-cinzel uppercase text-[#2D4A36] font-bold">Sangeet Songs Queued</span>
                <div className="text-2xl font-black text-[#2D4A36] mt-1">{totalDjSongs}</div>
                <span className="text-[10px] text-neutral-600">Exported to DJ PDF</span>
              </div>
              <div className="acrylic-azure card-3d p-3 rounded-2xl text-center">
                <span className="text-[10px] font-cinzel uppercase text-[#242A36] font-bold">Avg Experience Time</span>
                <div className="text-2xl font-black text-[#1A365D] mt-1">3m 42s</div>
                <span className="text-[10px] text-emerald-800 font-semibold">High guest immersion</span>
              </div>
            </div>

            <div className="acrylic-glass card-3d p-4 rounded-2xl space-y-3">
              <h4 className="font-cinzel text-xs font-bold uppercase text-[#7D5F04]">
                Device Breakdown & Traffic Source
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-neutral-600 mb-1">
                    <span>Mobile (WhatsApp & Instagram)</span>
                    <span className="font-bold">89.4%</span>
                  </div>
                  <div className="w-full bg-[#FAF4E3] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#AA820A] h-full rounded-full" style={{ width: '89.4%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-neutral-600 mb-1">
                    <span>Desktop / Tablet Concierge</span>
                    <span className="font-bold">10.6%</span>
                  </div>
                  <div className="w-full bg-[#FAF4E3] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#7D5F04] h-full rounded-full" style={{ width: '10.6%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 13 DESIGN SUITES CATALOG */}
        {activeTab === 'templates' && (
          <div className="space-y-3">
            <div className="acrylic-lilac card-3d p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-xs font-bold uppercase text-[#7D5F04]">
                  13 Couture Wedding Invitation Suites
                </h3>
                <p className="text-[11px] text-[#544230]">
                  All suites include 3D Wax Seal Envelopes, Scratch Cards, Petal Showers, DJ Managers & Voice Recorders
                </p>
              </div>
              <Link
                href="/templates"
                target="_blank"
                className="px-3 py-1.5 rounded-lg bg-[#2C2218] text-[#FAF8F5] text-xs font-cinzel font-bold flex items-center gap-1 shadow-sm"
              >
                Full Catalog <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TEMPLATE_LIST.map((suite) => (
                <div
                  key={suite.id}
                  className="acrylic-glass card-3d rounded-2xl overflow-hidden p-3.5 space-y-2 flex flex-col justify-between hover:border-[#AA820A] transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-cinzel text-[10px] uppercase font-bold text-[#AA820A] bg-[#FAF4E3] px-2 py-0.5 rounded-md">
                        {suite.badge}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">/{suite.slug}</span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-[#2C2218]">{suite.name}</h4>
                    <p className="text-xs text-[#544230] leading-snug">{suite.tagline}</p>
                  </div>

                  <div className="pt-2 border-t border-[#FAF4E3] flex items-center justify-between mt-2">
                    <Link
                      href={`/wedding-invitation-${suite.id}`}
                      target="_blank"
                      className="text-xs font-cinzel font-bold text-[#AA820A] hover:underline flex items-center gap-1"
                    >
                      Open Live Demo <ExternalLink className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={() => {
                        setShowCreateModal(true);
                        setSelectedSuite(suite.id);
                      }}
                      className="px-2.5 py-1 rounded bg-[#FAF4E3] hover:bg-[#F3E5AB] text-[#7D5F04] font-bold text-[11px]"
                    >
                      Use for Client
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FINANCIALS & BILLING */}
        {activeTab === 'financials' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="acrylic-amber card-3d p-4 rounded-2xl">
                <span className="text-[10px] font-cinzel uppercase text-[#7D5F04] font-bold">Gross Client Pipeline</span>
                <div className="text-2xl font-black text-[#AA820A] mt-1">₹4,95,000</div>
                <span className="text-[10px] text-neutral-600">6 Ultra-Luxury Retainers</span>
              </div>
              <div className="acrylic-sage card-3d p-4 rounded-2xl">
                <span className="text-[10px] font-cinzel uppercase text-[#2D4A36] font-bold">Average Project Fee</span>
                <div className="text-2xl font-black text-[#2C2218] mt-1">₹82,500</div>
                <span className="text-[10px] text-emerald-800 font-semibold">Custom Domain + Sitar Audio</span>
              </div>
              <div className="acrylic-azure card-3d p-4 rounded-2xl">
                <span className="text-[10px] font-cinzel uppercase text-[#242A36] font-bold">WhatsApp Dispatch Tier</span>
                <div className="text-2xl font-black text-emerald-700 mt-1">Active</div>
                <span className="text-[10px] text-neutral-600">Unlimited Concierge Invites</span>
              </div>
            </div>

            <div className="acrylic-glass card-3d p-4 rounded-2xl space-y-3">
              <h4 className="font-cinzel text-xs font-bold uppercase text-[#7D5F04]">
                Recent Invoices & Retainers
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 border border-[#E8DFC8]">
                  <div>
                    <div className="font-bold text-[#2C2218]">The Oberoi Udaivilas Celebration (Rohit & Priya)</div>
                    <div className="text-[10px] text-neutral-500">Royal Palace Bespoke Suite • Udaipur</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-800">₹99,999 Paid</div>
                    <span className="text-[9px] text-neutral-400">INV-2026-001</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 border border-[#E8DFC8]">
                  <div>
                    <div className="font-bold text-[#2C2218]">Taj Lake Palace Union (Aditya & Ananya)</div>
                    <div className="text-[10px] text-neutral-500">Pressed Meadow Couture • Lake Pichola</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-800">₹85,000 Paid</div>
                    <span className="text-[9px] text-neutral-400">INV-2026-002</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY & SETTINGS */}
        {activeTab === 'settings' && (
          <div className="acrylic-azure card-3d p-4 sm:p-5 rounded-2xl space-y-4">
            <h4 className="font-cinzel text-xs font-bold uppercase text-[#242A36] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#AA820A]" /> Platform Health & Infrastructure
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/80 border border-[#E8DFC8] space-y-1">
                <span className="text-[10px] font-cinzel uppercase font-bold text-[#7D5F04]">Database Storage</span>
                <p className="font-semibold text-[#2C2218]">Firebase Firestore & Local Fallback</p>
                <p className="text-[11px] text-neutral-500">Multi-region synchronised with offline cache.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/80 border border-[#E8DFC8] space-y-1">
                <span className="text-[10px] font-cinzel uppercase font-bold text-[#7D5F04]">Audio Synthesis Engine</span>
                <p className="font-semibold text-[#2C2218]">Web Audio API Sitar & Bansuri Synthesizer</p>
                <p className="text-[11px] text-neutral-500">Real-time dynamic drone, chime & wax crack sound.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/80 border border-[#E8DFC8] space-y-1">
                <span className="text-[10px] font-cinzel uppercase font-bold text-[#7D5F04]">WhatsApp Cloud Gateway</span>
                <p className="font-semibold text-emerald-700">1-Click Direct WhatsApp API (wa.me)</p>
                <p className="text-[11px] text-neutral-500">Auto-formatted invitation cards with instant status update.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/80 border border-[#E8DFC8] space-y-1">
                <span className="text-[10px] font-cinzel uppercase font-bold text-[#7D5F04]">PDF Export Module</span>
                <p className="font-semibold text-[#2C2218]">jsPDF Royal Gold Document Engine</p>
                <p className="text-[11px] text-neutral-500">1-Click printable DJ setlist generator with phone numbers.</p>
              </div>
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

      {/* MODAL: ONBOARD NEW WEDDING CLIENT */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E8DFC8] animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-[#FAF4E3] to-[#F3E5AB] text-[#2C2218] p-3.5 flex items-center justify-between border-b border-[#AA820A]/30">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#AA820A]" />
                <h3 className="font-cinzel font-black text-xs uppercase tracking-wider text-[#2C2218]">
                  Onboard Wedding Client
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full hover:bg-white/80 text-[#7D5F04] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-4 space-y-3 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-cinzel uppercase font-bold text-[#7D5F04] mb-1">
                    Partner 1 (Groom / Bride)
                  </label>
                  <input
                    type="text"
                    required
                    value={partner1}
                    onChange={(e) => handlePartnerChange(e.target.value, partner2)}
                    placeholder="e.g. Gourao Verma"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] focus:outline-none focus:border-[#AA820A]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-cinzel uppercase font-bold text-[#7D5F04] mb-1">
                    Partner 2 (Bride / Groom)
                  </label>
                  <input
                    type="text"
                    required
                    value={partner2}
                    onChange={(e) => handlePartnerChange(partner1, e.target.value)}
                    placeholder="e.g. Riya Sen"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] focus:outline-none focus:border-[#AA820A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-[#7D5F04] mb-1">
                  Custom Vanity URL Slug
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 rounded-l-xl bg-[#FAF4E3] border border-r-0 border-[#E8DFC8] text-[#7D5F04] font-mono text-xs">
                    /
                  </span>
                  <input
                    type="text"
                    required
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="rohit-weds-priya"
                    className="w-full px-3 py-2 rounded-r-xl border border-[#E8DFC8] bg-[#FAF8F5] font-mono text-xs focus:outline-none focus:border-[#AA820A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-cinzel uppercase font-bold text-[#7D5F04] mb-1">
                    Celebration Date
                  </label>
                  <input
                    type="date"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] focus:outline-none focus:border-[#AA820A]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-cinzel uppercase font-bold text-[#7D5F04] mb-1">
                    Client WhatsApp Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+919820012345"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] focus:outline-none focus:border-[#AA820A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-[#7D5F04] mb-1">
                  Destination Venue & City
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="The Oberoi Udaivilas"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] focus:outline-none focus:border-[#AA820A]"
                  />
                  <input
                    type="text"
                    required
                    value={venueCity}
                    onChange={(e) => setVenueCity(e.target.value)}
                    placeholder="Udaipur, Rajasthan"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] focus:outline-none focus:border-[#AA820A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-[#7D5F04] mb-1">
                  Default Design Suite
                </label>
                <select
                  value={selectedSuite}
                  onChange={(e) => setSelectedSuite(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] focus:outline-none focus:border-[#AA820A]"
                >
                  {TEMPLATE_LIST.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.badge})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#2C2218] font-cinzel font-black uppercase text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Onboarding Wedding Client...' : 'Generate Project & Client Studio Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
