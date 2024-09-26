module.exports = {
  presets: [require('../../core-component/tailwind.config')],
  content: [
    './index.html',
    './src/**/*.vue',
    './src/article-data.ts',
    './src/index.ts',
    '../elements/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        iAWriterQuattro: ['iAWriterQuattro'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar-hide'),
  ],
}
