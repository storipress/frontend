// only import type
import type {} from 'vitest/config'
import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import pkg from './package.json'

export default defineConfig({
  plugins: [
    Vue(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        {
          // Vue 3.3 helper
          vue: ['useModel'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
    }),
  ],

  optimizeDeps: {
    exclude: ['vue-demi'],
  },

  build: {
    lib: {
      entry: './src/index.ts',
      name: 'CoreComponent',
      fileName: 'core-component',
      formats: ['es'],
    },
    rollupOptions: {
      external: Object.keys(pkg.dependencies),
    },
    minify: false,
  },

  // https://github.com/vitest-dev/vitest
  test: {
    globals: true,
    include: ['src/**/*.{spec,test}.ts', 'src/**/*.{spec,test}.ts', 'test/**/*.{spec,test}.ts'],
    environment: 'happy-dom',
    setupFiles: [path.resolve(__dirname, './test/setupFiles/index.ts')],
    coverage: {
      all: true,
      reporter: ['html', 'text', 'json', 'lcov'],
      include: ['**/*.{ts,js,vue}', '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: [
        'src/mocks/**',
        '**/*.stories.{js,ts}',

        // dist
        'dist/**',
        'storybook-static/**',

        // configs
        'coverage/**',
        '**/*.d.ts',
        'cypress/**',
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
})
