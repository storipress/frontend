const path = require('node:path')
const { tailwindcssOriginSafelist } = require('@headlessui-float/vue')
const plugin = require('tailwindcss/plugin')
/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  darkMode: 'class',
  presets: [require('@storipress/core-component/tailwind.config')],
  safelist: [...tailwindcssOriginSafelist],
  content: [
    './index.html',
    './src/App.vue',
    './src/main.ts',
    './src/graphql-operations.ts',
    './src/types.ts',
    './src/*/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/@storipress/core-component/dist/core-component.mjs',
    './node_modules/@storipress/builder-component/dist/**/*.{vue,js,ts,jsx,tsx,mjs}',
    './node_modules/@storipress/tiptap-schema/dist/editor-schema.browser.js',
    './article-templates/templates/**/*.{vue,js,ts,jsx,tsx}',
    './article-templates/elements/**/*.{vue,js,ts,jsx,tsx}',
    './article-templates/article-components/**/*.scss}',
  ].map((p) => path.join(__dirname, p)), // convert to absolute paths to ensure they can work everywhere
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
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
    plugin(({ addComponents, theme }) => {
      addComponents({
        '.layer-0': {
          '@apply border border-black/[.05] shadow-0-layer': '',
        },
        '.layer-1': {
          '@apply border border-black/[.05] shadow-1-layer': '',
        },
        '.layer-2': {
          '@apply border border-black/[.05] shadow-2-layer': '',
        },
        '.text-display-x-large': {
          fontSize: '2.625rem',
          fontWeight: '500',
          lineHeight: '2.75rem',
          color: '#27272a',
        },
        '.text-display-large': {
          fontSize: '1.75rem',
          fontWeight: '500',
          lineHeight: '2rem',
          color: '#27272a',
        },
        '.text-display-medium': {
          fontSize: '1.625rem',
          fontWeight: 'normal',
          lineHeight: '2rem',
          color: '#27272a',
        },
        '.text-pageheading': {
          fontSize: '1.25rem',
          fontWeight: '600',
          lineHeight: '1.5rem',
          color: '#27272a',
        },
        '.text-display-small': {
          fontSize: '1.25rem',
          fontWeight: 'normal',
          lineHeight: '1.2',
          color: '#27272a',
        },
        '.text-heading': {
          fontSize: '1rem',
          fontWeight: '500',
          lineHeight: '1.5rem',
          color: '#27272a',
        },
        '.text-inputs': {
          fontSize: '1rem',
          fontWeight: 'normal',
          lineHeight: '1.5rem',
          color: '#27272a',
        },
        '.text-button': {
          fontSize: '0.875rem',
          fontWeight: '500',
          lineHeight: '1rem',
          color: '#27272a',
        },
        '.text-body': {
          fontSize: '0.875rem',
          fontWeight: 'normal',
          lineHeight: '1.25rem',
          color: '#27272a',
        },
        '.text-medium': {
          fontSize: '1.625rem',
          fontWeight: 'normal',
          lineHeight: '1.23rem',
          color: theme('colors.stone.800'),
        },
        '.text-style-2': {
          fontSize: '0.875rem',
          fontWeight: 'normal',
          fontStretch: 'normal',
          fontStyle: 'normal',
          lineHeight: 'normal',
          letterSpacing: 'normal',
          color: '#52525b',
        },
        '.text-style-3': {
          fontSize: '0.75rem',
          fontWeight: 'bold',
          fontStretch: 'normal',
          fontStyle: 'normal',
          lineHeight: '1.5',
          letterSpacing: 'normal',
          color: '#000',
        },
        '.text-subheading': {
          fontSize: '0.75rem',
          fontWeight: '600',
          lineHeight: '1rem',
          color: '#27272a',
          textTransform: 'uppercase',
        },
        '.text-caption': {
          fontSize: '0.75rem',
          fontWeight: 'normal',
          lineHeight: '1rem',
          color: '#27272a',
        },
        '.text-style': {
          fontSize: '0.75rem',
          fontWeight: 'normal',
          fontStretch: 'normal',
          fontStyle: 'normal',
          lineHeight: 'normal',
          letterSpacing: 'normal',
          color: '#fff',
        },
      })
    }),
  ],
}
