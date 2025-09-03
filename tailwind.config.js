module.exports = {
  theme: {
    extend: {
      colors: {
        beige: '#E6DACD',
        'light-gray': '#E0E0E0',
        chocolate: '#4B371C',
        'dark-chocolate': '#3A2E26',
      },
      aspectRatio: {
        '3/4': '3 / 4',
        '4/3': '4 / 3',
      },
      keyframes: {
        grow: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.2)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        grow: 'grow 20s ease-in-out infinite alternate',
        fadeIn: 'fadeIn 2s ease forwards',
      },
    },
  },
  plugins: [],
};
