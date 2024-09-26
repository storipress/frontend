import { createSharedDisposableComposable } from './shared-disposable-composable'

/**
 * prevent leaving the page
 * @returns clean up function
 */
export function usePreventLeave() {
  return useEventListener(
    'beforeunload',
    (event) => {
      event.preventDefault()
    },
    { capture: true },
  )
}

/**
 * prevent leaving the page but only add a listener once
 */
export const useSharedPreventLeave = createSharedDisposableComposable(usePreventLeave)
