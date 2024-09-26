export interface Pos {
  from: number
  to: number
}

export interface WordStatistics {
  words: number
  paragraphs: number
  characters: number
  spaces: number
  images: number
}

export interface EditorUser {
  id: string
  name: string
  avatar: string
  color: string
}

export interface Client {
  clientID: string
  user: EditorUser
}
