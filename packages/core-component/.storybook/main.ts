import type { StorybookConfig } from '@storybook/vue3-vite'
const turbosnap = require('vite-plugin-turbosnap')

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-actions',
    '@storybook/addon-jest',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  typescript: {
    check: false,
  },
  async viteFinal(config, { configType }) {
    // Needed only for development mode: `npm run storybook`
    config.optimizeDeps =
      configType === 'PRODUCTION'
        ? config.optimizeDeps
        : {
            ...(config.optimizeDeps || {}),
            include: [
              ...(config?.optimizeDeps?.include || []),
              // Fix: `@storybook/addon-interactions` exports is not defined or `jest-mock` does not provide an export named 'fn'
              'jest-mock',
              // // Optional, but prevents error flashing in the Storybook component preview iframe:
              // // Fix: failed to fetch dynamically import module, avoid cache miss for dependencies on the first load
              // '@storybook/components',
              // '@storybook/store',
              // Add all addons that imported in the `preview.js` or `preview.ts` file and used in exported constants
              '@storybook/vue3',
            ],
          }
    if (configType === 'PRODUCTION') {
      config.plugins = config.plugins || []
      config.plugins.push(
        turbosnap({
          rootDir: config.root,
        }),
      )
    }
    return config
  },
  docs: {
    autodocs: true,
  },
}

export default config
