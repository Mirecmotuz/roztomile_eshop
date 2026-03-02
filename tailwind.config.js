/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        honey: {
          DEFAULT: '#D4873A',
          dark:    '#B8711F',
          light:   '#FDF3E7',
        },
        cream:     '#FAF7F2',
        stone:     '#6B6560',
        anthracite:'#2A2420',
      },
      fontFamily: {
        sans:  ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 12px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
