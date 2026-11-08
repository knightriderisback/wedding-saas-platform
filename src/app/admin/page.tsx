'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WeddingProject } from '@/types/wedding';
import { getAllProjects, saveWeddingProject } from '@/lib/firebase';
import { defaultWeddingProject } from '@/lib/mockData';
import {
  Shield,
  Crown,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Users,
  Search,
  KeyRound,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export default function SuperAdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<WeddingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [weddingDate, setWeddingDate] = useState('2027-11-20');
  const [venueName, setVenueName] = useState('The Oberoi Udaivilas');
  const [venueCity, setVenueCity] = useState('Udaipur, Rajasthan');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    const data = await getAllProjects();
    setProjects(data);
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
      guests: [],
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

  const handleCopyClientLink = (project: WeddingProject) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const portalUrl = `${origin}/portal/${project.id}`;
    navigator.clipboard.writeText(portalUrl);
    setCopiedId(project.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleLoginAsClient = (projectId: string) => {
    router.push(`/portal/${projectId}?shadowAdmin=true`);
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.partner1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.partner2.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2218] p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFC8] pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#AA820A] via-[#D4AF37] to-[#FAF4E3] flex items-center justify-center text-black font-cinzel font-bold shadow-sm">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel text-lg sm:text-xl font-bold text-[#2C2218] uppercase tracking-wider">
                Super-Admin Control Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#FAF4E3] text-[#7D5F04] border border-[#D4AF37]/50 font-bold">
                DEVELOPER AGENCY CORE
              </span>
            </div>
            <p className="text-xs text-[#544230] font-sans mt-0.5">
              Client Onboarding • Custom Slugs • Shadow Access (Impersonation Engine)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProjects}
            className="p-2.5 rounded-xl bg-[#FAF4E3] border border-[#D4AF37]/40 text-[#7D5F04] hover:bg-[#F3E5AB] transition-all text-xs shadow-sm"
            title="Refresh Registry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs uppercase tracking-wider font-bold shadow hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Onboard New Wedding
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#FDFBF7] paper-deckle rounded-2xl p-5 shadow-sm">
            <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#7D5F04] font-bold block">
              Total Client Projects
            </span>
            <p className="font-serif text-3xl font-light text-[#2C2218] mt-1">
              {projects.length}
            </p>
            <span className="text-[10px] text-emerald-800 font-sans mt-1 block font-semibold">
              ✓ 100% Cloud Synced
            </span>
          </div>

          <div className="bg-[#FDFBF7] paper-deckle rounded-2xl p-5 shadow-sm">
            <span className="font-cinzel text-[10px] uppercase tracking-wider text-emerald-800 font-bold block">
              Active Microsites
            </span>
            <p className="font-serif text-3xl font-light text-emerald-700 mt-1">
              {projects.filter((p) => p.status === 'active').length}
            </p>
            <span className="text-[10px] text-[#544230] font-sans mt-1 block">
              Serving live invitations
            </span>
          </div>

          <div className="bg-[#FDFBF7] paper-deckle rounded-2xl p-5 shadow-sm">
            <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#AA820A] font-bold block">
              Total Managed Guests
            </span>
            <p className="font-serif text-3xl font-light text-[#2C2218] mt-1">
              {projects.reduce((acc, p) => acc + (p.guests?.length || 0), 0)}
            </p>
            <span className="text-[10px] text-[#544230] font-sans mt-1 block">
              Across all wedding lists
            </span>
          </div>

          <div className="bg-[#FDFBF7] paper-deckle rounded-2xl p-5 shadow-sm">
            <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#9B1C2E] font-bold block">
              DJ Requests & Blessings
            </span>
            <p className="font-serif text-3xl font-light text-[#9B1C2E] mt-1">
              {projects.reduce((acc, p) => acc + (p.djPlaylist?.length || 0) + (p.blessings?.length || 0), 0)}
            </p>
            <span className="text-[10px] text-[#544230] font-sans mt-1 block">
              Live guest submissions
            </span>
          </div>
        </div>

        {/* Search Bar & Project List */}
        <div className="bg-[#FDFBF7] paper-deckle rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-cinzel text-base uppercase tracking-wider text-[#2C2218] font-bold">
                Client Weddings & Shadow Access Registry
              </h2>
              <p className="text-xs text-[#544230] font-sans mt-0.5">
                Use "Login As Client" to seamlessly impersonate and manage any client's portal.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#AA820A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by couple, slug, or ID..."
                className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 pl-9 pr-3 text-xs text-[#2C2218] placeholder:text-neutral-400 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Projects Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#FAF4E3]/60 text-[#7D5F04] font-cinzel uppercase text-[10px] tracking-wider border-b border-[#E8DFC8]">
                <tr>
                  <th className="py-3.5 px-4">Wedding Couple</th>
                  <th className="py-3.5 px-4">Custom Slug</th>
                  <th className="py-3.5 px-4">Date & Destination</th>
                  <th className="py-3.5 px-4">Guests & DJ Tracks</th>
                  <th className="py-3.5 px-4">Client Access Link</th>
                  <th className="py-3.5 px-4 text-right">Impersonate (Shadow Access)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFC8]">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-[#FAF4E3]/30 transition-colors">
                    {/* Couple */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#FAF4E3] border border-[#D4AF37]/50 text-[#7D5F04] flex items-center justify-center font-bold text-xs">
                          {project.partner1[0]}&{project.partner2[0]}
                        </div>
                        <div>
                          <span className="font-serif text-sm font-semibold text-[#2C2218] block">
                            {project.partner1} & {project.partner2}
                          </span>
                          <span className="text-[10px] text-[#7D5F04] font-mono">
                            ID: {project.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Custom Slug */}
                    <td className="py-4 px-4">
                      <Link
                        href={`/${project.slug}?guest=Special+Guest`}
                        target="_blank"
                        className="inline-flex items-center gap-1 font-mono text-xs text-[#7D5F04] hover:text-[#2C2218] underline font-semibold"
                      >
                        /{project.slug} <ExternalLink className="w-3 h-3 text-[#AA820A]" />
                      </Link>
                    </td>

                    {/* Date & Destination */}
                    <td className="py-4 px-4">
                      <span className="text-[#2C2218] block font-medium">
                        {new Date(project.weddingDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-[10px] text-[#544230] block truncate max-w-[180px]">
                        {project.venue.name}, {project.venue.city}
                      </span>
                    </td>

                    {/* Stats */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[#2C2218]">
                          <strong>{project.guests?.length || 0}</strong> guests
                        </span>
                        <span className="text-neutral-300">•</span>
                        <span className="text-[#7D5F04]">
                          <strong>{project.djPlaylist?.length || 0}</strong> songs
                        </span>
                      </div>
                    </td>

                    {/* Client Access Link */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyClientLink(project)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#FAF4E3] border border-[#D4AF37]/40 text-[#7D5F04] hover:bg-[#F3E5AB] text-[11px] font-mono font-bold flex items-center gap-1 transition-all"
                          title="Copy client access URL"
                        >
                          {copiedId === project.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy Link
                            </>
                          )}
                        </button>
                        <span className="font-mono text-[10px] text-[#544230]">
                          PIN: {project.clientAccessToken}
                        </span>
                      </div>
                    </td>

                    {/* Shadow Access Button */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleLoginAsClient(project.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs uppercase tracking-wider font-bold shadow-sm hover:brightness-110 transition-all inline-flex items-center gap-1.5"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-black" />
                        <span>Login As Client</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Onboard New Wedding Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] paper-deckle rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 border-b border-[#E8DFC8] pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#AA820A]" />
                <h3 className="font-cinzel text-base uppercase tracking-wider text-[#2C2218] font-bold">
                  Onboard New Wedding Project
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                    Partner 1 (Groom / Bride) *
                  </label>
                  <input
                    type="text"
                    required
                    value={partner1}
                    onChange={(e) => handlePartnerChange(e.target.value, partner2)}
                    placeholder="e.g. Rohit Sharma"
                    className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                    Partner 2 (Bride / Groom) *
                  </label>
                  <input
                    type="text"
                    required
                    value={partner2}
                    onChange={(e) => handlePartnerChange(partner1, e.target.value)}
                    placeholder="e.g. Priya Mehra"
                    className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                  Custom Wedding URL Slug *
                </label>
                <div className="flex items-center bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl px-3 py-2 text-xs">
                  <span className="text-[#7D5F04] font-mono">domain.luxury/</span>
                  <input
                    type="text"
                    required
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="rohit-weds-priya"
                    className="bg-transparent text-[#2C2218] font-mono focus:outline-none flex-1 ml-1 font-bold"
                  />
                </div>
                <span className="text-[10px] text-[#544230] font-sans mt-0.5 block">
                  Example: <strong>rohit-weds-priya</strong> yields guest link: <code>/[slug]?guest=GuestName</code>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                    Wedding Date
                  </label>
                  <input
                    type="date"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                    Destination City
                  </label>
                  <input
                    type="text"
                    value={venueCity}
                    onChange={(e) => setVenueCity(e.target.value)}
                    placeholder="Udaipur, Rajasthan"
                    className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
                  Palace / Venue Name
                </label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="The Oberoi Udaivilas"
                  className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-[#2C2218] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] text-[#544230] font-cinzel text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs uppercase font-bold shadow-md hover:brightness-110 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Onboarding...' : 'Launch Wedding Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
