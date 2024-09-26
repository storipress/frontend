import { defineStore } from 'pinia'
import { noop } from 'lodash'
import type { ArticleInjected } from './inject'

export interface SetData {
  path: string[]
  data: Record<string, unknown>
}

type ArticleData = Pick<
  ArticleInjected,
  | 'site'
  | 'title'
  | 'blurb'
  | 'desk'
  | 'authors'
  | 'date'
  | 'content'
  | 'headlineAlt'
  | 'headlineCaption'
  | 'headlineFocus'
  | 'headlineURL'
>

const INJECTED_DEFAULT: ArticleInjected = {
  section: {
    hover: null,
    selected: null,
  },
  elements: {},
  selectable: false,
  editable: false,
  preview: true,
  scale: 1,

  site: { name: '' },
  title: '',
  blurb: '',
  desk: '',
  logo: '',
  content: '',
  authors: [],
  date: new Date(),
  headlineURL: null,
  headlineFocus: { x: 0, y: 0 },
  headlineAlt: '',
  headlineCaption: '',
  editor: null,
  profile: {},
  bus: null,

  createImageURL: () => '',
  uploadImage: () => Promise.resolve(''),

  readStyle: () => ({}),
  setElementStyle: noop,
  setSectionHover: noop,
  setSectionSelect: noop,
  addColor: noop,
  registerElementDefault: noop,
}

const useProviderStore = defineStore('provider', () => {
  return {
    ...INJECTED_DEFAULT,
  }
})

export function createProvider(data: ArticleData): ArticleInjected {
  const store = useProviderStore()
  // FIXME: no idea why $patch is not working
  Object.assign(store, data)
  return store
}
