import { webkit } from '@marp-team/marpit-svg-polyfill'

export function usePolyfill() {
  // use to scale svg in safari
  let stop = false
  const observer = () => {
    webkit()
    if (!stop) {
      window.requestAnimationFrame(observer)
    }
  }

  onMounted(() => {
    if (window.safari !== undefined) {
      observer()
    }
  })
  onBeforeUnmount(() => {
    stop = true
  })
}
