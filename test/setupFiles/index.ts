import '@testing-library/jest-dom/vitest'
import { mockIntersectionObserver } from 'jsdom-testing-mocks'

import { cleanup } from '@testing-library/vue'
import type * as VueMod from 'vue'
import { addEqualityTesters } from '@effect/vitest'
import type { MockInstance } from 'vitest'
import { expect } from 'vitest'
import { server } from '../server'

mockIntersectionObserver()

// let `expect(EffectType).toEqual(EffectType)` work
addEqualityTesters()

vi.stubGlobal('ClipboardEvent', Event)
vi.stubGlobal('DragEvent', Event)

vi.mock('vue3-apexcharts')

vi.mock('@upollo/web', () => ({
  UpolloClient: class UpolloClient {},
  EventType: {},
}))

vi.mock('@headlessui/vue', async () => {
  const { defineComponent } = await vi.importActual<typeof VueMod>('vue')
  const mod = await vi.importActual('@headlessui/vue')

  return {
    ...mod,
    Dialog: defineComponent((_, { slots }) => {
      return () => h('div', { 'date-stub': 'dialog', role: 'dialog' }, slots.default?.())
    }),
    DialogOverlay: defineComponent((_, { slots }) => {
      return () => h('div', { 'date-stub': 'dialog-overlay' }, slots.default?.())
    }),
  }
})

vi.mock('@storipress/core-component', async () => {
  const { defineComponent } = await vi.importActual<typeof VueMod>('vue')
  const mod = await vi.importActual('@storipress/core-component')

  return {
    ...mod,
    HoverHint: defineComponent(() => {
      const { default: child, content } = useSlots()
      return () =>
        h('div', { 'data-stub': 'hover-hint' }, [
          h('div', { 'data-stub': 'hover-hint-reference' }, child?.()),
          h('div', { 'data-stub': 'hover-hint-content' }, content?.()),
        ])
    }),
  }
})

vi.mock('@sentry/vue', () => ({
  captureMessage: vi.fn(),
  captureException: vi.fn(),
}))

vi.mock('~/lib/analytics')
vi.mock('~/lib/vendors/intercom', () => ({
  showChatPopup: vi.fn(),
}))

vi.mock('@axiomhq/js', async () => {
  const { mockAxiomIngest } = await vi.importActual<typeof import('~/test-helpers')>('~/test-helpers')

  return {
    Axiom: class Axiom {
      ingest = mockAxiomIngest
    },
  }
})

const scopeIdRegex = /data-v-\w{8}c/
const allScopeIdRegex = /data-v-\w{8}/g

// replace scope id to fixed string
expect.addSnapshotSerializer({
  test(item) {
    return Boolean(typeof item === 'string' && item.match(scopeIdRegex))
  },
  serialize(val: string, config, indentation, depth, refs, printer) {
    return printer(val.replaceAll(allScopeIdRegex, 'data-v-scopeid'), config, indentation, depth, refs)
  },
})

// polyfill for headless UI menu
Element.prototype.compareDocumentPosition = () => Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC

// https://jestjs.io/docs/26.x/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

beforeAll(() => {
  server.listen({
    onUnhandledRequest(req) {
      console.error('Found an unhandled %s request to %s', req.method, req.url.href)
      if (req.method === 'POST' && req.url.href.endsWith('/graphql')) {
        console.error('POST body:', req.body)
      }
    },
  })
})

let randomSpy: MockInstance
let consoleSpy: MockInstance<(...args: Console[]) => void>

beforeEach(() => {
  randomSpy = vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.123456789)
  consoleSpy = vi.spyOn(console, 'warn')
})

afterEach(() => {
  randomSpy.mockRestore()
  cleanup()
  expect(consoleSpy).not.toBeCalledWith(expect.stringMatching(/Maximum recursive updates exceeded/))
})

afterAll(() => {
  server.close()
})
