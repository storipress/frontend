export function listener(event: MessageEvent) {
  if (typeof event.data !== 'object' || !event.data) {
    return
  }
  const { $$type, rect, id } = event.data
  if ($$type !== 'storipress-iframe-resize') {
    return
  }
  const $target = document.querySelector(`#preview-${id}`)
  if (typeof $target?._iframeResize === 'function') {
    $target._iframeResize(rect)
  }
}
