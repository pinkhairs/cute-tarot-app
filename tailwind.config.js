// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./App.svelte",
    "./**/*.{svelte,js,ts,jsx,tsx}",
    "!./node_modules/**",
  ],
  theme: {
    fontSize: {
      sm: '0.8rem',
      base: '1.1rem',
      xl: '1.3rem',
      '2xl': '1.45rem',
      '3xl': '1.66rem',
      '4xl': '2rem',
      '5xl': '3rem',
    },
    colors: {
      black: '#667289',
      white: '#fff',
      brand: '#BA9AF0',
      neutral: '#EEF4FF',
      accent: '#E9E1FF',
      translucent: 'rgba(238, 244, 255, 0.93)',
    },
    extend: {
      screens: {
        'short': { 'raw': '(max-height: 741px) and (max-width: 431px)' },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Copse', 'sans-serif'],
      },
    },
  },
};
