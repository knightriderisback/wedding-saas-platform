'use client';

import React from 'react';
import Link from 'next/link';
import { TEMPLATE_LIST } from '@/lib/pressedLoveTemplates';
import { Sparkles, ArrowRight, Eye, Smartphone, Crown, Shield } from 'lucide-react';

export default function TemplatesCatalogPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2218] flex flex-col justify-between selection:bg-[#D4AF37]/30">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 border-b border-[#E8DFC8] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#AA820A] via-[#D4AF37] to-[#FAF4E3] flex items-center justify-center text-black font-cinzel font-bold text-base shadow-sm">
            É
          </div>
          <div>
            <h1 className="font-cinzel text-lg sm:text-xl font-bold text-[#2C2218] tracking-widest">
              ÉTERNITÉ
            </h1>
            <p className="text-[11px] font-cormorant italic text-[#7D5F04]">
              Haute Couture Wedding Invitation Suites & Designs
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/portal/client-rohit-priya"
            className="px-4 py-2 rounded-xl bg-white border border-[#E8DFC8] text-[#544230] text-xs font-cinzel uppercase tracking-wider font-semibold hover:border-[#AA820A] transition-all shadow-sm"
          >
            Client Portal
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black text-xs font-cinzel uppercase tracking-wider font-bold shadow hover:brightness-110 transition-all"
          >
            Super-Admin
          </Link>
        </div>
      </header>

      {/* Main Showcase */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF4E3] border border-[#D4AF37]/50 text-[#7D5F04] text-xs font-cinzel tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#AA820A]" />
            <span>Pressed Love & Haute Couture Design Collection</span>
            <Sparkles className="w-3.5 h-3.5 text-[#AA820A]" />
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl text-[#2C2218] font-medium leading-tight">
            Curated Wedding Invitation <br />
            <span className="font-pinyon text-5xl sm:text-7xl text-[#AA820A] block my-1">
              Microsite Architecture
            </span>
          </h2>

          <p className="font-cormorant italic text-lg sm:text-xl text-[#544230] leading-relaxed">
            Every template is engineered with wax seal unboxing, background audio, live countdown, architectural venue paintings, day itinerary, gift registry with 1-click IBAN copy, and instant VIP QR entry passes.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATE_LIST.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E8DFC8] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.18)] transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Venue / Hero Visual */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF8F5] border-b border-[#E8DFC8]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={template.assets.venueImage}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#2C2218] border border-[#E8DFC8] shadow-sm">
                      {template.badge}
                    </span>
                  </div>

                  {/* Wax Seal Monogram */}
                  <div
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-cinzel text-xs font-bold"
                    style={{ backgroundColor: template.envelope.waxColor }}
                  >
                    {template.envelope.waxMonogram}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-medium text-[#2C2218]">
                      {template.name}
                    </h3>
                    <span className="text-xs font-cinzel text-[#AA820A] font-bold">
                      {template.couple.initials}
                    </span>
                  </div>

                  <p className="text-xs text-[#544230] font-sans leading-relaxed">
                    {template.tagline}
                  </p>

                  <div className="pt-2 text-[11px] font-serif text-[#7D5F04] flex items-center gap-1">
                    <span>{template.location.venueName}</span>
                    <span>•</span>
                    <span>{template.location.city}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 pt-0 border-t border-[#FAF8F5] flex items-center justify-between gap-3">
                <Link
                  href={`/${template.slug}#live`}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs uppercase tracking-wider font-bold shadow text-center hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> Open #Live
                </Link>

                <Link
                  href={`/rohit-weds-priya?template=${template.id}#live`}
                  className="px-3 py-2.5 rounded-xl border border-[#E8DFC8] text-[#544230] hover:text-[#2C2218] hover:border-[#AA820A] text-xs font-cinzel uppercase tracking-wider font-semibold transition-all"
                  title="Preview with couple data"
                >
                  Demo
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-8 border-t border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7D5F04]">
        <p className="font-serif">
          ÉTERNITÉ Wedding Platform • Bespoke Digital Invitation & Client Operating System
        </p>
        <span className="font-mono text-[#AA820A] font-bold mt-2 sm:mt-0">
          Udaipur • London • Mallorca • Como • Berlin • Rome
        </span>
      </footer>
    </div>
  );
}
