/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        vtm: {
          bg: '#050505',
          card: '#0d0d11',
          surface: '#141419',
          border: '#26262f',
          blood: '#dc2626',
          crimson: '#991b1b',
          darkBlood: '#450a0a',
          gold: '#eab308',
          goldDark: '#854d0e',
          accent: '#e11d48',
          hunger: '#ef4444',
          willpower: '#3b82f6',
          humanity: '#10b981',
          textMuted: '#9ca3af',
          textNormal: '#e5e7eb',
          textBright: '#ffffff',
        }
      },
      boxShadow: {
        'blood-glow': '0 0 25px -5px rgba(225, 29, 72, 0.3)',
        'gold-glow': '0 0 25px -5px rgba(234, 179, 8, 0.25)',
        'dark-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
