export interface Rect {
  left: number
  right: number
  top: number
  bottom: number
}

export function inRect(rect: Rect, pos?: { x: number; y: number }) {
  if (!pos) {
    return true
  }
  // if (rect.left < 0 || rect.right < 0 || rect.top < 0 || rect.bottom < 0) {
  //   return false
  // }

  const { x, y } = pos
  return rect.left <= x && rect.right >= x && rect.top <= y && rect.bottom >= y
}

export function rectRelativeTo(elementRect: DOMRect, parentRect: DOMRect) {
  return {
    left: elementRect.left - parentRect.left,
    right: elementRect.right - parentRect.left,
    top: elementRect.top - parentRect.top,
    bottom: elementRect.bottom - parentRect.top,
  }
}

export function firstCharacterIndex(text: string) {
  const content = text.trimStart()
  return text.length - content.length + 1
}
