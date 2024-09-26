import type { MaybeRef } from '@vueuse/core'
import type { Ref } from 'vue'
import { produce } from 'immer'
import { shallowRef } from 'vue'
import type { Breakpoint, StyleTree } from './style-tree'
import { assertStyleTree, createStyleTree, insertToTree, mergeTree } from './style-tree'

export interface UseStyleTreeReturn {
  tree: Ref<StyleTree>
  insertToTree: (path: string[], data: Record<string, unknown>, breakpoint?: keyof Breakpoint) => void
}

export function useStyleTree(initialTree: StyleTree = createStyleTree()): UseStyleTreeReturn {
  const tree = shallowRef(assertStyleTree(initialTree))

  return useStyleTreeAPI(tree)
}

export function useStyleTreeAPI(tree: Ref<StyleTree>): UseStyleTreeReturn {
  return {
    tree,
    insertToTree(path: readonly string[], data: Record<string, unknown>, breakpoint?: keyof Breakpoint) {
      tree.value = produce(tree.value, (tree) => insertToTree(tree, path, data, breakpoint))
    },
  }
}

export function useStyleTreeLayer(layers: MaybeRef<StyleTree[]>) {
  const treeLayers = ref(layers)

  const tree = computed(() => treeLayers.value.reduce((base, layer) => mergeTree(base, layer), createStyleTree()))

  return tree
}
