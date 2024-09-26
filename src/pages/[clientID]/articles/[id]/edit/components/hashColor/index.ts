function hashCode(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }
  return hash
}

export function pickColor(str: string) {
  const hashColor = hashCode(str) % 360
  return `hsl(${hashColor > 0 ? hashColor : 0}, 50%, 50%)`
}
