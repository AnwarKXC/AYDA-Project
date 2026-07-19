/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // AYDA brand tokens: clinical teal grounded on warm sand, with a
        // saffron accent. Defined once here; components use them by name.
        ink: '#0B3B3C',
        teal: {
          DEFAULT: '#0E7C7B',
          dark: '#0A5F5E',
          soft: '#E3F0EF',
        },
        sand: {
          DEFAULT: '#FAF7F0',
          deep: '#F1EBDE',
        },
        amber: {
          DEFAULT: '#E9A13B',
          soft: '#FBF0DC',
        },
        line: '#E4DED2',
      },
      fontFamily: {
        sans: ['"Alexandria Variable"', 'Tahoma', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11, 59, 60, 0.06), 0 8px 24px -12px rgba(11, 59, 60, 0.18)',
        lift: '0 2px 4px rgba(11, 59, 60, 0.08), 0 16px 32px -12px rgba(11, 59, 60, 0.25)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}
