import type { Instance, Options } from '@popperjs/core'
import { createPopper } from '@popperjs/core'
import type { ComponentPublicInstance, Ref } from 'vue'
import { effectScope, isRef, onUnmounted, ref, watch } from 'vue'

export interface UsePopperReturn extends Pick<Instance, 'forceUpdate' | 'destroy'> {
  reference: Ref<ComponentPublicInstance | HTMLElement | undefined>
  popup: Ref<ComponentPublicInstance | HTMLElement | undefined>
  popper: Ref<Instance | undefined>
  update: () => void
}

export function usePopper(
  options: Partial<Options> | Ref<Partial<Options>>,
  show: Ref<boolean | undefined> = ref(false),
): UsePopperReturn {
  const reference = ref<ComponentPublicInstance | HTMLElement | undefined>()
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
      [show, popper],
      ([show, popper]) => {
        popper?.setOptions({
          modifiers: [
            ...(opts.value.modifiers ?? []),
            {
              name: 'eventListeners',
              enabled: show,
            },
          ],
        })
      },
      { immediate: true },
    )
  })

  onUnmounted(() => {
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

function toHTMLElement(element: ComponentPublicInstance | HTMLElement | undefined | null): HTMLElement | undefined {
  if (!element) {
    return
  }
  const node: Node = element instanceof Node ? element : element.$el
  if (node.nodeType === Node.ELEMENT_NODE) {
    return node as HTMLElement
  }
}
