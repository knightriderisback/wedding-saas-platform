/**
 * Royal Sitar & Bansuri Flute Synthesizer & Unified Wedding Audio Manager
 * Employs Web Audio API to create authentic sitar resonance, sympathetic strings, and bansuri harmonics.
 * Provides unified master control to ensure no rogue audio plays in the background when muted.
 */

class RoyalSitarFluteEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private loopTimer: number | null = null;
  private masterGain: GainNode | null = null;
  private volume = 0.45;
  private htmlAudioEl: HTMLAudioElement | null = null;

  private init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public registerHtmlAudio(el: HTMLAudioElement | null) {
    this.htmlAudioEl = el;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.htmlAudioEl) {
      this.htmlAudioEl.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public isMusicPlaying(): boolean {
    return this.isPlaying || Boolean(this.htmlAudioEl && !this.htmlAudioEl.paused);
  }

  /**
   * Synthesize a plucked Sitar stroke (Jawari buzzing timbre with microtonal meend glide)
   */
  public playSitarNote(freq: number, startTime: number, duration: number = 2.5) {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    try {
      // Carrier oscillator with saw-triangle rich harmonics
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      // Subtle Sitar Meend (glide)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.015, startTime + 0.3);

      // Jawari bridge filter (gives that unmistakable metallic buzz)
      const jawariFilter = this.ctx.createBiquadFilter();
      jawariFilter.type = 'bandpass';
      jawariFilter.frequency.setValueAtTime(freq * 3.5, startTime);
      jawariFilter.Q.setValueAtTime(4.0, startTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(jawariFilter);
      jawariFilter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Ignore if context closed
    }
  }

  /**
   * Synthesize gentle Bansuri (Bamboo Flute) note with breathy vibrato
   */
  public playBansuriNote(freq: number, startTime: number, duration: number = 3.0) {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    try {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Vibrato LFO
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.frequency.setValueAtTime(5.2, startTime); // 5.2 Hz Indian flute vibrato
      vibratoGain.gain.setValueAtTime(4.0, startTime);
      vibrato.connect(osc.frequency);
      vibrato.start(startTime);
      vibrato.stop(startTime + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.14, startTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Ignore
    }
  }

  /**
   * Start generative Raga Yaman & Bhairavi ambient performance
   */
  public startAmbient() {
    this.init();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    // Raga Yaman melodic frequencies (Sa, Re, Ga, Ma-tivra, Pa, Dha, Ni, Sa)
    const yaman = [
      261.63, // Sa (C4)
      293.66, // Re (D4)
      329.63, // Ga (E4)
      369.99, // Ma-tivra (F#4)
      392.00, // Pa (G4)
      440.00, // Dha (A4)
      493.88, // Ni (B4)
      523.25, // Taar Sa (C5)
    ];

    const phraseMelodies = [
      [yaman[6] * 0.5, yaman[1], yaman[2], yaman[3], yaman[4]], // Ni' Re Ga Ma' Pa
      [yaman[2], yaman[3], yaman[4], yaman[5], yaman[6]],       // Ga Ma' Pa Dha Ni
      [yaman[4], yaman[5], yaman[6], yaman[7], yaman[4]],       // Pa Dha Ni Sa' Pa
      [yaman[2], yaman[1], yaman[0]],                           // Ga Re Sa (resolution)
    ];

    let phraseIndex = 0;

    const playCycle = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const phrase = phraseMelodies[phraseIndex % phraseMelodies.length];
      phraseIndex++;

      // Play Sitar arpeggio
      phrase.forEach((freq, idx) => {
        const noteTime = now + idx * 0.5;
        this.playSitarNote(freq, noteTime, 2.2);
      });

      // Play Bansuri flute drone/counter-melody
      const droneNote = yaman[phraseIndex % 3 === 0 ? 4 : 0];
      this.playBansuriNote(droneNote, now + 0.2, 3.8);

      // Loop next cycle every 4.2 seconds
      this.loopTimer = window.setTimeout(playCycle, 4200);
    };

    playCycle();
  }

  /**
   * Strictly stop all synth sounds and suspend audio context
   */
  public stopAmbient() {
    this.isPlaying = false;
    if (this.loopTimer) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      } catch {}
    }
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend().catch(() => {});
    }
  }

  /**
   * Master Silence: Stop both Web Audio API synth AND HTML5 audio completely!
   */
  public stopAll() {
    this.stopAmbient();
    if (this.htmlAudioEl) {
      try {
        this.htmlAudioEl.pause();
        this.htmlAudioEl.currentTime = 0;
      } catch {}
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wedding-audio-mute-all'));
    }
  }

  public toggle(): boolean {
    if (this.isMusicPlaying()) {
      this.stopAll();
      return false;
    } else {
      if (this.htmlAudioEl) {
        this.htmlAudioEl.play().catch(() => {});
      } else {
        this.startAmbient();
      }
      return true;
    }
  }

  /**
   * Wax Seal Break Crackle Sound
   */
  public playWaxCrack() {
    try {
      this.init();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      // Burst of crackling noise
      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);

      // Sitar shimmer note
      this.playSitarNote(523.25, now + 0.05, 1.8);
    } catch {
      // ignore
    }
  }
}

export const royalSitarAudio = new RoyalSitarFluteEngine();
