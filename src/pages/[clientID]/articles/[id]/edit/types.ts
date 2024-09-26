import type { LayoutData } from '~/components/Manager/StylePicker'
import type { ArticlePlan } from '~/graphql-operations'

export interface Avatar {
  id: string
  name: string
  src: string
  color: string
}

export interface Tag {
  id: string
  name: string
}

export interface TDesk {
  id: string
  name: string
}

export interface Author {
  id: string
  name: string
  avatar: string
  email: string
  full_name: string
}

export interface InitAuthor {
  id: string
  full_name: string
  email: string
}

export interface User {
  id: string
  name: string
  avatar: string
}

export interface Stage {
  id: string
  name: string
  color: string
  order: number
  icon: string
}

export interface Article {
  id: string
  title: string
  authors: User[]
  editable: boolean
  stage: Stage
  desk: { id: string }
  /**
   * scheduled time
   * ! Notice: This string must be parsed with timezone
   */
  scheduledAt?: string
  updatedAt: number
}

export interface TCoverCrop {
  left: number
  top: number
  zoom: number
  realWidth: number
  realHeight: number
  width: number
  height: number
  key: string
}

export interface FormModel {
  id: string
  title: string
  blurb: string
  slug: string
  coverUrl: string
  coverAlt: string
  coverCaption: string
  coverCrop: TCoverCrop
  previewId: string
  searchTitle: string
  searchDescription: string
  socialTitle: string
  socialDescription: string
  socialImageUrl: string
  newsletter: boolean
  newsletterAt: string | boolean | null
  FBPageId: string
  FBEnable: boolean
  FBText: string
  slackText: string
  TWUserId: string
  TWEnable: boolean
  TWText: string
  LNAuthorId: string
  LNEnable: boolean
  LNText: string
  navColor: string
  deskId: string
  deskName: string
  draft: boolean
  published: boolean
  hasSlug: boolean
  featured: boolean
  plan: ArticlePlan
  imgUrl: string
  imgAlt: string
  tags: Tag[]
  authors: Author[]
  url: string
}

export interface IgnoreFormModel {
  title: string
  blurb: string | null | undefined
}

export interface FBuser {
  page_id: string
  name: string
  thumbnail: string
}

export interface TWuser {
  user_id: string
  name: string
  thumbnail: string
}

export interface LNuser {
  author_id: string
  name: string
  thumbnail: string
}

export interface Layout {
  id: string
  name?: string
  template?: string
  data?: LayoutData
}

export interface Terror {
  slug: string[]
}

export interface TCover {
  url: string
  alt: string
  caption: string
  crop: TCoverCrop
}
