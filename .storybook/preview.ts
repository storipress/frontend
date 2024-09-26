import type { Decorator, Parameters } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import { vueRouter } from 'storybook-vue3-router'

import { createPinia } from 'pinia'
import { NotificationsPlugin } from '@storipress/core-component'
import { plugin } from '@storipress/vue-slicksort'
import { VueMasonryPlugin } from 'vue-masonry'
import { ApolloClients } from '@vue/apollo-composable'
import { worker } from '../src/mocks/browser'
import ConfirmModalProvider from '../src/components/ConfirmModalProvider'
import { sync } from '../src/lib/sync'
import { clients } from '../src/lib/apollo'
import { useAuthStore } from '../src/stores/auth'
import { LoginDocument } from '../src/graphql-operations'
import { enableFeatures } from '../src/lib/feature-flag'

import '../src/styles/main.css'
import '@storipress/core-component/index.css'
import '@storipress/core-component/dist/style.css'

const pinia = createPinia()
// @ts-expect-error expose to global
globalThis.pinia = pinia
pinia.use(sync)

setup((app) => {
  app.use(pinia)
  app.use(NotificationsPlugin)
  app.use(plugin)
  app.use(VueMasonryPlugin)
  app.provide(ApolloClients, clients)
})

const authStore = useAuthStore(pinia)

if (!import.meta.env.VITE_ENABLE_MOCK_API) {
  authStore.defaultClientID = 'D6RX98VXN'
}

// @ts-expect-error expose to global
globalThis.__SET_STORIPRESS_TOKEN__ = (token) => {
  authStore.token = token
  // skipcq: JS-0002
  // eslint-disable-next-line no-console
  console.log('ok')
}

// @ts-expect-error expose to global
globalThis.__STORIPRESS_LOGIN__ = async (email, password) => {
  const { data } = await clients.default.mutate({ mutation: LoginDocument, variables: { email, password } })
  authStore.token = data!.signIn.access_token
  // skipcq: JS-0002
  // eslint-disable-next-line no-console
  console.log('done, please reload')
}

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
    ],
  },
}

if (import.meta.env.VITE_ENABLE_MOCK_API) {
  worker.start({
    onUnhandledRequest(req) {
      console.error('Found an unhandled %s request to %s', req.method, req.url.href)
    },
  })
}

export const decorators: Decorator[] = [
  (story, { parameters: { featureFlags = [] } }) => ({
    components: { ConfirmModalProvider, story },
    template: '<ConfirmModalProvider><story /></ConfirmModalProvider>',
    created() {
      if (Array.isArray(featureFlags)) {
        enableFeatures(featureFlags)
      }
    },
  }),
  vueRouter(),
]
