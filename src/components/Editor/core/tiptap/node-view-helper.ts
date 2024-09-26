import type { NodeViewProps } from '@tiptap/core'

export function useBindNodeAttr<T = string>(props: Pick<NodeViewProps, 'node' | 'updateAttributes'>) {
  return (key: string) => {
    return computed({
      get(): T {
        return props.node.attrs[key]
      },
      set(value: T) {
        props.updateAttributes({ [key]: value })
      },
    })
  }
}

export function useNodeAttr<T = string>(props: Pick<NodeViewProps, 'node' | 'updateAttributes'>, key: string) {
  const bindAttr = useBindNodeAttr<T>(props)
  return bindAttr(key)
}
