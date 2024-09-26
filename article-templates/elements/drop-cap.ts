import { firstCharacterIndex, inRect, rectRelativeTo } from './utils'

export function findDropcap($el: Element, pos?: { x: number; y: number }) {
  const range = document.createRange()
  const text = $el.firstChild as Node
  const length = firstCharacterIndex(text.textContent ?? '')
  range.setStart(text, 0)
  range.setEnd(text, length)
  const parentRect = $el.getBoundingClientRect()
  const elementRect = range.getBoundingClientRect()
  const rect = rectRelativeTo(elementRect, parentRect)
  const res = {
    kind: 'drop-cap',
    rect,
  }
  if (inRect(rect, pos)) {
    return res
  }
}
