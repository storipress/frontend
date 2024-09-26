import { onBeforeUnmount } from 'vue'

export function useBreakpointChange(callback: () => void) {
  // this is ok because template should only have these breakpoint
  const sm = window.matchMedia('(min-width: 375px)')
  const md = window.matchMedia('(min-width: 768px)')
  const lg = window.matchMedia('(min-width: 1070px)')

  sm.addEventListener('change', callback)
  md.addEventListener('change', callback)
  lg.addEventListener('change', callback)

  callback()

  onBeforeUnmount(() => {
    sm.removeEventListener('change', callback)
    md.removeEventListener('change', callback)
    lg.removeEventListener('change', callback)
  })
}
