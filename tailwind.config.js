module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['helvetica']
    },
    boxShadow: {
      'brutalist-sm': '5px 5px 0px 0px #000000',
      'brutalist-lg': '10px 10px 0px 0px #000000',
      'brutalist-xl': '15px 15px 0px 0px #000000'
    },
    extend: {
      colors: {
        turquoise: {
          default: '#4ec5c1'
        }
      },
      screens: {
        xs: { max: '400px' }
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        'header-2-cols': '2fr 1fr',
        'header-3-cols': '1fr 3fr 1fr'
      },
      keyframes: {
        tilt: {
          '0%': {
            transform: 'rotate(0)'
          },
          '50%': {
            transform: 'rotate(6deg)'
          },
          '100%': {
            transform: 'rotate(0)'
          }
        }
      },
      tilt: ['hover'],
      animation: {
        tilt: 'tilt 1s ease-in-out infinite'
      },
      translate: {
        '12Percent': '12%'
      }
    }
  },
  variants: {
    extend: {
      padding: ['first']
    }
  },
  plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar-hide')]
}
