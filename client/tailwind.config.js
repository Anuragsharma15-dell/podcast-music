/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        forge: {
          bg: '#080b14',
          panel: '#0d1120',
          border: '#1a2240',
          purple: '#7c3aed',
          pink: '#ec4899',
          cyan: '#06b6d4',
          green: '#10b981',
          text: '#e2e8f0',
          muted: '#64748b',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'waveform': 'waveform 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        waveform: {
          '0%, 100%': { scaleY: 0.3 },
          '50%': { scaleY: 1 },
        }
      }
    }
  },
  plugins: []
}
