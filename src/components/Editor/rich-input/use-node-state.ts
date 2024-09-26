import type { Editor } from '@tiptap/vue-3'
import { NODE_STATE_KEYS, type RichActionFormat } from '../core/tiptap/menu/definitions'

type ArrayValue<T extends ReadonlyArray<unknown>> = T[number]

export type NodeState = Record<ArrayValue<typeof NODE_STATE_KEYS>, boolean>

export function useNodeState(props: { editor: Editor }) {
  const nodeState = ref<NodeState>({
    bold: false,
    italic: false,
    underline: false,
    link: false,
    comment: false,
  })

  function isFormatActive(maybeFormat: RichActionFormat | string): boolean {
    let key
    let options: Record<string, unknown> | undefined = {}
    if (typeof maybeFormat === 'string') {
      key = maybeFormat
    } else {
      key = maybeFormat.formatName || maybeFormat.key
      options = maybeFormat.options
    }
    return props.editor.isActive(key, options)
  }

  function updateState() {
    const text: Record<string, boolean> = {}
    for (const key of NODE_STATE_KEYS) {
      text[key] = isFormatActive(key)
    }

    nodeState.value = {
      ...nodeState.value,
      ...text,
    }
  }

  return {
    nodeState,
    updateState,
    isFormatActive,
  }
}
