import { isExtractableFile } from 'extract-files'

export function isContainFile(x: unknown): boolean {
  if (isExtractableFile(x)) {
    return true
  }
  if (Array.isArray(x)) {
    for (const value of x) {
      if (isContainFile(value)) {
        return true
      }
    }
    return false
  }
  if (typeof x === 'object' && x !== null) {
    for (const value of Object.values(x)) {
      if (isContainFile(value)) {
        return true
      }
    }
    return false
  }
  return false
}
