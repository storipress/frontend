import type { Options } from '@popperjs/core'
import { noop } from 'lodash-es'
import type { Ref } from 'vue'
import { readonly, ref } from 'vue'
import type { MaybeElementRef } from '@vueuse/core'
import { onClickOutside, whenever } from '@vueuse/core'
import { not } from '@vueuse/math'
import type { UsePopperReturn } from './popper'
import { usePopper } from './popper'

interface UseTogglePopupOptions {
  /**
   * Options passed to the popper.
   */
  options: Partial<Options> | Ref<Partial<Options>>
  /**
   * initial value of the open
   */
  initialOpen?: boolean
  /**
   * ignore element list for click outside event
   */
  ignore?: MaybeElementRef[]
  /**
   * Callback when click outside, or pass `false` to disable.
   */
  onClickOutside?: (() => void) | false
}

interface UseTogglePopupReturn extends UsePopperReturn {
  open: Ref<boolean>
  togglePopup: () => void
}

export function useTogglePopup({
  options,
  initialOpen = false,
  ignore = [],
  onClickOutside: handleClickOutside = noop,
}: UseTogglePopupOptions): UseTogglePopupReturn {
  const open = ref(initialOpen)
  const popper = usePopper(options, readonly(not(open)))

  // update popper position when open to be sure it's positioned correctly
  whenever(
    open,
    () => {
      popper.update()
    },
    {
      immediate: true,
      flush: 'post',
    },
  )

  // use `false` to disable click outside
  if (handleClickOutside !== false) {
    onClickOutside(
      popper.popup,
      () => {
        if (!open.value) {
          return
        }

        handleClickOutside()
        open.value = false
      },
      { ignore: [popper.reference, ...ignore] },
    )
  }

  return {
    ...popper,
    open,
    togglePopup: () => {
      open.value = !open.value
    },
  }
}
