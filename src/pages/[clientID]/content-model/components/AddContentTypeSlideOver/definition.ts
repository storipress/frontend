import { CustomFieldGroupType } from '~/graphql-operations'

export interface ContentType {
  type: CustomFieldGroupType
  class: string
}

export const contentType = [
  {
    routeParams: 'article-meta',
    type: CustomFieldGroupType.ArticleMetafield,
    class: 'Article Metafield',
  },
  {
    routeParams: 'article-block',
    type: CustomFieldGroupType.ArticleContentBlock,
    class: 'Article Block',
  },
  {
    routeParams: 'tag-group',
    type: CustomFieldGroupType.TagMetafield,
    class: 'Tag Group',
  },
  {
    type: CustomFieldGroupType.DeskMetafield,
    class: 'Desk Group',
  },
]

export const contentTypeParamsMap = {
  [CustomFieldGroupType.ArticleMetafield]: 'article-meta',
  [CustomFieldGroupType.ArticleContentBlock]: 'article-block',
  [CustomFieldGroupType.TagMetafield]: 'tag-group',
}
