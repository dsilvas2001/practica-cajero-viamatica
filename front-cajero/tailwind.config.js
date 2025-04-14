/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      monstserrat: ['Montserrat', 'sans-serif'],
      inter: ['Inter', 'sans-serif'],
      primary: ['Open Sans', 'sans-serif']
    },
    extend: {
      colors: {
        primary: {
          400: '#f2be1d',
          500: '#dda210',
          titulo: '#DDA10B',
        },
        secondary: {
          50: '#fdfae9',
          100: '#fcf5c5',
        },
        accent: {
          100: '#fdf4d7',
          200: '#fae88e',
          300: '#f6d44e',
        },
        warning: {
          600: '#c37f0b',
          700: '#9b5b0d',
        },
        neutral: {
          700: '#814812',
          800: '#814812',
          900: '#6d3b16',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        gradient: 'gradient 3s ease infinite',
        blob: 'blob 7s infinite',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      },

      plugins: [],
    }
  }
}
