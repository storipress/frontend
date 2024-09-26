import { NotificationsPlugin } from '@storipress/core-component'
import { createTestingPinia } from '@pinia/testing'
import { ApolloClients, provideApolloClients } from '@vue/apollo-composable'
import type { RenderOptions, RenderResult } from '@testing-library/vue'
import generatedRoutes from 'virtual:generated-pages'
import { render as vueRender } from '@testing-library/vue'
import type { RouteRecordRaw, Router } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { defu } from 'defu'
import { defineComponent, h } from 'vue'
import { createHead } from '@unhead/vue'
import { plugin as Slicksort } from 'vue-slicksort'
import type { TypedDocumentNode } from '@apollo/client/core'
import type { PartialDeep } from 'type-fest'
import tailwindcss from 'tailwindcss'
import postcss from 'postcss'
import type { GraphQLError } from 'graphql'
import { setActivePinia } from 'pinia'
import { server } from '../test/server'
import { KEY } from '../test/setupFiles/constant'
import type { MockHandler } from './mocks/define-graphql-mock'
import { defineGraphQLMock } from './mocks/define-graphql-mock'
import { key as confirmModelKey } from '~/components/ConfirmModalProvider/definition'
import { enableFeatures as _enableFeatures } from '~/lib/feature-flag'
import { clients } from '~/lib/apollo'

interface CustomRenderOptions extends RenderOptions {
  routes?: boolean | RouteRecordRaw[]
  stubActions?: boolean
}

interface CustomRenderResult extends RenderResult {
  router: ReturnType<typeof createRouter>
}

export const mockAxiomIngest = vi.fn()

export function render(
  // skipcq: JS-0323
  component: any,
  options: CustomRenderOptions & { css: true },
): Promise<CustomRenderResult> & CustomRenderResult
// skipcq: JS-0323
export function render(component: any, options?: CustomRenderOptions & { css?: false }): CustomRenderResult
// skipcq: JS-0323
export function render(component: any, options?: CustomRenderOptions & { css?: boolean }) {
  const routes = options?.routes
    ? options.routes === true
      ? generatedRoutes
      : options.routes
    : [
        { path: '/', component: defineComponent({ setup: () => () => h('div', 'Home') }) },
        { path: '/**', component: defineComponent({ setup: () => () => h('div', 'CatchAll') }) },
      ]
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })

  const renderOptions: RenderOptions = {
    ...options,
    global: {
      ...options?.global,
      plugins: [
        ...(options?.global?.plugins ?? []),
        NotificationsPlugin,
        Slicksort,
        setupTestPinia(options?.stubActions),
        createHead(),
        router,
        (app) => {
          app.provide(KEY, 'secret-key')
          app.provide(ApolloClients, clients)
          app.provide(confirmModelKey, { confirm: vi.fn(), modalList: [] })
        },
      ],
    },
  }
  const res = vueRender(component, renderOptions)

  // when css is true, create a new instance of tailwindcss and postcss
  if (options?.css) {
    const lazyResult = postcss([
      tailwindcss({
        content: [{ raw: res.container.innerHTML }],
      }),
    ]).process('@tailwind utilities;', { from: undefined })
    const promise: Promise<RenderResult> & RenderResult = lazyResult.then((result) => {
      const style = document.createElement('style')
      style.innerHTML = result.css
      res.container.append(style)
      return {
        ...res,
        router,
      }
    }) as Promise<CustomRenderResult> & CustomRenderResult

    return new Proxy(promise, {
      get(target, key) {
        if (key === 'then') {
          const then = target.then.bind(target)
          return (...args: Parameters<typeof then>) => {
            then(...args)
          }
        }
        throw new Error('Please await the returned promise if you are using `css: true`')
      },
    })
  }

  return {
    ...res,
    router,
  }
}

interface Composable<Params extends unknown[], Return> {
  (...params: Params): Return
}

