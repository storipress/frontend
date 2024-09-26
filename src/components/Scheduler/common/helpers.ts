interface TransformData {
  targetX: number
  targetY: number
  duration: number
}

export function setHelperStyle(el: HTMLElement | null, data?: TransformData) {
  if (!el) return

  if (!data) {
    el.style.transform = ''
    el.style.transitionDuration = ''
    return
  }

  el.style.transform = `translate3d(${data.targetX}px, ${data.targetY}px, 0) rotate(12deg)`
  el.style.transitionDuration = `${data.duration}ms`
}
