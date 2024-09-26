import type { Ref } from 'vue'

// import { inject, ref } from 'vue'
import { constant, noop } from 'lodash'

// import type { VueConstructor } from 'vue'
// import type Vue from 'vue'

import type { CommonInjected } from '../common/common-element'
import type { Article } from './types'

type Maybe<T> = T | null

export interface ElementInfo {
  path: string[]
}

export interface InsertInfo {
  at: number
  offset: number
}

interface SetData<T> {
  path: string[]
  data: T
  skipHistory?: boolean
  noOverride?: boolean
  breakpoint?: string
}

interface AddColorPayload extends SetData<Record<string, unknown>> {
  id: string
}

export interface BlockInfo {
  id: string
  order: number
  top: number
  height: number
}

interface BlockState {
  type: string
  color: string
  desks: Record<string, string>
}

interface HighlightInfo {
  id: string
  height: number
}

interface ImageSwapInfo {
  path: string[]
}

export interface Desk {
  name: string
  slug: string
  url: string
}

export interface Page {
  id: string
  name: string
  slug: string
  url: string
}

export interface AddDeskPayload {
  id: string
  order: number
}

interface DataSource {
  useDataSource(desk: Ref<string>, blockId: string, slotId: symbol): Ref<Article>
}

interface SpacingConfig {
  width: number | string | Record<string, unknown>
  max?: number | string | Record<string, unknown>
  min?: number | string | Record<string, unknown>
}

export interface BlockInjected extends CommonInjected {
  desks: Desk[]
  pages: Page[]

  dataSource: DataSource

  version: number

  selectedElement: Maybe<ElementInfo>
  hoveredElement: Maybe<ElementInfo>
  selectedBlock: Maybe<BlockInfo & BlockState>
  highlightedBlock: Maybe<HighlightInfo>
  insertPoint: Maybe<InsertInfo>
  isPreview: boolean
  isPreviewHtml: boolean

  texts: Record<string, Record<string, string>>
  images: Record<string, Record<string, string>>
  blocks: string[]
  blockStates: Record<string, BlockState>

  readStyle: (path: readonly string[]) => Record<string, unknown>
  addColor: (payload: AddColorPayload) => void
  addDesk: (payload: AddDeskPayload) => void
  setSpacing: (width: SpacingConfig) => void
  setInsert: (info: Maybe<InsertInfo>) => void
  setSelectedBlock: (info: Maybe<BlockInfo>) => void
  setIsPreviewHtml: (isPreviewHtml: boolean) => void
  setElementHover: (info: Maybe<ElementInfo>) => void
  setElementSelect: (info: Maybe<ElementInfo>) => void
  setElementText: (payload: SetData<string>) => void
  setElementStyle: (payload: SetData<Record<string, unknown>>) => void
  setElementImage: (payload: SetData<string>) => void
  setImageSwapInfo: (info: Maybe<ImageSwapInfo>) => void
  uploadImage: (file: File) => Promise<string>
}

interface Storipress {
  clientID: string
}

export interface Injected {
  $storipress: Storipress
  $element: BlockInjected
}

export const INJECTED_DEFAULT: BlockInjected = {
  selectedElement: null,
  hoveredElement: null,
  scale: 1,
  version: 0,
  logo: '',
  site: { name: '', facebook: null, twitter: null },

  dataSource: {
    useDataSource: constant(
      ref({
        title: '',
        headline: '',
        desk: '',
        deskUrl: '',
        authors: [],
        blurb: '',
        url: 'https://example.com',
        time: new Date(),
      }),
    ),
  },
  desks: [],
  pages: [],
  texts: {},
  images: {},
  insertPoint: null,
  blocks: [],
  blockStates: {},
  highlightedBlock: null,
  isPreview: true,
  isPreviewHtml: false,
  selectedBlock: null,
  readStyle: constant({}),
  setInsert: noop,
  addColor: noop,
  addDesk: noop,
  setSpacing: noop,
  setSelectedBlock: noop,
  setIsPreviewHtml: noop,
  setElementHover: noop,
  setElementSelect: noop,
  setElementStyle: noop,
  setElementText: noop,
  setElementImage: noop,
  setImageSwapInfo: noop,
  uploadImage: () => Promise.resolve(''),
}

export const BaseElement = defineComponent({
  inject: {
    $element: {
      default: constant(INJECTED_DEFAULT),
    },
  },
})

// type withElementAndID = VueConstructor<Vue & Injected & { blockId: string }>

export const BlockChild = defineComponent({
  extends: BaseElement,
  inject: ['blockId'],
})

export function useElement(): Ref<BlockInjected> {
  return ref(inject('$element', INJECTED_DEFAULT))
}
