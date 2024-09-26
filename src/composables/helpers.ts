import type { MaybeElement } from '@vueuse/core'

export function toHTMLElement(element: MaybeElement): HTMLElement | undefined {
  if (!element) {
    return
  }

  const node: Node = element instanceof Node ? element : element.$el
  if (node.nodeType === Node.ELEMENT_NODE) {
    return node as HTMLElement
  }
}
