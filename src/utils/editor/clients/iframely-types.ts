export interface Thumbnail {
  url?: string
  width?: number
  height?: number
}

export interface OEmbed {
  type: 'photo' | 'video' | 'link' | 'rich'
  version?: string
  title?: string
  author_name?: string
  author_url?: string
  provider_name?: string
  provider_url?: string
  cache_age?: number
  thumbnail_url?: string
  thumbnail_height?: number
  thumbnail_width?: number
}

export interface IFramelyMedia {
  width?: number
  height?: number
  'aspect-radio'?: number
  'padding-bottom'?: number
  'max-width'?: number
  'max-height'?: number
}

export interface IFramelyLink {
  href: string
  media?: IFramelyMedia
  rel: string[]
  type: string
}

export interface IFramelyMeta {
  title: string
  description: string
  author_url: string
  author: string
  site: string
  canonical: string
  keywords: string
}

export interface IFramely {
  url: string
  html: string
  iframe0?: string
  rel: string[]
  meta: IFramelyMeta
  links: Record<'app' | 'player' | 'icon' | 'thumbnail', IFramelyLink[] | undefined>
}

export interface IframelyError {
  status: number
  error: string
}
