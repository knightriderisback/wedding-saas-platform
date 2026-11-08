/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FFFFFF',
          100: '#FAF8F5',
          200: '#F5EFE6',
          300: '#EDE4D4',
          400: '#DFD1BD',
          500: '#CDB99F',
        },
        parchment: {
          light: '#FDFBF7',
          DEFAULT: '#FAF8F5',
          warm: '#F4ECE1',
          border: '#E8DFC8',
          shadow: '#D8C7B0',
        },
        gold: {
          50: '#FDFCF7',
          100: '#FAF4E3',
          200: '#F3E5AB',
          300: '#E7D17D',
          400: '#D4AF37', // 24K Classic Gold
          500: '#C59A27',
          600: '#AA820A',
          700: '#7D5F04',
          800: '#543F02',
          900: '#332601',
        },
        maroon: {
          50: '#FDF2F4',
          100: '#FBE4E8',
          200: '#F7CBD2',
          600: '#B8283D',
          700: '#9B1C2E', // Auspicious Sindoor
          800: '#7A1423',
          900: '#520B16',
        },
        marigold: {
          100: '#FEF9E7',
          200: '#FDF2D0',
          400: '#F9CA24',
          500: '#F39C12', // Haldi Sunshine
          600: '#E58E26',
        },
        sage: {
          100: '#F1F6F3',
          200: '#E2ECE6',
          400: '#99B8A5',
          500: '#739B83', // Mehendi Fresh Green
          600: '#557A65',
        },
        walnut: {
          100: '#EBE6DF',
          300: '#A49685',
          700: '#544230',
          800: '#3D2F22',
          900: '#2C2218', // Deep Royal Charcoal-Brown for crisp typography
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        pinyon: ['Pinyon Script', 'cursive'],
        playfair: ['Playfair Display', 'serif'],
        greatvibes: ['Great Vibes', 'cursive'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 3s infinite linear',
        'float-slow': 'float 5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
