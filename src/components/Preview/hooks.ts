import { computed } from 'vue'
import type { ArticleInjected } from '@article-templates/elements/inject'
import { INJECTED_DEFAULT } from '@article-templates/elements/inject'
import type { MaybeRef } from '@vueuse/core'
import type { StyleTree } from '~/lib/dynamic-style'
import { createStyleTree, useStyleTree, useStyleTreeAPI, useStyleTreeLayer, wrapUserTree } from '~/lib/dynamic-style'
import { aliasParagraph, shiftH1H2 } from '~/lib/dynamic-style/patch-style-tree'

export function usePreview(data: ArticleInjected) {
  provide('$element', data)
}

interface UsePreviewDataInput {
  data?: Partial<ArticleInjected>
  userStyleTree?: MaybeRef<StyleTree>
}

export function usePreviewData({ data = {}, userStyleTree = createStyleTree() }: UsePreviewDataInput) {
  const baseTree = useStyleTree()
  const userTree = useStyleTreeAPI(ref(userStyleTree))
  const tree = useStyleTreeLayer(computed(() => [baseTree.tree.value, wrapUserTree(shiftH1H2(userTree.tree.value))]))
  const providedData: ArticleInjected = {
    ...INJECTED_DEFAULT,
    ...data,
    setElementStyle: ({ path, data }) => {
      userTree.insertToTree(path, data)
    },
    registerElementDefault(path, data) {
      baseTree.insertToTree(path, data)
    },
  }
  usePreview(providedData)

  return computed(() => {
    return aliasParagraph(tree.value)
  })
}
