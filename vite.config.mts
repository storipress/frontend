import type { UserConfig } from 'vite'
import type { ViteSentryPluginOptions } from 'vite-plugin-sentry'
// only import type
import type {} from 'vitest/config'
import path from 'node:path'
import process from 'node:process'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import { unheadVueComposablesImports } from '@unhead/vue'
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import isCi from 'is-ci'
import { createCommonJS } from 'mlly'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv, mergeConfig } from 'vite'
import codegen from 'vite-plugin-graphql-codegen'
import { createHtmlPlugin } from 'vite-plugin-html'
import Inspect from 'vite-plugin-inspect'
import Pages from 'vite-plugin-pages'
import viteSentry from 'vite-plugin-sentry'
import VueDevTools from 'vite-plugin-vue-devtools'
import Layouts from 'vite-plugin-vue-layouts'
import { $ } from 'zx'
import { validEnv } from './src/utils/storipress-env'

const { require, __dirname } = createCommonJS(import.meta.url)

const Eta = require('@storipress/unplugin-eta').default

// import codegen from 'vite-plugin-graphql-codegen'

const baseConfig: UserConfig = {
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      '@assets/': `${path.resolve(__dirname, 'assets')}/`,
      '@core-component': '@storipress/core-component',
      '@test': path.resolve('./test'),
      '@builder-component': '@storipress/builder-component',
      '@article-templates/': `${path.resolve(__dirname, 'article-templates')}/`,
      '@block/': `${path.resolve(__dirname, 'block')}/`,
      '@storipress/block/': `${path.resolve(__dirname, 'block/elements')}/`,
      '@storipress/block': `${path.resolve(__dirname, 'block/elements')}/index.ts`,
      '@storipress/article/mixins': `${path.resolve(__dirname, 'article-templates/_mixins.scss')}`,
      '@storipress/elements/mixins': `${path.resolve(__dirname, 'article-templates/_mixins.scss')}`,
      '@storipress/article': `${path.resolve(__dirname, 'article-templates/elements')}/index.ts`,
      'aggregate-error': './build/aggregate-error.js',
      lodash: 'lodash-es',
      // HACK: require.resolve will throw error
      'vue/server-renderer': path.resolve(__dirname, 'node_modules/vue/server-renderer/index.mjs'),
      // ensure we are using same version of vue
      vue: require.resolve('vue/dist/vue.runtime.esm-bundler.js'),
      '@vue/devtools-api': require.resolve('@vue/devtools-api/lib/esm/index.js'),

      // node polyfill
      path: 'rollup-plugin-node-polyfills/polyfills/path',
      fs: 'rollup-plugin-node-polyfills/polyfills/empty',
    },
    dedupe: ['@headlessui/vue', '@vueuse/core', 'yjs', '@vue/test-utils'],
    extensions: ['.browser.ts', '.browser.js', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('zapier-zap-templates') || tag.includes('storipress-paywall-preview'),
        },
      },
    }),

    vueJsx({
      include: /\.[jt]sx$/,
    }),

    Components({
      dirs: ['./src/components/ui'],
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      exclude: ['**/components/**/*.vue', '**/__tests__/**'],
      extensions: ['vue'],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        '@vueuse/core',
        'vitest',
        unheadVueComposablesImports,
        {
          '~/lib/apollo': [
            'useQuery',
            'useMutation',
            'useCancelableMutation',
            'useSubscription',
            'useLazyQuery',
            'useFeatureFlaggedQuery',
          ],
        },
        {
          '~/lib/analytics': ['analytics', 'sendTrackUnchecked', 'sendPage', 'sendIdentify', 'sendTrack'],
        },
        {
          '~/components/HelpButton': ['HelpButton', 'HelpCategories'],
        },
        {
          '~/lib/cn': ['cn'],
        },
        {
          // Vue 3.3 helper
          vue: ['useModel'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),

    Eta.vite({
      include: [/\.eta$/],
    }),
    Eta.vite({
      include: /\.ejs$/,
      options: {
        rmWhitespace: true,
        autoEscape: false,
        autoTrim: 'slurp',
        tags: ['{{', '}}'],
      },
    }),

    // https://github.com/antfu/vite-plugin-inspect
    Inspect({
      // change this to enable inspect for debugging
      enabled: false,
    }),

    Boolean(process.env.ANALYZE) &&
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ],

  optimizeDeps: {
    entries: ['index.html', 'social-connected.html', 'stripe-connected.html'],
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      '@vueuse/math',
      '@vueuse/router',
      'delay',
      'html-to-text',
      '@iarna/word-count',
      'prosemirror-utils',
      'valid-url',
      'doma',
      '@tiptap/vue-3',
      '@tiptap/core',
      'evt',
      'htm',
      'dom-chef',
      'copy-to-clipboard',
    ],
    exclude: ['vue-demi', 'core-component', 'builder-component'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },

  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, './index.html'),
        'social-connected': path.resolve(__dirname, './social-connected.html'),
        'stripe-connected': path.resolve(__dirname, './stripe-connected.html'),
      },
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        rollupNodePolyFill(),
      ],
    },
    sourcemap: 'hidden',
  },

  // https://github.com/vitest-dev/vitest
  test: {
    globals: true,
    include: ['src/**/*.{spec,test}.ts', 'test/**/*.{spec,test}.ts'],
    environment: 'jsdom',
    setupFiles: [path.resolve(__dirname, './test/setupFiles/index.ts')],
    css: true,
    coverage: {
      all: true,
      provider: 'v8',
      reporter: ['html', 'text', 'json', 'lcov'],
      include: ['**/*.{ts,js,vue}', '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: [
        'article-templates/article-components/**',
        'article-templates/sources/**',
        'article-templates/templates/**',
        'article-templates/playground/**',
        'block/blocks/**',
        'build/**',
        'functions/**',
        'playwright/**',
        'public/**',
        'scripts/**',
        'src/mocks/**',
        'src/graphql-operations.ts',
        'src/test-helpers.ts',
        'src/stories/**',
        '**/*.stories.{js,ts}',
        '.github/**',

        'packages/common-style/**',
        'packages/prosemirror-codemark/**',

        // dist
        'dist/**',
        'storybook-static/**',

        // configs
        'vitest.workspace.ts',
        'coverage/**',
        '**/*.d.ts',
        'test{,s}/**',
        'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc}.config.{js,cjs,mjs,ts}',
        '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}',
        '**/.storybook/**',
        '**/postcss.config.js',
        '**/tailwind.config.js',
        '**/webpack.*.js',
        '**/jest.*.js',
      ],
    },
  },
}

