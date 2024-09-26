import type { ApolloCache, NormalizedCacheObject } from '@apollo/client/core'
import type { InjectionKey } from 'vue'
import type { CreateArticleInput, CreateArticleMutation } from '~/graphql-operations'

export interface Desk {
  id: string
  name: string
  desks?: Desk[]
}

type MaybeDeskId = Desk | string
export type ExtraFields = Omit<CreateArticleInput, 'title' | 'blurb' | 'desk_id'>
export type UpdateCacheFn = (cache: ApolloCache<NormalizedCacheObject>, data?: CreateArticleMutation | null) => void

export interface NewArticleInput {
  desk?: MaybeDeskId
  openEditor?: boolean
  extraFields?: ExtraFields
  updateApolloCache?: UpdateCacheFn
}

export interface ResolvedNewArticleInput {
  desk?: MaybeDeskId
  openEditor: boolean
}

export type CreateNewArticle = (x?: Desk | string | NewArticleInput) => Promise<boolean> | void

export const NEW_ARTICLE_KEY: InjectionKey<CreateNewArticle> = Symbol('new-article')
