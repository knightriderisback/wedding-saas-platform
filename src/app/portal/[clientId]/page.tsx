'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { WeddingProject, GuestContact, SongRequest, VoiceBlessing } from '@/types/wedding';
import { getWeddingProject, saveWeddingProject, uploadMediaFile, markWhatsAppSent } from '@/lib/firebase';
import { exportDjPlaylistPdf } from '@/lib/djPdfGenerator';
import { defaultWeddingProject } from '@/lib/mockData';
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
} from 'lucide-react';

export default function ClientPortalPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isShadowAdmin = searchParams.get('shadowAdmin') === 'true';
  const clientId = (params?.clientId as string) || 'client-rohit-priya';

  const [project, setProject] = useState<WeddingProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'guests' | 'dj' | 'blessings' | 'editor' | 'media'>('guests');

  // Contact Picker & Guest Entry State
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');

  // New Song Modal State
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [newSongTitle, setNewSongTitle] = useState('');
  const [newSongArtist, setNewSongArtist] = useState('');
  const [newSongGuest, setNewSongGuest] = useState('');
  const [newSongNotes, setNewSongNotes] = useState('');

  // Audio Playback State for Blessings
  const [playingBlessingId, setPlayingBlessingId] = useState<string | null>(null);

  // Notification Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getWeddingProject(clientId);
      setProject(data || defaultWeddingProject);
      setLoading(false);
    };

    loadData();
  }, [clientId]);

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#7D5F04] flex items-center justify-center font-cinzel text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2 text-[#D4AF37]" />
        Opening Royal Client Studio...
      </div>
    );
  }

  // 1-Click WhatsApp Dispatch
  const handleDispatchWhatsApp = async (guest: GuestContact) => {
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

  // Add from Phone Contacts via Web Contact Picker API
  const handleImportPhoneContacts = async () => {
    try {
      if ('contacts' in navigator && 'select' in (navigator as any).contacts) {
        const props = ['name', 'tel'];
        const opts = { multiple: true };
        const contacts = await (navigator as any).contacts.select(props, opts);

        if (contacts && contacts.length > 0) {
          const importedGuests: GuestContact[] = contacts.map((c: any, idx: number) => ({
            id: `g-${Date.now()}-${idx}`,
            name: (c.name && c.name[0]) || 'Honored Guest',
            phone: (c.tel && c.tel[0]) || '',
            sentWhatsApp: false,
            rsvpStatus: 'pending',
            attendingCount: 0,
          }));

          const updatedProject = {
            ...project,
            guests: [...importedGuests, ...project.guests],
          };
          await saveWeddingProject(updatedProject);
          setProject(updatedProject);
          showToast(`Successfully imported ${importedGuests.length} contacts!`);
        }
      } else {
        setShowAddGuestModal(true);
      }
    } catch {
      setShowAddGuestModal(true);
    }
  };

  // Manual Add Guest
  const handleAddManualGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

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
    setNewGuestName('');
    setNewGuestPhone('');
    setShowAddGuestModal(false);
    showToast(`Added ${newGuest.name} to Guest Hub.`);
  };

  const handleDeleteGuest = async (guestId: string) => {
    const updated = {
      ...project,
      guests: project.guests.filter((g) => g.id !== guestId),
    };
    await saveWeddingProject(updated);
    setProject(updated);
    showToast('Guest record removed.');
  };

  // Export DJ Playlist PDF
  const handleExportDjPdf = () => {
    exportDjPlaylistPdf(project, project.djPlaylist);
    showToast('DJ Playlist PDF generated & downloaded!');
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSongTitle.trim()) return;

    const newSong: SongRequest = {
      id: `song-${Date.now()}`,
      songTitle: newSongTitle.trim(),
      artist: newSongArtist.trim() || 'Bollywood Favorite',
      requestedByGuest: newSongGuest.trim() || 'Couple’s Choice',
      guestPhone: '',
      timestamp: 'Added by Client',
      notes: newSongNotes.trim(),
    };

    const updated = {
      ...project,
      djPlaylist: [newSong, ...project.djPlaylist],
    };
    await saveWeddingProject(updated);
    setProject(updated);
    setNewSongTitle('');
    setNewSongArtist('');
    setNewSongGuest('');
    setNewSongNotes('');
    setShowAddSongModal(false);
    showToast('Song added to setlist.');
  };

  const handleDeleteSong = async (songId: string) => {
    const updated = {
      ...project,
      djPlaylist: project.djPlaylist.filter((s) => s.id !== songId),
    };
    await saveWeddingProject(updated);
    setProject(updated);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'audio') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storagePath = `weddings/${project.slug}/${type}_${Date.now()}_${file.name}`;
    const url = await uploadMediaFile(file, storagePath);

    const updated = {
      ...project,
      [type === 'cover' ? 'coverImageUrl' : 'backgroundAudioUrl']: url,
    };
    await saveWeddingProject(updated);
    setProject(updated);
    showToast(`${type === 'cover' ? 'Cover visual' : 'Audio track'} uploaded successfully!`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2218] pb-24">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#FAF4E3] border border-[#D4AF37] text-[#7D5F04] px-5 py-2.5 rounded-2xl text-xs font-cinzel shadow-xl animate-fade-in flex items-center gap-2 font-bold">
          <Sparkles className="w-4 h-4 text-[#AA820A]" />
          {toastMsg}
        </div>
      )}

      {/* Top Royal Atelier Header */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFC8] px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#AA820A] via-[#D4AF37] to-[#FAF4E3] flex items-center justify-center text-black font-cinzel font-bold text-sm shadow-sm">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel text-base sm:text-lg font-bold text-[#2C2218] tracking-wider">
                {project.partner1} & {project.partner2}
              </h1>
              {isShadowAdmin && (
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#FEF9E7] text-[#AA820A] border border-[#F9CA24] uppercase font-bold">
                  Shadow Access (Admin)
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#7D5F04] font-sans">
              Client Operating Studio • {project.venue.name}
            </p>
          </div>
        </div>

        {/* Live Preview Button */}
        <div className="flex items-center gap-2">
          <Link
            href={`/${project.slug}?guest=Special+Guest`}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs uppercase tracking-wider font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview Microsite</span>
          </Link>
        </div>
      </header>

      {/* Navigation Tabs (Mobile-friendly horizontal scroll) */}
      <div className="border-b border-[#E8DFC8] bg-[#FDFBF7] px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex gap-4 sm:gap-6 overflow-x-auto text-xs font-cinzel uppercase tracking-wider">
          {[
            { id: 'guests', label: 'Guest & Invite Hub', icon: Users, badge: project.guests.length },
            { id: 'dj', label: 'DJ Playlist Manager', icon: Music, badge: project.djPlaylist.length },
            { id: 'blessings', label: 'Blessings Hub', icon: Heart, badge: project.blessings.length },
            { id: 'editor', label: 'Content Editor', icon: Sliders },
            { id: 'media', label: 'Media Uploader', icon: Upload },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-all font-semibold ${
                  isActive
                    ? 'border-[#D4AF37] text-[#AA820A] font-bold'
                    : 'border-transparent text-[#7D5F04]/70 hover:text-[#2C2218]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#AA820A]' : 'text-neutral-400'}`} />
                {tab.label}
                {tab.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono ${
                      isActive ? 'bg-[#D4AF37] text-black font-bold' : 'bg-[#E8DFC8] text-[#544230]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* ==================== TAB 1: GUEST & INVITE HUB ==================== */}
        {activeTab === 'guests' && (
          <div className="space-y-6 animate-fade-in">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FDFBF7] paper-deckle rounded-2xl p-6 shadow-sm">
              <div>
                <h3 className="font-cinzel text-base uppercase tracking-wider text-[#2C2218] font-bold">
                  Guest & Invitation WhatsApp Hub
                </h3>
                <p className="text-xs text-[#544230] font-sans mt-0.5">
                  Import contacts directly from mobile, dispatch personalized WhatsApp invites, and track attendance.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Contact Picker Button */}
                <button
                  onClick={handleImportPhoneContacts}
                  className="px-4 py-2 rounded-xl bg-[#FAF4E3] border border-[#D4AF37]/50 text-[#7D5F04] hover:bg-[#F3E5AB] text-xs font-cinzel tracking-wider flex items-center gap-1.5 transition-all shadow-sm font-bold"
                >
                  <Phone className="w-3.5 h-3.5 text-[#AA820A]" />
                  <span>Import Phone Contacts</span>
                </button>

                {/* Add Manual Guest */}
                <button
                  onClick={() => setShowAddGuestModal(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs uppercase tracking-wider font-bold shadow-sm hover:brightness-110 flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Guest
                </button>
              </div>
            </div>

            {/* Guest Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#FDFBF7] paper-deckle rounded-xl p-4 text-center">
                <span className="font-cinzel text-[10px] uppercase text-[#7D5F04] font-bold block">Total Guests</span>
                <span className="font-serif text-3xl font-light text-[#2C2218]">{project.guests.length}</span>
              </div>
              <div className="bg-[#FDFBF7] paper-deckle rounded-xl p-4 text-center">
                <span className="font-cinzel text-[10px] uppercase text-emerald-800 font-bold block">WhatsApp Dispatched</span>
                <span className="font-serif text-3xl font-light text-emerald-700">
                  {project.guests.filter((g) => g.sentWhatsApp).length}
                </span>
              </div>
              <div className="bg-[#FDFBF7] paper-deckle rounded-xl p-4 text-center">
                <span className="font-cinzel text-[10px] uppercase text-[#AA820A] font-bold block">Confirmed Attending</span>
                <span className="font-serif text-3xl font-light text-[#AA820A]">
                  {project.guests.filter((g) => g.rsvpStatus === 'attending').length}
                </span>
              </div>
            </div>

            {/* Guest Cards */}
            <div className="space-y-3">
              {project.guests.map((guest) => (
                <div
                  key={guest.id}
                  className="bg-[#FDFBF7] paper-deckle rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#D4AF37] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FAF4E3] border border-[#D4AF37]/40 text-[#7D5F04] flex items-center justify-center font-bold text-sm">
                      {guest.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-base font-semibold text-[#2C2218]">
                          {guest.name}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-cinzel uppercase font-bold ${
                            guest.rsvpStatus === 'attending'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : guest.rsvpStatus === 'declined'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-[#FAF4E3] text-[#7D5F04] border border-[#D4AF37]/30'
                          }`}
                        >
                          {guest.rsvpStatus}
                          {guest.attendingCount > 0 && ` (${guest.attendingCount} guests)`}
                        </span>
                      </div>
                      <p className="text-xs text-[#544230] font-mono mt-0.5">
                        {guest.phone || 'No phone number registered'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Status Tag */}
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold flex items-center gap-1 ${
                        guest.sentWhatsApp
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-neutral-100 text-neutral-500 border border-neutral-300'
                      }`}
                    >
                      {guest.sentWhatsApp ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Sent via WA
                        </>
                      ) : (
                        'Not Sent'
                      )}
                    </span>

                    {/* 1-Click WhatsApp Dispatch Button */}
                    <button
                      onClick={() => handleDispatchWhatsApp(guest)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#25D366]/15 border border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/25 text-xs font-cinzel font-bold flex items-center gap-1.5 transition-all shadow-sm"
                      title="Open WhatsApp with personalized invite message"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>{guest.sentWhatsApp ? 'Re-send' : '1-Click WA'}</span>
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => handleDeleteGuest(guest.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors"
                      title="Remove guest"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Guest Modal */}
            {showAddGuestModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#FDFBF7] paper-deckle rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
                  <h4 className="font-cinzel text-base uppercase tracking-wider text-[#2C2218] font-bold mb-4">
                    Add Guest to Wedding Hub
                  </h4>
                  <form onSubmit={handleAddManualGuest} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                        Guest or Family Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newGuestName}
                        onChange={(e) => setNewGuestName(e.target.value)}
                        placeholder="e.g. Vikramaditya Roy & Family"
                        className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                        WhatsApp Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={newGuestPhone}
                        onChange={(e) => setNewGuestPhone(e.target.value)}
                        placeholder="+91 98200 12345"
                        className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none font-mono"
                      />
                    </div>

                    <div className="pt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddGuestModal(false)}
                        className="flex-1 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] text-[#544230] font-cinzel text-xs uppercase"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs uppercase font-bold shadow-sm"
                      >
                        Add Guest
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: DJ PLAYLIST MANAGER ==================== */}
        {activeTab === 'dj' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FDFBF7] paper-deckle rounded-2xl p-6 shadow-sm">
              <div>
                <h3 className="font-cinzel text-base uppercase tracking-wider text-[#2C2218] font-bold">
                  Sangeet & Dance Floor DJ Setlist
                </h3>
                <p className="text-xs text-[#544230] font-sans mt-0.5">
                  Guest-requested songs from their digital invitations. Export directly as PDF for your DJ console.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddSongModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF4E3] border border-[#D4AF37]/50 text-[#7D5F04] hover:bg-[#F3E5AB] text-xs font-cinzel tracking-wider font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-[#AA820A]" />
                  <span>Add Track</span>
                </button>

                {/* 1-Click Export DJ Playlist PDF */}
                <button
                  onClick={handleExportDjPdf}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs uppercase tracking-wider font-bold shadow-sm hover:brightness-110 flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-4 h-4" /> Export DJ Playlist PDF
                </button>
              </div>
            </div>

            {/* Song Requests Cards */}
            <div className="space-y-3">
              {project.djPlaylist.map((song, idx) => (
                <div
                  key={song.id}
                  className="bg-[#FDFBF7] paper-deckle rounded-xl p-4 shadow-sm flex items-center justify-between gap-4 hover:border-[#D4AF37] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#AA820A] font-bold w-6">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-serif text-base font-semibold text-[#2C2218]">
                        {song.songTitle}
                      </h4>
                      <p className="text-xs text-[#544230] italic font-sans">
                        Artist: {song.artist || 'Bollywood Sangeet Favorite'}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-[#7D5F04] mt-1 font-semibold">
                        <span>Requested by: <strong>{song.requestedByGuest}</strong></span>
                        {song.guestPhone && <span>({song.guestPhone})</span>}
                        {song.notes && <span className="text-[#9B1C2E]">"{song.notes}"</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSong(song.id)}
                    className="p-2 text-neutral-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Song Modal */}
            {showAddSongModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#FDFBF7] paper-deckle rounded-2xl max-w-md w-full p-6 shadow-2xl">
                  <h4 className="font-cinzel text-base uppercase tracking-wider text-[#2C2218] font-bold mb-4">
                    Add Track to DJ Setlist
                  </h4>
                  <form onSubmit={handleAddSong} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                        Track Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newSongTitle}
                        onChange={(e) => setNewSongTitle(e.target.value)}
                        placeholder="e.g. Gallan Goodiyaan"
                        className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                        Artist / Movie
                      </label>
                      <input
                        type="text"
                        value={newSongArtist}
                        onChange={(e) => setNewSongArtist(e.target.value)}
                        placeholder="e.g. Dil Dhadakne Do"
                        className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                        Requested By
                      </label>
                      <input
                        type="text"
                        value={newSongGuest}
                        onChange={(e) => setNewSongGuest(e.target.value)}
                        placeholder="e.g. Groom's Squad"
                        className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                        Special Instructions for DJ
                      </label>
                      <input
                        type="text"
                        value={newSongNotes}
                        onChange={(e) => setNewSongNotes(e.target.value)}
                        placeholder="e.g. Play during family entry"
                        className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none"
                      />
                    </div>

                    <div className="pt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddSongModal(false)}
                        className="flex-1 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] text-[#544230] font-cinzel text-xs uppercase"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs uppercase font-bold"
                      >
                        Add Track
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 3: BLESSINGS HUB ==================== */}
        {activeTab === 'blessings' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#FDFBF7] paper-deckle rounded-2xl p-6 shadow-sm">
              <h3 className="font-cinzel text-base uppercase tracking-wider text-[#2C2218] font-bold">
                Aashirwad Voice Ledger ({project.blessings.length})
              </h3>
              <p className="text-xs text-[#544230] font-sans mt-0.5">
                Spoken blessings recorded directly by guests from across the world.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.blessings.map((blessing) => {
                const isPlaying = playingBlessingId === blessing.id;
                return (
                  <div
                    key={blessing.id}
                    className="bg-[#FDFBF7] paper-deckle rounded-xl p-5 shadow-sm flex items-center justify-between gap-4 border border-[#E8DFC8]"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-3.5 h-3.5 text-[#9B1C2E] fill-[#9B1C2E]" />
                        <h4 className="font-serif text-base font-semibold text-[#2C2218]">
                          {blessing.guestName}
                        </h4>
                      </div>
                      <span className="text-[10px] text-[#7D5F04] font-mono block font-semibold">
                        Duration: {blessing.durationSec}s • {blessing.timestamp}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (isPlaying) {
                          setPlayingBlessingId(null);
                        } else {
                          setPlayingBlessingId(blessing.id);
                          setTimeout(() => setPlayingBlessingId(null), (blessing.durationSec || 5) * 1000);
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-[#FAF4E3] border border-[#D4AF37] text-[#7D5F04] hover:bg-[#F3E5AB] transition-transform flex items-center justify-center shrink-0 shadow-sm"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: CONTENT EDITOR ==================== */}
        {activeTab === 'editor' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#FDFBF7] paper-deckle rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-cinzel text-base uppercase tracking-wider text-[#2C2218] font-bold border-b border-[#E8DFC8] pb-3">
                Wedding Celebration & Destination Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                    Partner 1 (Groom / Bride)
                  </label>
                  <input
                    type="text"
                    value={project.partner1}
                    onChange={(e) => setProject({ ...project, partner1: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                    Partner 2 (Bride / Groom)
                  </label>
                  <input
                    type="text"
                    value={project.partner2}
                    onChange={(e) => setProject({ ...project, partner2: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                    Destination Palace / Resort
                  </label>
                  <input
                    type="text"
                    value={project.venue.name}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        venue: { ...project.venue, name: e.target.value },
                      })
                    }
                    className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                    City, State
                  </label>
                  <input
                    type="text"
                    value={project.venue.city}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        venue: { ...project.venue, city: e.target.value },
                      })
                    }
                    className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={async () => {
                    await saveWeddingProject(project);
                    showToast('Celebration details saved successfully!');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs uppercase font-bold shadow hover:brightness-110"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: MEDIA UPLOADER ==================== */}
        {activeTab === 'media' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#FDFBF7] paper-deckle rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-cinzel text-base uppercase tracking-wider text-[#2C2218] font-bold border-b border-[#E8DFC8] pb-3">
                Firebase Cloud Media Storage
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Cover visual upload */}
                <div className="bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl p-5 text-center space-y-3">
                  <Camera className="w-8 h-8 text-[#AA820A] mx-auto" />
                  <h4 className="font-cinzel text-xs uppercase tracking-wider text-[#2C2218] font-semibold">
                    Cover Visual (Palace / Couple Photo)
                  </h4>
                  {project.coverImageUrl && (
                    <img
                      src={project.coverImageUrl}
                      alt="Cover"
                      className="w-full h-36 object-cover rounded-lg border border-[#D4AF37]/30"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'cover')}
                    className="block w-full text-xs text-[#544230] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-cinzel file:bg-[#D4AF37] file:text-black hover:file:brightness-110 cursor-pointer"
                  />
                </div>

                {/* Background Sitar/Flute Track */}
                <div className="bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl p-5 text-center space-y-3">
                  <Music className="w-8 h-8 text-[#AA820A] mx-auto" />
                  <h4 className="font-cinzel text-xs uppercase tracking-wider text-[#2C2218] font-semibold">
                    Background Audio Soundtrack
                  </h4>
                  <p className="text-xs text-[#544230] font-sans">
                    Default: Procedural Raga Yaman Sitar & Bansuri Flute Synth.
                  </p>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileUpload(e, 'audio')}
                    className="block w-full text-xs text-[#544230] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-cinzel file:bg-[#D4AF37] file:text-black hover:file:brightness-110 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
