export default {
  content: [
    './index.html',
    './**/*.{html,js}',
  ],
  theme: {
    colors: {
      black: '#667289',
      white: '#fff',
      brand: '#BA9AF0',
      neutral: '#EEF4FF',
      accent: '#E9E1FF',
      translucent: 'rgba(255, 255, 255, 0.75)',
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
}
