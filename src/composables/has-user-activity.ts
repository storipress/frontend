import type { MaybeElementRef } from '@vueuse/core'
import { useEventListener, useFocusWithin } from '@vueuse/core'

export function useHasUserActivity(root: MaybeElementRef<HTMLElement | undefined>): Ref<boolean> {
  const hasUserActivity = ref(false)
  const { focused } = useFocusWithin(root)

  function setHasUserActivity() {
    hasUserActivity.value = true
  }

  whenever(focused, setHasUserActivity)

  useEventListener(root, 'click', setHasUserActivity, { capture: true, passive: true })
  useEventListener(root, 'keydown', setHasUserActivity, { capture: true, passive: true })
  useEventListener(root, 'mouseover', setHasUserActivity, { capture: true, passive: true })

  return hasUserActivity
}
