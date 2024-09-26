type Maybe<T> = T | null
export interface PhotoButtonProps {
  prefix?: string
  iconName: string
  description?: string
  isUpload?: boolean
  isMultiple?: boolean
  onClick(e?: Event): void
}

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
