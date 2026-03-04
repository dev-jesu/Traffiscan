/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'navy': {
          900: '#0A1126',
          800: '#0F1A38',
          700: '#14234A',
          600: '#192C5C',
        },
        'accent': {
          red: '#E63946',
          yellow: '#FFD166',
          green: '#06D6A0',
        },
        'card': 'rgba(229, 231, 235, 0.9)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'mountains': "url('https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg')",
      }
    },
  },
  plugins: [],
};