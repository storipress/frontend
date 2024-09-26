const pool = new Map<string, HTMLElement[]>()

export function getIframe(key: string): HTMLElement | undefined {
  const list = pool.get(key) ?? []
  return list.shift()
}

export function putIframe(key: string, el: HTMLElement) {
  const list = pool.get(key) ?? []
  list.push(el)
  pool.set(key, list)
}
