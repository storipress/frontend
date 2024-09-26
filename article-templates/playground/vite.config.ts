import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, '../../src')}/`,
      '@storipress/article': path.resolve(__dirname, '../elements/index.ts'),
      vue: require.resolve('vue/dist/vue.runtime.esm-bundler.js'),
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      dts: 'src/auto-imports.d.ts',
    }),
  ],

  server: {
    fs: {
      strict: true,
    },
    watch: {
      ignored: ['./src/auto-imports.d.ts'],
    },
  },

  optimizeDeps: {
    include: ['vue', 'vue-router', '@vueuse/core'],
    exclude: ['vue-demi'],
  },
})
