import invariant from 'tiny-invariant'
import type { UnwrapRef } from 'vue'
import type { Doc } from 'yjs'
import { isEqual } from 'lodash-es'
import { useInjectYDoc } from './context'

export interface UseCRDTMapInput {
  ydoc?: Doc
  fieldName: string
  key: string
  shallow?: boolean
}

export function useCRDTMap<T>({ ydoc = useInjectYDoc(), fieldName, key, shallow }: UseCRDTMapInput) {
  invariant(ydoc, 'no ydoc')
  const map = ydoc.getMap(fieldName)
  const createRef = shallow ? shallowRef : ref
  const value = createRef<T>(map.get(key) as T)
  map.observe(({ keysChanged }) => {
    if (keysChanged.has(key)) {
      const nextValue = map.get(key) as UnwrapRef<T>
      if (isEqual(nextValue, value.value)) {
        return
      }
      value.value = nextValue
    }
  })

  watch(value, (val, old) => {
    if (isEqual(val, old)) {
      return
    }
    map.set(key, val)
  })

  return extendRef(value, {
    getMap() {
      return map.toJSON()
    },
  })
}
