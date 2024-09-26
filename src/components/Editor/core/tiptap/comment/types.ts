import type { Pos } from '../../types'

interface DisplayUser {
  id: string
  name: string
  avatar: string
}

interface CommentDisplay {
  id: string
  author: DisplayUser
  content: string
  displayTime: string
  time: string
}

export interface ThreadDisplay {
  from: number
  top: number
  id: string
  comments: CommentDisplay[]
}

export interface PendingComment {
  id: string
  top: number
  position: Pos
  displayTime: string
  callback: (res: string | null) => void
}

interface Comment {
  id: string
  author: DisplayUser
  content: string
  time: Date
}

export interface CommentThread {
  id: string
  position: Pos
  resolved: boolean
  comments: Comment[]
}
