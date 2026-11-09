'use client';

import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, Send, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { addVoiceBlessing } from '@/lib/firebase';
import { INVITATION_TRANSLATIONS, InvitationLanguage } from '@/lib/invitationI18n';

interface VoiceBlessingRecorderProps {
  weddingSlug: string;
  defaultGuestName?: string;
  language?: InvitationLanguage;
}

export const VoiceBlessingRecorder: React.FC<VoiceBlessingRecorderProps> = ({
  weddingSlug,
  defaultGuestName = '',
  language = 'en',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [guestName, setGuestName] = useState(defaultGuestName);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const t = INVITATION_TRANSLATIONS[language];

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      alert(language === 'en' ? 'Microphone access is required to record your voice blessing.' : 'कृपया मंगल आशीर्वाद रिकॉर्ड करने के लिए माइक्रोफोन की अनुमति दें।');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleUploadBlessing = async () => {
    if (!audioBlob && !audioUrl) return;
    setIsUploading(true);

    try {
      await addVoiceBlessing(weddingSlug, {
        id: `v-${Date.now()}`,
        guestName: guestName.trim() || (language === 'en' ? 'Honored Elder & Family' : 'आदरणीय परिजन'),
        audioBlobUrl: audioUrl || '',
        durationSec: recordSeconds,
        timestamp: 'Just now',
      });

      setIsUploading(false);
      setIsSuccess(true);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#FAF4E3', '#9B1C2E', '#F39C12'],
      });

      setTimeout(() => {
        setIsSuccess(false);
        setAudioBlob(null);
        setAudioUrl(null);
        setRecordSeconds(0);
      }, 5000);
    } catch {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto border border-[#D4AF37]/60 bg-transparent p-6 sm:p-8 relative">
      {/* Traditional Indian Corner Filigrees */}
      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />
      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]" />

      {/* Header Line on Paper */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3 mb-4">
        <span className="font-cinzel text-xs tracking-widest uppercase text-[#7A1423] font-bold flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-[#AA820A]" />
          {t.voiceBadge}
        </span>
        <span className="text-xs text-[#7D5F04] font-serif italic">
          {language === 'en' ? 'Vedic Spoken Vows' : 'वाणी आशीर्वाद'}
        </span>
      </div>

      <p className="font-cormorant italic text-base text-[#3D2817] leading-relaxed mb-6">
        {t.voiceDescription}
      </p>

      {isSuccess ? (
        <div className="p-4 border border-emerald-600/40 text-center space-y-1 animate-fade-in bg-emerald-50/40">
          <Check className="w-6 h-6 text-emerald-700 mx-auto" />
          <h5 className="font-serif text-lg text-emerald-950 font-bold">
            {t.voiceSuccessTitle}
          </h5>
          <p className="text-xs text-emerald-900 font-cormorant italic">
            {t.voiceSuccessText}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-serif uppercase tracking-wider text-[#7A1423] font-bold mb-1">
              {language === 'en' ? 'Your Name & Family Designation *' : 'आपका शुभ नाम एवं परिचय *'}
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder={t.voiceNamePlaceholder}
              className="w-full bg-transparent border-0 border-b-2 border-[#D4AF37]/50 focus:border-[#7A1423] py-2 px-1 text-sm text-[#2C1810] font-serif placeholder:text-[#8C7A68] focus:outline-none transition-colors"
            />
          </div>

          {/* Recording UI Frame on Paper */}
          <div className="border border-[#D4AF37]/40 p-6 text-center flex flex-col items-center justify-center space-y-4">
            {!audioUrl ? (
              <>
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-[#9B1C2E] text-white animate-pulse shadow-md border-2 border-[#D4AF37]'
                      : 'bg-[#7A1423] text-white hover:brightness-110 border-2 border-[#D4AF37]'
                  }`}
                >
                  {isRecording ? <Square className="w-6 h-6 text-white" /> : <Mic className="w-7 h-7 text-[#F3E5AB]" />}
                </button>

                <div className="text-xs font-serif italic text-[#543F02]">
                  {isRecording ? (
                    <span className="text-[#9B1C2E] font-bold flex items-center gap-1.5 justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#9B1C2E] animate-ping" />
                      {language === 'en' ? `Recording... ${recordSeconds}s (Tap square to stop)` : `रिकॉर्डिंग जारी... ${recordSeconds} सेकंड (रोकने हेतु वर्ग छुएं)`}
                    </span>
                  ) : (
                    t.voiceInstructions
                  )}
                </div>
              </>
            ) : (
              /* Review Recorded Audio */
              <div className="w-full space-y-4">
                <audio
                  ref={audioPlayerRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="w-12 h-12 rounded-full border border-[#D4AF37] text-[#7A1423] flex items-center justify-center hover:bg-[#FAF4E3] transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <div className="text-left text-xs font-serif text-[#2C1810]">
                    <p className="font-bold">{language === 'en' ? 'Voice Blessing Recorded' : 'मंगल आशीर्वाद रिकॉर्ड हो गया'}</p>
                    <p className="text-[#7D5F04] font-cormorant italic">{recordSeconds} {language === 'en' ? 'seconds duration' : 'सेकंड अवधि'}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAudioBlob(null);
                      setAudioUrl(null);
                      setRecordSeconds(0);
                    }}
                    className="flex-1 py-2.5 rounded-full border border-[#D4AF37]/60 text-[#543F02] font-serif text-xs uppercase tracking-wider hover:bg-[#FAF4E3] transition-all cursor-pointer"
                  >
                    {t.voiceReRecord}
                  </button>
                  <button
                    type="button"
                    onClick={handleUploadBlessing}
                    disabled={isUploading}
                    className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#9B1C2E] to-[#7A1423] text-white font-serif text-xs uppercase font-bold tracking-wider hover:brightness-110 flex items-center justify-center gap-1.5 border border-[#D4AF37] cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isUploading ? t.voiceSubmittingButton : t.voiceSubmitButton}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
