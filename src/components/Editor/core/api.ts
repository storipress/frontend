import type { Selection } from 'prosemirror-state'

import type { CommentThread } from './tiptap/comment/types'
import type { Pos } from './types'

export type { Pos } from './types'

type Maybe<T> = T | null
type Json = Record<string, unknown>
export interface EmbedMeta {
  url: string
  html: string
  aspectRadio: number
  maxHeight?: number
  maxWidth?: number
}

export interface BookmarkMeta extends EmbedMeta {
  author: Maybe<string>
  description: Maybe<string>
  icon: Maybe<string>
  publisher: Maybe<string>
  title: Maybe<string>
  thumbnail: Maybe<string>
}

export interface EditorUser {
  id: string
  name: string
  avatar: string
  color: string
}

export interface Client {
  cid: string
  user: EditorUser
}

export interface Cursor extends Client {
  selection: Selection
  color: string
}

export interface UpdateCursor extends Omit<Client, 'user' | 'cid'> {
  selection: Json
}

export interface User {
  id: string
  email: string
  name: string
  avatar: string
  role: string
  desks: string[]
}

interface DisplayUser {
  id: string
  name: string
  avatar: string
}

export interface CreateCommentParam {
  content: string
  position: Pos
}

export interface RemoveCommentParam {
  id: string
}

export type ImageInfo = string

export interface UploadReturnInfo {
  url: string
  width: number
  height: number
}
export interface Thread {
  id: string
  resolved: boolean
}

export interface ThreadCreated extends Thread {
  position: Pos
}

export interface Note {
  id: string
  thread: string
  content: string
  user: DisplayUser
  createdAt: Date
}

export type NoteEdited = Pick<Note, 'id' | 'content'>
export type NoteRemoved = Pick<Note, 'id'>

export interface PendingComment {
  id: string
  top: number
  position: { from: number; to: number }
  displayTime: string
}

export interface ThreadTop {
  id: string
  top: number
}

export interface API {
  uploadImage(file: File): Promise<UploadReturnInfo>
  createImageURL(info: ImageInfo, edits?: Json): string
  uploadImageFromURL(url: string): Promise<string>
  getBookmarkMeta(url: string, type: string): Promise<BookmarkMeta>
  getThreads(): Promise<CommentThread[]>

  createComment: (param: CreateCommentParam) => void
  removeComment: (param: RemoveCommentParam) => void
  resolveComment: (id: string) => void
  createPendingComment: (pending: PendingComment) => void
  removePendingComment: () => void
}

export interface DocState {
  approved: boolean
  ready: boolean
}

interface Focus {
  x: number
  y: number
}

export interface PostMeta {
  title: string
  headline: Maybe<string>
  headline_focus: Focus
  headline_alt: string
  featured: boolean
  credit_blacklist: string[]
  state: DocState
  created_at: string
  blurb: string
}

let api: API

export function hasAPI(): boolean {
  return Boolean(api)
}

export function injectAPI(obj: API) {
  api = obj
}

export function getAPI(): API {
  return api
}
