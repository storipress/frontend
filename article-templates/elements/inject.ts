import { Evt } from 'evt'
import { constant, noop } from 'lodash-es'
import { defineComponent, inject } from 'vue'

type RegisterFunction = (path: string[], props: Record<string, unknown>) => void

type Maybe<T> = T | null

export type Events = [event: 'focus', name: string] | [event: 'preview', value: void]

interface ElementInfo {
  name: string
  display?: string
  path: string[]
}

interface ElementState {
  hover: Maybe<ElementInfo>
  selected: Maybe<ElementInfo>
}

interface Relevance {
  title: string
  blurb: string
}

export interface Focus {
  x: number
  y: number
}

export interface Author {
  name: string
  url: string
  full_name: string
  avatar: string
}

export interface FocalInfo {
  original: Focus
  url: string
}

export interface SetData<T> {
  path: string[]
  data: T
  skipHistory?: boolean
  breakpoint?: string
}

export interface ArticleInjected {
  // select status
  section: ElementState
  // dropcap & blockquote style
  elements: Record<string, string>

  // flags
  selectable: boolean
  editable: boolean
  preview: boolean
  isCustomLayout: boolean
  customLayoutUrl?: string
  // article data
  title: string
  blurb: string
  desk: string
  authors: Author[]
  date: Date
  content: string
  headlineURL: string | null
  cover: {
    url: string
  }
  headlineFocus: Focus
  headlineAlt: string
  headlineCaption: string
  relevances: Relevance[]

  // style API
  readStyle: (path: readonly string[]) => Record<string, unknown>
  setElementStyle: (payload: SetData<Record<string, unknown>>) => void
  registerElementDefault: RegisterFunction

  // Not in used

  // set hover/selected state
  setSectionHover: (info: ElementInfo | null) => void
  setSectionSelect: (info: ElementInfo | null) => void

  // editor core
  editor: object | null
  // current author profile
  profile: object
  // event bus to switch to next input
  bus: Evt<Events> | null

  // image API
  createImageURL: (url: string, edits?: Record<string, string>) => string
  uploadImage: (file: File) => Promise<{ url: string; width: number; height: number }>

  // unused
  addColor?: (info: { path: string[]; style: Record<string, unknown> }) => void

  // CommonInjected
  site: {
    name: string
    facebook?: null | string
    twitter?: null | string
  }
  scale: number
  logo: string
}

export interface Injected {
  $element: ArticleInjected
}

export const INJECTED_DEFAULT: ArticleInjected = {
  section: {
    hover: null,
    selected: null,
  },
  elements: {},
  selectable: true,
  editable: false,
  preview: false,
  isCustomLayout: false,
  customLayoutUrl: '',
  scale: 1,
  logo: '',

  site: { name: '' },
  title: '',
  blurb: '',
  desk: '',
  authors: [],
  date: new Date(),
  content: '',
  headlineURL: null,
  headlineFocus: { x: 0, y: 0 },
  headlineAlt: '',
  headlineCaption: '',
  editor: null,
  profile: {},
  relevances: [],
  bus: Evt.create<Events>(),

  createImageURL: constant(''),
  uploadImage: constant(Promise.resolve({ url: '', width: 0, height: 0 })),

  readStyle: constant({}),
  setElementStyle: noop,
  setSectionHover: noop,
  setSectionSelect: noop,
  addColor: noop,
  registerElementDefault: noop,
}

export const BaseElement = defineComponent({
  inject: {
    $element: {
      default: constant(INJECTED_DEFAULT),
    },
  },
})

export function useArticleElement() {
  // wrap in ref to prevent auto unwrap
  return inject<ArticleInjected>('$element', INJECTED_DEFAULT)
}
