import { useDocumentVisibility } from '@vueuse/core'

export function onVisibleAgain(callback: () => void) {
  const visibility = useDocumentVisibility()
  watch(visibility, (visible, previous) => {
    if (visible === 'visible' && previous === 'hidden') {
      callback()
    }
  })
}
