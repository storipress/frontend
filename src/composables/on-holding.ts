import { debounce } from 'lodash-es'
import type { MaybeElementRef } from '@vueuse/core'

export interface OnHoldingOptions {
  /**
   * The number of milliseconds to wait before triggering the `onHolding` event.
   * @default 150
   * @type number
   * @memberof OnHoldingOptions
   */
  delay?: number
  /**
   * The ignore elements.
   */
  ignore?: MaybeElementRef[]
}

export function onHolding(
  listener: (event: PointerEvent) => void,
  { delay = 150, ignore = [] }: OnHoldingOptions = {},
) {
  // use lodash debounce for cancel
  const trigger = debounce(listener, delay)
  useEventListener(
    'pointerdown',
    (event) => {
      if (ignore.length > 0) {
        const composedPath = event.composedPath()
        const ignoreElements = new Set(ignore.map((el) => unrefElement(el)))
        const isIgnored = composedPath.some((element) => ignoreElements.has(element as HTMLElement))
        if (isIgnored) {
          return
        }
      }

      trigger(event)
    },

    { passive: true },
  )
  useEventListener(
    'pointerup',
    () => {
      trigger.cancel()
    },
    { passive: true },
  )
}
