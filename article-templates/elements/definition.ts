import type { InjectionKey, Ref } from 'vue'

interface Focus {
  x: number
  y: number
}

export interface DocState {
  approved: boolean
  ready: boolean
}

export interface PostMeta {
  title: string
  headline: string | null
  headline_focus: Focus
  headline_alt: string
  headline_caption: string
  featured: boolean
  credit_blacklist: string[]
  state: DocState
  scheduled: boolean
  published: boolean
  created_at: string
  blurb: string
  published_at?: Date | null
}

export interface Author {
  id: string
  name: string
  avatar?: string | null
}

export interface User extends Author {
  email: string
  role: string
  desks: string[]
  intercomHashIdentity?: string
}

export const HEADLINE_WRAPPER: InjectionKey<Ref<Element | undefined>> = Symbol('headline-wrapper')

export function useHeadlineWrapper() {
  return inject(HEADLINE_WRAPPER, ref(undefined))
}
