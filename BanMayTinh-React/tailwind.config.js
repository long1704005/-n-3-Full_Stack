/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#ee4d2d', dark: '#d73211' },
      },
    },
  },
  plugins: [],
};
