const process = require('node:process')
const antfu = require('@antfu/eslint-config').default
const cspell = require('@cspell/eslint-plugin')
const prettier = require('eslint-plugin-prettier')
const tailwindcss = require('eslint-plugin-tailwindcss')
const testingLibrary = require('eslint-plugin-testing-library')
const isCi = require('is-ci')

const ignores = [
  'dist',
  '**/dist/**',
  'public',
  '**/public/**',
  'article-templates/templates',
  'article-templates/templates/**',
  'article-templates/sources',
  'article-templates/sources/**',
  'block/blocks/',
  'block/blocks/**/',
  'src/graphql-operations.ts',
  'src/graphql-operations.ts/**',
  'storybook-static',
  '**/storybook-static/**',
  '.vscode',
  '**/.vscode/**',
  '.yarn/**/',
  '*.jsonc',
  '**/*.jsonc/**',
  '*.toml',
  '*.yml',
  '**/*.yml/**',
  '.moon/**/*',
  'playwright/utils/*.json',
  'playwright/utils/*.json/**',
  'tsconfig.json',
]

const isInEditor = !!((process.env.VSCODE_PID || process.env.JETBRAINS_IDE || process.env.VIM) && !isCi)

module.exports = antfu(
  {
    ignores,
    stylistic: false,
    typescript: true,
    rules: {
      'antfu/top-level-function': 'error',

      'vue/component-tags-order': 'off',
      'vue/component-name-in-template-casing': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-indent': 'off',
      'vue/html-self-closing': 'off',
    },
  },
  {
    ignores,
    plugins: { tailwindcss },
    rules: {
      'tailwindcss/enforces-negative-arbitrary-values': 'warn',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/no-custom-classname': [
        'warn',
        {
          whitelist: [
            // our utilities
            'icon-.*',

            // allowed custom class
            'custom-input',
            'has-dark',
          ],
        },
      ],
      'tailwindcss/no-contradicting-classname': 'error',
    },
  },
  {
    name: 'setup-testing-library',
    plugins: {
      'testing-library': testingLibrary,
    },
  },
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    ignores,
    rules: {
      ...testingLibrary.configs.vue.rules,
      'testing-library/prefer-screen-queries': 'off',
    },
  },
  // it will stuck in CI, so disable it
  ...(isCi
    ? []
    : [
        {
          ignores,
          plugins: { '@cspell': cspell },
          rules: {
            ...cspell.configs.recommended.rules,
          },
        },
      ]),
  ...(isInEditor
    ? []
    : [
        {
          ignores,
          plugins: { prettier },
          rules: {
            'prettier/prettier': 'error',
          },
        },
      ]),
  { ignores },
)
