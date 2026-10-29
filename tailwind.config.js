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
          50: '#f0f6fb',
          100: '#e1eef7',
          200: '#c5ddf0',
          300: '#99c3e4',
          400: '#5597d0',
          500: '#2574b5',
          600: '#1a5487', // Official HAIFOS Primary Blue
          700: '#12406a', // HAIFOS Dark Primary Hover
          800: '#0f2540', // HAIFOS Deep Navy
          900: '#0a1a2e',
          950: '#06101d',
        },
        primary: {
          DEFAULT: '#1a5487',
          hover: '#12406a',
          dark: '#0f2540',
          light: '#eaf2ea',
          amber: '#f99c00',
        },
        haifos: {
          blue: '#1a5487',
          dark: '#12406a',
          navy: '#0f2540',
          mint: '#eaf2ea',
          sage: '#bfd8c0',
          amber: '#f99c00',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F9E79F',
          dark: '#B8860B',
          border: '#D4AF37',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(26, 84, 135, 0.15)',
        'cert': '0 25px 50px -12px rgba(15, 37, 64, 0.25), 0 0 25px rgba(212, 175, 55, 0.25)',
      }
    },
  },
  plugins: [],
}
