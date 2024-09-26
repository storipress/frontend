export function getElement(node: Node): HTMLElement {
  if (node instanceof Text) {
    node = node.parentElement as HTMLElement
  }
  return node as HTMLElement
}
