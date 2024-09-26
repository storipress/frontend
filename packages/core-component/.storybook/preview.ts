import type { Parameters } from '@storybook/vue3'

import '../src/assets/styles/iconfont.css'
import '../src/index.css'

export const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    values: [
      { name: 'light', value: '#fff' },
      { name: 'gray', value: '#f5f5f4' },
      { name: 'dark', value: '#000' },
      { name: 'sky', value: '#0284c7' },
    ],
  },
}
