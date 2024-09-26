export function raf(): Promise<number> {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve)
  })
}
