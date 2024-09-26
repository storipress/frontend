import { identity, isObject } from 'lodash'

interface SpecialObject {
  $$type: string
  value: unknown
}

function isSpecialObject(x: unknown): x is SpecialObject {
  if (isObject(x) && '$$type' in x) {
    return true
  }
  return false
}

export function serialize(obj: unknown) {
  return JSON.stringify(obj, (_, value) => {
    if (value instanceof Map) {
      return {
        $$type: 'map',
        value: [...value.entries()],
      }
    }
    if (value instanceof Set) {
      return {
        $$type: 'set',
        value: [...value.values()],
      }
    }
    if (Array.isArray(value) && Object.isFrozen(value)) {
      return {
        $$type: 'freezeArray',
        value: [...value],
      }
    }
    if (isObject(value) && Object.isFrozen(value)) {
      return {
        $$type: 'freeze',
        value: { ...value },
      }
    }
    return value
  })
}

function deserializeAs(Ctor: new (x: any) => unknown): (x: unknown) => unknown {
  return (x) => new Ctor(x)
}

const deserializeSpecialObject: Record<string, (x: unknown) => unknown> = {
  map: deserializeAs(Map),
  set: deserializeAs(Set),
  freeze: Object.freeze,
  freezeArray: Object.freeze,
}

export function deserialize<T>(json: string): T {
  return JSON.parse(json, (_, value) => {
    if (isSpecialObject(value)) {
      const des = deserializeSpecialObject[value.$$type] ?? identity
      return des(value.value)
    }
    return value
  })
}
