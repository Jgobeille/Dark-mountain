module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minWidth: {
      400: '400px'
    },
    fontFamily: {
      sans: ['helvetica']
    },
    boxShadow: {
      'brutalist-sm': '5px 5px 0px 0px #000000',
      'brutalist-lg': '10px 10px 0px 0px #000000',
      'brutalist-xl': '15px 15px 0px 0px #000000'
    },
    extend: {
      width: {
        3733: '3733px'
      },
      height: {
        98.2: '98.2%'
      },
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
        },
        scroll: {
          '0%': { marginLeft: '0px' },
          '100%': { marginLeft: '-2435px' }
        },

        heartbeat: {
          '0%': {
            transform: 'scale(.75)'
          },

          '20%': {
            transform: 'scale(1)'
          },

          '40%': {
            transform: 'scale(.75)'
          },

          '60%': {
            transform: 'scale(1)'
          },

          '80%': {
            transform: 'scale(.75)'
          },

          '100%': {
            transform: 'scale(.75)'
          }
        }
      },
      tilt: ['hover'],
      animation: {
        tilt: 'tilt 1s ease-in-out infinite',
        scroll: 'scroll 10s linear infinite',
        heartbeat: 'heartbeat 1s infinite '
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
