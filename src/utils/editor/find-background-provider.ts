import { IroColor } from '@irojs/iro-core'

const ALPHA_THRESHOLD = 0.2

export function findBackgroundProvider(el: Element): Element {
  while (el.parentElement) {
    const style = window.getComputedStyle(el)
    const { alpha } = new IroColor(style.backgroundColor)
    if (alpha > ALPHA_THRESHOLD) {
      return el
    }
    el = el.parentElement
  }
  return el
}
