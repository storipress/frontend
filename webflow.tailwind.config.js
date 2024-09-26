const path = require('node:path')

module.exports = {
  presets: [require('@storipress/core-component/tailwind.config')],
  content: ['./node_modules/@storipress/tiptap-schema/dist/editor-schema.browser.js'].map((p) =>
    path.join(__dirname, p),
  ), // convert to absolute paths to ensure they can work everywhere
  theme: {
    extend: {
      fontFamily: {
        iAWriterQuattro: ['iAWriterQuattro'],
      },

      // editor-core config
      zIndex: {
        '-1': '-1',
      },

      colors: {
        'almost-black': '#191919',
        'clear-blue': '#2b8bf2',
        'charcoal-grey': '#485353',
        silver: '#d2e0e0',
        'light-pale-grey': '#f1f3f4',
      },

      boxShadow: {
        // shadow style guide
        1: '0 2px 5px 2px rgba(0, 0, 0, 0.1)',
        2: '5px 10px 30px 0 rgba(0, 0, 0, 0.15)',
        3: '10px 25px 60px 0 rgba(0, 0, 0, 0.3)',

        // white variant for editor
        w2: '5px 10px 30px 0 rgba(255, 255, 255, 0.30)',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
  ],
}
