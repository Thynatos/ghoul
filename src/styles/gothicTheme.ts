/**
 * GHOUL Gothic Noir Design System (GNDS) Tokens
 * Rooted in authentic Vampire: The Masquerade (V5 & V20) aesthetics.
 * Built following 'frontend-design' and 'ui-ux-pro-max' principles.
 */

export const GOTHIC_THEME = {
  colors: {
    // Background Obsidian Void
    void: '#030305',
    obsidian: '#07070a',
    charcoal: '#0d0d12',
    surface: '#13131a',
    surfaceRaised: '#1a1a24',
    surfaceElevated: '#222230',

    // Coagulated Blood & Crimson Spectrum
    blood: {
      fresh: '#e11d48',       // Active turns, critical success
      coagulated: '#991b1b',  // Main accents, headers
      dark: '#450a0a',        // Deep fills, badges
      border: '#7f1d1d',      // Card borders
      glow: 'rgba(225, 29, 72, 0.35)',
    },

    // Antique Brass, Gold & Masquerade Secrets
    gold: {
      antique: '#d97706',
      burnished: '#b45309',
      parchment: '#fef3c7',
      dark: '#78350f',
      glow: 'rgba(217, 119, 6, 0.3)',
    },

    // Humanity & Mortal Conscience (Ethereal Silver-Sage, never neon)
    humanity: {
      full: '#34d399',
      standard: '#059669',
      dim: '#064e3b',
      silver: '#cbd5e1',
      glow: 'rgba(5, 150, 105, 0.3)',
    },

    // Willpower (Deep Lapis/Steel)
    willpower: {
      bright: '#38bdf8',
      standard: '#0284c7',
      deep: '#0369a1',
      dark: '#082f49',
    },

    // Typography & Ink
    ink: {
      parchment: '#f3f4f6',   // High-contrast primary text (WCAG AAA)
      bone: '#e5e7eb',        // Standard body text
      ash: '#9ca3af',         // Secondary subtitles
      slate: '#64748b',       // Muted metadata
      redacted: '#374151',     // Redacted / Classified text
    }
  },

  typography: {
    title: 'font-cinzel tracking-widest uppercase font-bold',
    heading: 'font-cinzel font-semibold tracking-wide',
    narrative: 'font-serif italic leading-relaxed',
    mono: 'font-mono text-xs',
    body: 'font-sans text-sm leading-normal',
  },

  cards: {
    standard: 'bg-[#0a0a0f] border border-[#1e1e2b] hover:border-rose-900/60 rounded-xl transition-all duration-200',
    raised: 'bg-[#0f0f18] border border-[#262638] rounded-xl shadow-xl',
    dossier: 'bg-[#08080c] border border-rose-950/80 rounded-2xl shadow-2xl relative overflow-hidden',
    activeGlow: 'shadow-[0_0_20px_rgba(225,29,72,0.25)] border-rose-800',
  }
} as const;
