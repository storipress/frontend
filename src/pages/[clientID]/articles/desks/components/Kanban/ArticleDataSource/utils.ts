import { Array } from 'effect'
import { nanoid } from 'nanoid'

export function getStageKey(stageId: string, stageType: string) {
  return `${stageId}-${stageType}`
}

export function parseStageKey(stageKey: string): [id: string, type: string] {
  const temp = stageKey.split('-')
  return [temp[0], temp[1]]
}

export function arrayAppendOrReplace<T = unknown>(array: T[], newIndex: number, currentLength: number, item: T) {
  return newIndex >= currentLength ? Array.append(array, item) : Array.replace(array, newIndex, item)
}

const LOCAL_ID_PREFIX = 'tmp'

export function getLocalId() {
  return `${LOCAL_ID_PREFIX}-${nanoid()}`
}

export function isLocalId(id: string) {
  return id.startsWith(LOCAL_ID_PREFIX)
}
