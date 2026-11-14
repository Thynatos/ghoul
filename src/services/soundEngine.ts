// Procedural Web Audio API sound generator for Vampire: The Masquerade atmosphere & dice

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientNodes: Record<string, { gain: GainNode; stop: () => void }> = {};

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAllAmbience();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Tactical Dice & Action SFX
  public playDiceRoll() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Synthesize rapid multiple clatters (bone/plastic dice)
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = i % 2 === 0 ? 'triangle' : 'square';
        osc.frequency.setValueAtTime(150 + Math.random() * 300, now + i * 0.04);
        osc.frequency.exponentialRampToValueAtTime(80, now + i * 0.04 + 0.05);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600 + Math.random() * 400, now + i * 0.04);

        gain.gain.setValueAtTime(0.12, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.06);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.07);
      }
    } catch (e) {
      // AudioContext handling
    }
  }

  public playCritical() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Gothic church bell harmonic
      const freqs = [220, 440, 554.37, 659.25];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.15 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + 1.8);
      });
    } catch (e) {}
  }

  public playBestialFail() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Dark low rumble and discordant tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.8);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch (e) {}
  }

  public playRouseSuccess() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  public playRouseFail() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Blood thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  // Ambient Soundscapes
  public setAmbienceVolume(track: string, volume: number) {
    if (this.isMuted && volume > 0) return;
    this.initCtx();
    if (!this.ctx) return;

    if (volume <= 0) {
      if (this.ambientNodes[track]) {
        this.ambientNodes[track].stop();
        delete this.ambientNodes[track];
      }
      return;
    }

    if (!this.ambientNodes[track]) {
      this.startAmbienceTrack(track, volume);
    } else {
      this.ambientNodes[track].gain.gain.setTargetAtTime(volume * 0.3, this.ctx.currentTime, 0.1);
    }
  }

  private startAmbienceTrack(track: string, initialVol: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(initialVol * 0.3, now);
    masterGain.connect(this.ctx.destination);

    let stopFunc = () => {
      try {
        masterGain.disconnect();
      } catch (e) {}
    };

    if (track === 'rain') {
      // Noise buffer for rain
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1200;

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();

      stopFunc = () => {
        try {
          noise.stop();
          noise.disconnect();
          masterGain.disconnect();
        } catch (e) {}
      };
    } else if (track === 'chantry') {
      // Deep cathedral organ drone
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = 65.41; // C2
      osc2.frequency.value = 65.9; // subtle beating chorus

      osc1.connect(masterGain);
      osc2.connect(masterGain);
      osc1.start();
      osc2.start();

      stopFunc = () => {
        try {
          osc1.stop();
          osc2.stop();
          osc1.disconnect();
          osc2.disconnect();
          masterGain.disconnect();
        } catch (e) {}
      };
    } else if (track === 'heartbeat') {
      // Periodic pulse interval
      let isRunning = true;
      const beat = () => {
        if (!isRunning || !this.ctx) return;
        const t = this.ctx.currentTime;
        // Lub
        const osc1 = this.ctx.createOscillator();
        const g1 = this.ctx.createGain();
        osc1.frequency.setValueAtTime(80, t);
        osc1.frequency.exponentialRampToValueAtTime(45, t + 0.12);
        g1.gain.setValueAtTime(0.4, t);
        g1.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc1.connect(g1);
        g1.connect(masterGain);
        osc1.start(t);
        osc1.stop(t + 0.15);

        // Dub
        const osc2 = this.ctx.createOscillator();
        const g2 = this.ctx.createGain();
        osc2.frequency.setValueAtTime(70, t + 0.2);
        osc2.frequency.exponentialRampToValueAtTime(40, t + 0.35);
        g2.gain.setValueAtTime(0.3, t + 0.2);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
        osc2.connect(g2);
        g2.connect(masterGain);
        osc2.start(t + 0.2);
        osc2.stop(t + 0.38);

        setTimeout(beat, 1100);
      };
      beat();

      stopFunc = () => {
        isRunning = false;
        try {
          masterGain.disconnect();
        } catch (e) {}
      };
    } else if (track === 'nightclub') {
      // 120 BPM low-frequency bass punch
      let isRunning = true;
      const kick = () => {
        if (!isRunning || !this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.exponentialRampToValueAtTime(35, t + 0.18);
        g.gain.setValueAtTime(0.5, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 180;

        osc.connect(filter);
        filter.connect(g);
        g.connect(masterGain);

        osc.start(t);
        osc.stop(t + 0.25);
        setTimeout(kick, 500); // 120 bpm
      };
      kick();

      stopFunc = () => {
        isRunning = false;
        try {
          masterGain.disconnect();
        } catch (e) {}
      };
    } else if (track === 'fireplace') {
      // Warm crackle
      const bufferSize = this.ctx.sampleRate;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() > 0.985 ? Math.random() * 2 - 1 : 0) + (Math.random() * 0.05);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2500;
      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();

      stopFunc = () => {
        try {
          noise.stop();
          masterGain.disconnect();
        } catch (e) {}
      };
    } else if (track === 'whispers') {
      // Ethereal sweep
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      osc.type = 'triangle';
      osc.frequency.value = 180;
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.Q.value = 8;

      osc.connect(filter);
      filter.connect(masterGain);
      osc.start();

      stopFunc = () => {
        try {
          osc.stop();
          masterGain.disconnect();
        } catch (e) {}
      };
    }

    this.ambientNodes[track] = { gain: masterGain, stop: stopFunc };
  }

  public stopAllAmbience() {
    Object.keys(this.ambientNodes).forEach(track => {
      this.ambientNodes[track].stop();
    });
    this.ambientNodes = {};
  }

  // Dark Taboos & Combat Procedural SFX
  public playHeartbeat() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Two thumps (lub-dub)
      [0, 0.18].forEach((offset, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(idx === 0 ? 70 : 55, now + offset);
        osc.frequency.exponentialRampToValueAtTime(30, now + offset + 0.15);

        gain.gain.setValueAtTime(idx === 0 ? 0.35 : 0.25, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.18);
      });
    } catch (e) {}
  }

  public playDiablerieGasp() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Unearthly soul drain dissonance
      const freqs = [110, 164.81, 233.08, 466.16]; // Minor second / tritone dissonance
      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f * 0.7, now + 1.6);

        gain.gain.setValueAtTime(0.08 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.linearRampToValueAtTime(120, now + 1.6);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + 1.8);
      });
    } catch (e) {}
  }

  public playFrenzyRoar() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.9);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(250, now);
      filter.Q.value = 3;

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.95);
    } catch (e) {}
  }

  public playCombatHit() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  public playStakeImpact() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Heavy wood crack + resonant hollow thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  public playDrawerSlide() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.22);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(90, now + 0.22);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }
}

export const soundEngine = new SoundEngine();
