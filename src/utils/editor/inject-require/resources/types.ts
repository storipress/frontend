export type Resources = 'article' | 'desk' | 'tag' | 'author'
export type Identity = 'id' | 'slug' | 'sid'

type BaseID<Type extends Resources> =
  | {
      type: Type
      id: string
    }
  | {
      type: Type
      slug: string
    }

export type ArticleID =
  | BaseID<'article'>
  | {
      type: 'article'
      sid: string
    }

export type DeskID = BaseID<'desk'>
export type AuthorID = BaseID<'author'>
export type TagID = BaseID<'tag'>

export type ResourceID = ArticleID | DeskID | AuthorID | TagID

export interface BaseMeta {
  id: string
  slug: string
  sid: string
}

export interface ResourcePageContext {
  resource: Resources
  identity: Identity
  prefix: string
}
