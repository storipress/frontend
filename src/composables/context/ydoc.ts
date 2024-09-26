import invariant from 'tiny-invariant'
import type { InjectionKey } from 'vue'
import { inject, provide } from 'vue'
import type * as Y from 'yjs'

const KEY: InjectionKey<Y.Doc> = Symbol('YDoc')

export function useProvideYDoc(ydoc: Y.Doc) {
  provide(KEY, ydoc)
}

export function useInjectYDoc() {
  const ydoc = inject(KEY)
  invariant(ydoc, 'YDoc is not provided')
  return ydoc
}