const emptyModule = path.resolve(__dirname, './build/empty.js')
export default defineConfig(async ({ mode, command }) => {
  const branchNameCommand = await $`git rev-parse --abbrev-ref HEAD`
  const branchName = branchNameCommand.text().trim()
  const commitHashCommand = await $`git rev-parse HEAD`
  const commitHash = commitHashCommand.text().trim()

  const gitVersion = `${branchName}.${commitHash}`.trim()
  const appVersion = process.env.VITE_APP_VERSION || gitVersion
  process.env.VITE_APP_VERSION = appVersion
  const rawEnv = loadEnv(mode, process.cwd(), 'VITE_')
  rawEnv.VITE_APP_VERSION = appVersion

  validEnv(rawEnv)

  if (mode === 'test') {
    return {
      ...baseConfig,
    }
  }

  const env = loadEnv(mode, process.cwd(), '')

  const config: UserConfig = {
    ...baseConfig,
    resolve: {
      alias: {
        ...baseConfig.resolve.alias,
        '@storipress/tiptap-schema': '@storipress/tiptap-schema/browser',
      },
    },
    plugins: [
      ...(baseConfig.plugins ?? []),

      viteSentry({
        org: 'storipress',
        project: 'manager-next',
        setCommits: {
          auto: true,
        },
        dryRun: !isCi || !env.SENTRY_AUTH_TOKEN || Boolean(process.env.VITE_DISABLE_SENTRY),
        authToken: env.SENTRY_AUTH_TOKEN,
        deploy: {
          env: env.VITE_SENTRY_ENV,
        },
        sourceMaps: {
          include: ['./dist/assets'],
          // https://docs.sentry.io/platforms/javascript/sourcemaps/best-practices/#correct-source-paths
          urlPrefix: '~/assets/',
        },
      } as ViteSentryPluginOptions),

      codegen({
        runOnStart: !isCi,
        runOnBuild: !isCi,
        enableWatcher: !isCi,
      }),

      createHtmlPlugin({
        minify: true,
        pages: [
          {
            filename: 'index.html',
            template: 'index.html',
            injectOptions: {
              data: {
                injectRobotsMeta: mode === 'production' ? '' : '<meta name="robots" content="noindex" />',
              },
            },
          },
          {
            filename: 'social-connected.html',
            template: 'social-connected.html',
          },
          {
            filename: 'stripe-connected.html',
            template: 'stripe-connected.html',
          },
        ],
      }),
    ],
  }

  // provide an empty module so it won't cause an error
  if (command === 'serve') {
    config.plugins ??= []
    config.plugins.unshift(VueDevTools())

    return mergeConfig(config, {
      resolve: {
        'virtual:vite-plugin-sentry/sentry-release': emptyModule,
      },
    })
  }

  return config
})
