import type { InjectionKey } from 'vue'

export const KEY: InjectionKey<'secret-key'> = Symbol('secret-key')