export function runComposable<Params extends unknown[], Return>(
  composable: Composable<Params, Return>,
  ...params: Params
): { result: Return; router: Router } {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [{ path: '/', component: defineComponent({ setup: () => () => h('div', 'Home') }) }],
  })

  const app = createApp({
    setup: () => () => h('div'),
  })

  app.use(NotificationsPlugin)
  app.use(Slicksort)
  app.use(setupTestPinia())
  app.use(createHead())
  app.use(router)
  app.provide(KEY, 'secret-key')
  app.provide(ApolloClients, clients)
  app.provide(confirmModelKey, { confirm: vi.fn(), modalList: [] })

  return {
    result: app.runWithContext(() => composable(...params)),
    router,
  }
}

export function setupApolloClient() {
  provideApolloClients(
    new Proxy(
      {},
      {
        get: () => {
          return clients.default
        },
      },
    ),
  )
  resetApolloCache()
}

export function resetApolloCache() {
  clients.default.cache.reset({})
}

export function setupTestPinia(stubActions?: boolean) {
  return createTestingPinia({
    stubActions,
    initialState: {
      client: {
        clientID: 'D6RX98VXN',
        defaultClientID: 'default',
        token: 'cAA6LoWllmqdXaYYid1AxpEDy5liOBGp5ppKPNKM',
        isResetPassword: false,
      },
      'search-condition': {
        text: undefined,
        people: undefined,
        tags: undefined,
        range: undefined,
      },
      site: {
        site: {
          name: "Joe's Blog",
          timezone: 'Asia/Taipei',
          email: 'test@storipress.com',
          socials: '{"Facebook":"www.facebook.com\\/Storipress"}',
        },
        siteTutorials: {
          setSocialConnect: true,
          setPublicationDetail: true,
          setCreateDesks: true,
          setDomain: true,
        },
      },
      me: {
        me: {
          id: 151,
          role: 'owner',
        },
      },
      integration: {
        integrations: [
          { activated_at: null, data: '{"shortname":null}', key: 'disqus', order: 6 },
          {
            activated_at: null,
            data: '[]',
            key: 'webflow',
            order: 7,
          },
        ],
      },
      knownErrors: {
        errors: [],
      },
    },
  })
}

export function setupTestEnv() {
  setActivePinia(setupTestPinia())
  setupApolloClient()
}

export function useTestEnv() {
  beforeEach(setupTestEnv)
}

export function useFakeTimer(now?: number | Date) {
  beforeEach(() => {
    vi.useFakeTimers({ now })
  })

  afterEach(() => {
    vi.useRealTimers()
  })
}

export function mockResponse<QueryOutput extends Record<string, any>>(
  doc: TypedDocumentNode<QueryOutput, any>,
  data: QueryOutput,
) {
  const handler = defineGraphQLMock(doc, data, (output, res, ctx) => res.once(ctx.data(output)))

  server.use(handler)
}

export function mockResponseOnce<QueryOutput extends Record<string, any>, Variables extends Record<string, any>>(
  originalHandler: MockHandler<QueryOutput, Variables>,
  patchedQuery: PartialDeep<QueryOutput> = {} as PartialDeep<QueryOutput>,
) {
  const handler = defineGraphQLMock<QueryOutput, Variables>(
    originalHandler.doc,
    (req) => {
      return defu(patchedQuery, originalHandler.resolveOutput(req)) as QueryOutput
    },
    (output, res, ctx) => res.once(ctx.data(output)),
  )

  server.use(handler)
}

export function mockResponseError<QueryOutput extends Record<string, any>, Variables extends Record<string, any>>(
  originalHandler: MockHandler<QueryOutput, Variables>,
  errors: Partial<GraphQLError>[],
) {
  const handler = defineGraphQLMock<QueryOutput, Variables>(
    originalHandler.doc,
    () => {
      return {} as QueryOutput
    },
    (_output, res, ctx) => res.once(ctx.errors(errors)),
  )

  server.use(handler)
}

export function enableFeatures(features: string[]) {
  _enableFeatures(features)
}
