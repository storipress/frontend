import type { MaybeRef } from '@vueuse/core'
import { toRefs } from '@vueuse/core'
import type { ConfirmOptionInterface } from './definition'
import { key } from './definition'

export type { ConfirmOptionInterface }

export function useConfirmFunction(options: MaybeRef<ConfirmOptionInterface[]>): (() => Promise<boolean>)[] {
  const provideAPI = inject(key)
  const optionsRef = ref(options)

  return toRefs(optionsRef).map((option) => {
    return () => {
      return provideAPI?.confirm(option) ?? Promise.resolve(false)
    }
  })
}

export function useConfirmModal() {
  return inject(key)
}
