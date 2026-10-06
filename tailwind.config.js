/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0a0b0d',
        panel: '#101216',
        raised: '#16191f',
        line: '#23262e',
        'line-soft': '#1a1d23',
        fg: '#d6dae0',
        muted: '#7a838f',
        dim: '#4d545e',
        phos: '#c9f24d',
        'phos-dim': '#8fae35',
        'phos-glow': 'rgba(201, 242, 77, 0.55)',
        cyan: '#5ad4e0',
        amber: '#e8b64c',
        coral: '#ff6b5b',
        violet: '#a78bfa',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        terminal: '0.14em',
      },
      boxShadow: {
        phos: '0 0 12px rgba(201, 242, 77, 0.25), 0 0 40px rgba(201, 242, 77, 0.08)',
        'phos-sm': '0 0 6px rgba(201, 242, 77, 0.35)',
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 24px 60px -30px rgba(0,0,0,0.9)',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '0.85' },
          '8%': { opacity: '0.92' },
          '9%': { opacity: '0.6' },
          '10%': { opacity: '0.95' },
          '72%': { opacity: '0.88' },
          '73%': { opacity: '0.55' },
          '74%': { opacity: '0.9' },
        },
        riseIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        barPulse: {
          '0%, 100%': { transform: 'scaleY(0.25)' },
          '50%': { transform: 'scaleY(1)' },
        },
        sweep: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(100%)' },
        },
      },
      animation: {
        blink: 'blink 1.05s steps(1) infinite',
        scanline: 'scanline 7s linear infinite',
        flicker: 'flicker 6s linear infinite',
        riseIn: 'riseIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        barPulse: 'barPulse 1.1s ease-in-out infinite',
        sweep: 'sweep 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}
