export function filterAllList<T>(list: T[]) {
  const maxLength = 50
  const skipLength = Math.ceil(list.length / maxLength)
  let currentIndex = 0
  const filteredList = []
  while (currentIndex < list.length) {
    filteredList.push(list[currentIndex])
    currentIndex += skipLength
  }
  return filteredList as T[]
}
