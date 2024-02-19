/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './src/**/**/*.{js,jsx,ts,tsx}',
    './src/**/**/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      backgroundImage: {
        // 'homeDown' : "url('/src/img/Home/homeDown.png')",
      },
      margin: {
        15: '4rem',
      },
      colors: {
        noir: '#131313',
        blanc: '#E9E5D6',
        marron: '#362706',
        vert: '#ACB992',
        vertfonce: '#464E2E',
        moon: {
          100: '#958B84',
          200: '#877F79',
          300: '#7A736D',
          400: '#6C6661',
          500: '#5F5955',
          600: '#524B49',
        },
        bleuclaire: '#5272F2',
        bleufonce: '#072541',
        lightrose: '#FF3E83',
        lightyellow: '#FFDC61',
      },
      fontFamily: {
        sen: ['Sen', 'sans-serif'],
        sans: ['Roboto', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        archivo: ['Archivo Black'],
        alata: ['Alata'],
      },
    },
  },
  plugins: [],
};