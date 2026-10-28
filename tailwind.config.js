/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F7F2',
          100: '#EAF2EA',
          200: '#C9E1CC',
          300: '#94C79B',
          400: '#5BA866',
          500: '#16a34a',
          600: '#0c603a',
          700: '#094a2d',
          800: '#073621',
          900: '#042215',
        },
        primary: {
          DEFAULT: '#0c603a',
          dark: '#084429',
          light: '#EAF2EA',
          emerald: '#16a34a',
        },
        gold: {
          DEFAULT: '#C5A059',
          light: '#E6CA85',
          dark: '#997328',
          border: '#D4AF37',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(12, 96, 58, 0.12)',
        'cert': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 25px rgba(212, 175, 55, 0.2)',
      }
    },
  },
  plugins: [],
}
