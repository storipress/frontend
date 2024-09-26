export function raf() {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve)
  })
}
