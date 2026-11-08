'use client';

import React, { useState, useRef } from 'react';
import { VoiceBlessing } from '@/types/wedding';
import { uploadMediaFile, addVoiceBlessing } from '@/lib/firebase';
import confetti from 'canvas-confetti';
import { Mic, Square, Play, Pause, Send, Check } from 'lucide-react';

interface VoiceBlessingRecorderProps {
  weddingSlug: string;
  defaultGuestName?: string;
}

export const VoiceBlessingRecorder: React.FC<VoiceBlessingRecorderProps> = ({
  weddingSlug,
  defaultGuestName = '',
}) => {
  const [guestName, setGuestName] = useState(defaultGuestName);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
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
      alert('Microphone access is required to record your voice blessing.');
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
    if (!audioBlob) return;
    setIsUploading(true);

    try {
      const storagePath = `weddings/${weddingSlug}/blessings/blessing_${Date.now()}.webm`;
      const uploadedUrl = await uploadMediaFile(audioBlob, storagePath);

      const blessing: VoiceBlessing = {
        id: `bless-${Date.now()}`,
        guestName: guestName.trim() || 'Loving Family Member',
        audioBlobUrl: uploadedUrl,
        durationSec: recordSeconds,
        timestamp: 'Just now',
      };

      await addVoiceBlessing(weddingSlug, blessing);

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
      }, 4000);
    } catch {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-[#FDFBF7] paper-deckle rounded-2xl p-6 sm:p-8 shadow-[0_15px_45px_rgba(180,140,70,0.14)]">
      <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3 mb-4">
        <span className="font-cinzel text-[10px] tracking-widest uppercase text-[#AA820A] font-bold flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-[#D4AF37]" />
          Aashirwad Voice Recorder
        </span>
        <span className="text-[10px] text-[#7D5F04] font-mono">
          Vedic Spoken Vows
        </span>
      </div>

      <p className="font-cormorant italic text-sm text-[#544230] mb-4">
        Leave a personal spoken voice message or Sanskrit mantra for Rohit & Priya’s forever wedding keepsake.
      </p>

      {isSuccess ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-400 text-center space-y-1 animate-fade-in">
          <Check className="w-6 h-6 text-emerald-600 mx-auto" />
          <h5 className="font-serif text-base text-emerald-950 font-semibold">
            Voice Blessing Preserved!
          </h5>
          <p className="text-xs text-emerald-800">
            Your heartfelt words have been placed in the couple's royal memory vault.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-cinzel uppercase text-[#7D5F04] font-semibold mb-1">
              Your Name *
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Dadi Shanti Sharma / Chacha Ji"
              className="w-full bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl py-2 px-3 text-xs text-[#2C2218] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Recording UI */}
          <div className="bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl p-6 text-center flex flex-col items-center justify-center space-y-3">
            {!audioUrl ? (
              <>
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-[#9B1C2E] text-white animate-pulse shadow-[0_0_20px_rgba(155,28,46,0.6)]'
                      : 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black hover:brightness-110 shadow-[0_5px_20px_rgba(212,175,55,0.4)]'
                  }`}
                >
                  {isRecording ? <Square className="w-6 h-6 text-white" /> : <Mic className="w-7 h-7 text-black" />}
                </button>

                <div className="text-xs font-mono text-[#544230]">
                  {isRecording ? (
                    <span className="text-[#9B1C2E] font-bold flex items-center gap-1.5 justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#9B1C2E] animate-ping" />
                      Recording... {recordSeconds}s (Tap square to stop)
                    </span>
                  ) : (
                    'Tap microphone to speak your warm blessings'
                  )}
                </div>
              </>
            ) : (
              /* Review Recorded Audio */
              <div className="w-full space-y-3">
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
                    className="w-12 h-12 rounded-full bg-[#FAF4E3] border border-[#D4AF37] text-[#7D5F04] flex items-center justify-center hover:bg-[#F3E5AB] transition-all shadow"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <div className="text-left text-xs font-mono text-[#2C2218]">
                    <p className="font-semibold">Voice Blessing Recorded</p>
                    <p className="text-[#7D5F04]">{recordSeconds} seconds duration</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAudioBlob(null);
                      setAudioUrl(null);
                      setRecordSeconds(0);
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] text-[#544230] font-cinzel text-xs uppercase"
                  >
                    Re-Record
                  </button>
                  <button
                    type="button"
                    onClick={handleUploadBlessing}
                    disabled={isUploading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs uppercase font-bold shadow hover:brightness-110 flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isUploading ? 'Preserving...' : 'Send Blessing'}
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
