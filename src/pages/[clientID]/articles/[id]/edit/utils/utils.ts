import type { Ref } from 'vue'
import type * as Y from 'yjs'
import { Effect, Schedule, pipe } from 'effect'
import type { Layout } from '../types'
import type { ArticleLayout } from './watch'
import type { GetArticleMetafieldQuery, SiteTemplate } from '~/graphql-operations'

export function getLayoutId(article: ArticleLayout | undefined | null, layouts: Layout[] | undefined) {
  const layoutId = article?.layout?.id || article?.desk?.layout?.id || article?.desk?.desk?.layout?.id
  if (layoutId) {
    const layout = layouts?.find((item) => item.id === layoutId)
    if (layout) {
      return layoutId
    }
  }
  return layouts?.[0]?.id || ''
}

export function getCustomLayoutId(layouts: SiteTemplate[] | undefined) {
  return layouts?.[0]?.name || ''
}

export function getCustomLayout(layouts: SiteTemplate[] | undefined): { name: string; url: string } | undefined {
  const defaultLayout = layouts?.[0]
  if (!defaultLayout || !defaultLayout.name) {
    return undefined
  }
  return defaultLayout as { name: string; url: string }
}

export function getMetaPreviewId(articleMetafieldResult: Ref<GetArticleMetafieldQuery | undefined>) {
  const metafields = articleMetafieldResult?.value?.article?.metafields
  const middleData = metafields?.find((item) => item.group.name === '__layoutmeta')?.values?.[0]
  return (middleData?.__typename === 'CustomFieldTextValue' && middleData.value) || ''
}

export function updateYDocText(ydoc: Y.Doc, column: Y.Text, insertValue: string) {
  return pipe(
    Effect.sync(() => {
      ydoc.transact(() => {
        column.delete(0, column.toString().length ?? 0)
        column.insert(0, insertValue)
      })
    }),
    Effect.tap(() => {
      return column.toString() === insertValue ? Effect.void : Effect.fail(new Error('text is not same'))
    }),
    Effect.retry(Schedule.recurs(5)),
    Effect.tapError((error) => {
      sendTrackUnchecked(
        'ydoc_insert_not_equal',
        {
          columnValue: column.toString(),
          insertValue,
        },
        true,
      )
      return Effect.fail(error)
    }),
    Effect.runPromise,
  )
}
