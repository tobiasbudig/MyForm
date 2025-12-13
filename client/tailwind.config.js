/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0077B6',
          hover: '#005f92',
          light: '#90E0EF',
          50: '#E6F7FF',
          100: '#B3E5FC',
          200: '#81D4FA',
          300: '#4FC3F7',
          400: '#29B6F6',
          500: '#0077B6',
          600: '#005f92',
          700: '#01579B',
          800: '#014F86',
          900: '#013A63',
        },
        surface: '#F8F9FA',
        textPrimary: '#1A1A1A',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        error: '#DC2626',
        success: '#059669',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro',
          'Segoe UI',
          'Roboto',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
