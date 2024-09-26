import type { InjectionKey, UnwrapNestedRefs } from 'vue'

export interface MessageInfo {
  id: number
  show: boolean
  message: string
  closable: boolean
  close: () => void
}

export type ProvideContentInterface = UnwrapNestedRefs<{
  warn: (message: string, config?: { timeout?: number; closable: boolean }) => () => void
}>

export const key = Symbol('warning-notification') as InjectionKey<ProvideContentInterface>
