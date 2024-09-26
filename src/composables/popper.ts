import type { Instance, Options } from '@popperjs/core'
import { createPopper } from '@popperjs/core'
import type { ComponentPublicInstance, Ref } from 'vue'
import { ref } from 'vue'
import { tryOnScopeDispose } from '@vueuse/core'
import { toHTMLElement } from './helpers'

export interface UsePopperReturn extends Pick<Instance, 'forceUpdate' | 'destroy'> {
  reference: Ref<ComponentPublicInstance | HTMLElement | undefined>
  popup: Ref<ComponentPublicInstance | HTMLElement | undefined>
  popper: Ref<Instance | undefined>
  update: () => void
}

export function usePopper(
  options: Partial<Options> | Ref<Partial<Options>>,
  disabled: Readonly<Ref<boolean>> = ref(false),
  reference: Ref<ComponentPublicInstance | HTMLElement | undefined> = ref(),
): UsePopperReturn {
  const popup = ref<ComponentPublicInstance | HTMLElement | undefined>()
  const popper = ref<Instance | undefined>()
  const opts = isRef(options) ? options : ref(options)

  const scope = effectScope()

  scope.run(() => {
    watch([reference, popup], ([reference, popup]) => {
      // make sure clean up existing popper
      popper.value?.destroy()

      const referenceEl = toHTMLElement(reference)
      const popupEl = toHTMLElement(popup)
      if (!referenceEl || !popupEl) {
        return
      }
      popper.value = createPopper(referenceEl, popupEl, opts.value)
    })

    watch(opts, (opts) => {
      popper.value?.setOptions(opts)
    })

    watch(
      [disabled, popper],
      ([disabled, popper]) => {
        popper?.setOptions({
          modifiers: [
            {
              name: 'eventListeners',
              enabled: !disabled,
            },
          ],
        })
      },
      { immediate: true },
    )
  })

  tryOnScopeDispose(() => {
    popper.value?.destroy()
  })

  return {
    reference,
    popup,
    popper,
    update: () => popper.value?.update(),
    forceUpdate: () => popper.value?.forceUpdate(),
    destroy: () => {
      scope.stop()
      popper.value?.destroy()
    },
  }
}
