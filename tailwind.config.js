/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{html,js}'],
  theme: {
    colors: {
      black: '#667289',
      white: '#FFFFFF',
      brand: '#BA9AF0',
      neutral: '#EEF4FF',
    },
    extend: {
      screens: {
        'short': {'raw': '(max-height: 741px) and (max-width: 431px)'}
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Copse', 'sans-serif'],
      },
    },
  },
  plugins: [],
}