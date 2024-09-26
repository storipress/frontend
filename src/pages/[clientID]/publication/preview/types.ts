export interface SetDataPayload<T> {
  path: string[]
  data: T
  breakpoint?: keyof Breakpoint
  skipHistory?: boolean
  noOverride?: boolean
}

export interface Breakpoint {
  xs: unknown
  md?: unknown
  lg?: unknown
}

export enum SelectorKey {
  publicationLogo = 'publicationLogo',
  articleTitle = 'articleTitle',
  articleSubheading = 'articleSubheading',
  articleBody = 'articleBody',
  heroPhoto = 'heroPhoto',
  publishDate = 'publishDate',
  articleCategory = 'articleCategory',
  authorName = 'authorName',
  description = 'description',
  ogDescription = 'ogDescription',
}

export type ArticleData = Partial<Record<SelectorKey, string | undefined>>
