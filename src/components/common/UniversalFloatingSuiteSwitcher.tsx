'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TEMPLATE_LIST } from '@/lib/pressedLoveTemplates';
import { SUITE_CATEGORY_METAS } from '@/lib/suiteCategoryMetas';
import { Palette, Check, X, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UniversalFloatingSuiteSwitcherProps {
  activeTemplate: string;
  onSwitchTemplate?: (templateId: string) => void;
  currentSlug?: string;
}

export const UniversalFloatingSuiteSwitcher: React.FC<UniversalFloatingSuiteSwitcherProps> = ({
  activeTemplate,
  onSwitchTemplate,
  currentSlug = 'gourav-weds-priya',
}) => {
  const [showSwitcher, setShowSwitcher] = useState(false);
  const router = useRouter();

  const handleSelect = (templateId: string) => {
    setShowSwitcher(false);
    if (onSwitchTemplate) {
      onSwitchTemplate(templateId);
    } else {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (currentSlug && !currentSlug.startsWith('wedding-invitation-')) {
          url.pathname = `/${currentSlug}`;
          url.searchParams.set('template', templateId);
        } else {
          url.pathname = `/wedding-invitation-${templateId}`;
          url.searchParams.set('template', templateId);
        }
        router.push(url.pathname + url.search);
      } else {
        router.push(`/${currentSlug}?template=${templateId}`);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {showSwitcher && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="w-80 max-h-[75vh] overflow-y-auto bg-[#FAF8F5]/95 backdrop-blur-md border border-[#DFC07C] shadow-[0_15px_40px_rgba(0,0,0,0.3)] rounded-2xl p-3 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#DFC07C]/40">
              <div className="flex items-center gap-1.5 font-['Cinzel',serif] font-bold text-[#273822] text-[11px] uppercase tracking-wider">
                <Palette className="w-4 h-4 text-[#B59A57]" />
                <span>Choose Design Suite ({TEMPLATE_LIST.length})</span>
              </div>
              <button
                onClick={() => setShowSwitcher(false)}
                className="p-1 rounded-full hover:bg-black/5 text-[#273822]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              {TEMPLATE_LIST.map((tmpl) => {
                const isActive = activeTemplate === tmpl.id;
                const meta = SUITE_CATEGORY_METAS[tmpl.id];
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => handleSelect(tmpl.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#273822] text-[#FAF8F5] border-[#273822] shadow-sm'
                        : 'bg-white/80 hover:bg-[#DFC07C]/20 border-[#DFC07C]/50 text-[#273822]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span>{meta?.icon || '📜'}</span>
                        <span className="font-['Cinzel',serif] font-bold text-xs truncate">
                          {tmpl.name}
                        </span>
                      </div>
                      <p className={`text-[10px] truncate ${isActive ? 'text-[#FAF8F5]/80' : 'text-[#7D5F04]'}`}>
                        {tmpl.badge}
                      </p>
                    </div>
                    {isActive ? (
                      <Check className="w-4 h-4 text-[#DFC07C] shrink-0" />
                    ) : (
                      <span className="text-[10px] font-['Cinzel',serif] uppercase text-[#B59A57] font-bold shrink-0">
                        Apply
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setShowSwitcher(!showSwitcher)}
        className="px-3.5 py-2 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md border border-[#DFC07C] shadow-[0_6px_20px_rgba(0,0,0,0.25)] flex items-center gap-2 text-[#273822] hover:bg-[#FAF8F5] active:scale-95 transition-all cursor-pointer font-bold font-['Cinzel',serif] text-xs uppercase tracking-wider"
        title="Switch Template Suite"
      >
        <Palette className="w-4 h-4 text-[#B59A57]" />
        <span>Suites ({TEMPLATE_LIST.length})</span>
        <ChevronUp className={`w-3.5 h-3.5 text-[#B59A57] transition-transform ${showSwitcher ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
