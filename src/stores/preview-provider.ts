import { acceptHMRUpdate, defineStore } from 'pinia'
import { noop } from 'lodash-es'
import type { ArticleInjected } from '@article-templates/elements/inject'
import { DEFAULT_TEMPLATE } from '@article-templates/templates'
import { useEditorStore } from './editor'
import type { StyleTree } from '~/lib/dynamic-style'
import { createStyleTree, useStyleTree, useStyleTreeLayer, wrapUserTree } from '~/lib/dynamic-style'

// TODO: refactor this in comment PR
import { useEditorAPI } from '~/pages/[clientID]/articles/[id]/edit/components/api'

export interface SetData {
  path: string[]
  data: Record<string, unknown>
}

type ArticleData = Partial<
  Pick<
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
> & { templateName: string; userTree: StyleTree }

const INJECTED_DEFAULT: ArticleInjected = {
  section: {
    hover: null,
    selected: null,
  },
  elements: {},
  selectable: false,
  editable: true,
  preview: true,
  isCustomLayout: false,
  scale: 1,
  logo: '',

  site: { name: '' },
  title: '',
  blurb: '',
  desk: '',
  content: '',
  authors: [],
  date: new Date(),
  headlineURL: null,
  headlineFocus: { x: 0, y: 0 },
  headlineAlt: '',
  headlineCaption: '',
  editor: null,
  profile: {},
  relevances: [],
  bus: null,

  createImageURL: () => '',
  uploadImage: () => Promise.resolve({ url: '', width: 0, height: 0 }),

  readStyle: () => ({}),
  setElementStyle: noop,
  setSectionHover: noop,
  setSectionSelect: noop,
  addColor: noop,
  registerElementDefault: noop,
}

export const useProviderStore = defineStore(
  'provider',
  () => {
    const baseTree = useStyleTree()
    const userTree = useStyleTree()
    const templateName = ref(DEFAULT_TEMPLATE)

    const tree = useStyleTreeLayer(computed(() => [baseTree.tree.value, wrapUserTree(userTree.tree.value)]))
    const editorStore = useEditorStore()
    const { uploadImage, createImageURL } = useEditorAPI()

    watch(
      templateName,
      () => {
        baseTree.tree.value = createStyleTree()
        userTree.tree.value = createStyleTree()
      },
      { flush: 'sync' },
    )

    return {
      templateName,
      tree,
      userTree: userTree.tree,
      customFields: {},
      height: 800,
      ...INJECTED_DEFAULT,
      uploadImage(file: File) {
        return uploadImage(editorStore.id, file)
      },
      createImageURL,
      setElementStyle({ path, data }: SetData) {
        userTree.insertToTree(path, data)
      },
      registerElementDefault(path: string[], data: Record<string, unknown>) {
        baseTree.insertToTree(path, data)
      },
    }
  },
  { sync: { enabled: true, ignore: ['tree'] } },
)

export function createProvider(
  data: ArticleData,
): ArticleInjected & { templateName: string; height: number; tree: StyleTree } {
  const store = useProviderStore()
  // FIXME: no idea why $patch is not working
  Object.assign(store, data)
  return store
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProviderStore, import.meta.hot))
}
