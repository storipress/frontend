import type { StorybookConfig } from '@storybook/vue3-vite'
import turbosnap from 'vite-plugin-turbosnap'
import { match } from 'ts-pattern'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
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
  viteFinal(config, { configType }) {
    config.plugins = config.plugins || []
    config.plugins = config.plugins.filter((plugin) =>
      // @ts-expect-error typescript can't infer the type of plugin
      match(plugin)
        .with({ name: 'graphql-codegen' }, () => false)
        .otherwise(() => true),
    )
    if (configType === 'PRODUCTION') {
      return mergeConfig(config, {
        plugins: [
          turbosnap({
            rootDir: config.root as string,
          }),
        ],
      })
    }

    return mergeConfig(config, {
      server: {
        hmr: {
          host: '127.0.0.1',
        },
        watch: {
          ignored: ['.env', '.env.*'],
        },
      },
    })
  },
  docs: {
    autodocs: true,
  },
}

export default config
