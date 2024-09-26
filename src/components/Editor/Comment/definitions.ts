import type { dayjs } from '~/lib/dayjs'
import type { ThreadFragment } from '~/graphql-operations'

export type RawThread = ThreadFragment
export type RawNote = RawThread['notes'][0]
export type RawUser = RawNote['user']

export interface User extends Omit<RawUser, 'avatar' | 'full_name'> {
  name: string
  avatar: string
}

export interface Note extends Omit<RawNote, 'user' | 'thread'> {
  id: string
  author: User
  content: string
  createdAt: dayjs.Dayjs
}

export interface Thread extends Omit<RawThread, 'notes'> {
  resolvedAt?: dayjs.Dayjs
  resolved: boolean
  notes: Note[]
  top?: number
  from?: number
}

export const separatedLine = '#@#@#@#@#@#@#@#@'
