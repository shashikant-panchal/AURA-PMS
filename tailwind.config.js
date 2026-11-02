/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alabaster: {
          DEFAULT: '#FAFAF8',
          50: '#FFFFFF',
          100: '#FDFCF7',
          200: '#F7F6F0',
          300: '#EFECE2',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          card: '#FFFFFF',
          elevated: 'rgba(255, 255, 255, 0.95)',
          muted: '#F5F5F0',
          hover: '#FDF8EE',
          border: '#E7E5E4',
          'border-gold': 'rgba(180, 140, 54, 0.3)',
        },
        charcoal: {
          DEFAULT: '#1C1917',
          900: '#1C1917',
          800: '#292524',
          700: '#44403C',
          600: '#57534E',
          500: '#78716C',
          400: '#A8A29E',
        },
        gold: {
          DEFAULT: '#B48C36',
          light: '#C5A059',
          dark: '#936F25',
          cream: '#FDF8EE',
          glow: 'rgba(180, 140, 54, 0.15)',
          border: 'rgba(180, 140, 54, 0.35)',
        },
        status: {
          available: '#059669',
          'available-bg': '#ECFDF5',
          'available-border': '#A7F3D0',
          occupied: '#E11D48',
          'occupied-bg': '#FFF1F2',
          'occupied-border': '#FECDD3',
          reserved: '#7C3AED',
          'reserved-bg': '#F5F3FF',
          'reserved-border': '#DDD6FE',
          cleaning: '#D97706',
          'cleaning-bg': '#FFFBEB',
          'cleaning-border': '#FDE68A',
          maintenance: '#475569',
          'maintenance-bg': '#F1F5F9',
          'maintenance-border': '#CBD5E1',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', '"Cinzel"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft-luxury': '0 4px 24px -4px rgba(0, 0, 0, 0.05)',
        'soft-luxury-lg': '0 12px 40px -10px rgba(0, 0, 0, 0.08)',
        'gold-glow': '0 4px 20px rgba(180, 140, 54, 0.18)',
      },
    },
  },
  plugins: [],
}
