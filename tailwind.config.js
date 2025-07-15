/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif'],
      },
      colors: {
        'sky-hero-from': '#0088ff',
        'sky-hero-to': '#4bc1ff',
        'pleasant': '#afe9ff',
        'comfortable': '#a0f0cf',
        'sticky': '#ffe66d',
        'uncomfortable': '#ffb54d',
        'oppressive': '#ff992f',
        'miserable': '#ff4767',
      },
    },
  },
  plugins: [],
}; 