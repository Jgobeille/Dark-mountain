module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['helvetica']
    },
    boxShadow: {
      brutalist: '10px 10px 0px 0px #000000'
    },
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        header: '1fr 3fr 1fr'
      }
    }
  },
  variants: {
    extend: {
      padding: ['first']
    }
  },
  plugins: []
}
