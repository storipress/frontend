import type { Instance, Props } from 'tippy.js'
import createTippy from 'tippy.js'
import type { MaybeElement } from '@vueuse/core'
import { toHTMLElement } from './helpers'

export interface UseTippyInput {
  options: Partial<Props>
}

export function useTippy({ options }: UseTippyInput) {
  const reference = ref<MaybeElement>()
  const popup = ref<MaybeElement>()
  const instance = ref<Instance<Props> | null>(null)

  watch([reference, popup], ([reference, popup]) => {
    const referenceEl = toHTMLElement(reference)
    const popupEl = toHTMLElement(popup)
    if (!referenceEl || !popupEl) {
      return
    }

    if (instance.value) {
      instance.value.destroy()
    }

    instance.value = createTippy(referenceEl, {
      content: popupEl,
      ...options,
    })
  })

  return {
    reference,
    popup,
    instance,
  }
}
