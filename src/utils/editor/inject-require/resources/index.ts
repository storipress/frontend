import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import type { Ref } from 'vue'

import type { BaseMeta, ResourceID, Resources } from './types'
import { invalidContext } from './invalid-context'
import { useApolloClient } from '~/lib/apollo'
import { GetArticleDocument, GetDeskDocument, GetTagDocument, GetUserDocument } from '~/graphql-operations'

export type ResourceWithURL<T extends BaseMeta> = T & {
  url: string
}

export interface UseResourceReturn<T extends BaseMeta> {
  pending: Ref<boolean>
  data: Ref<T[] | null>
}

// skipcq: JS-0323
const resourcesQueryMap: Record<Resources, DocumentNode<any, any>> = {
  article: GetArticleDocument,
  desk: GetDeskDocument,
  tag: GetTagDocument,
  author: GetUserDocument,
}

type QueryName = 'article' | 'desk' | 'tag' | 'user'
const resourcesQueryNameMap: Record<Resources, QueryName> = {
  article: 'article',
  desk: 'desk',
  tag: 'tag',
  author: 'user',
}

export function useResourceResolver() {
  return {
    resolveFromResource: resolveFromResourceMetaSync,
    _resolveFromMetaSync: resolveFromResourceMetaSync,

    resolveFromID: resolveResource,
    resolveAsID,
    resolveFromResourceMeta,
    resolveAsRef,
    _getContextFor: getContextFor,
  }
}

function resolveAsRef(_key: string, resourceID: ResourceID) {
  const { state, error, isLoading, execute } = useAsyncState(() => resolveResource(resourceID), null)
  return {
    data: state,
    pending: isLoading,
    refresh: execute,
    execute,
    error,
  }
}

async function resolveResource(resourceID: ResourceID, params?: Record<string, string>, resourceName?: string) {
  const { type } = resourceID
  const resource = resourceName || type
  const id = await resolveAsID(resourceID)
  const meta = await getResourceMeta(type, id)
  return resolveFromResourceMeta(resource, meta)
}

function resolveAsID(resourceID: ResourceID): Promise<string> {
  return convertToId(resourceID.type, resourceID)
}

function resolveFromResourceMeta(type: Resources | string, meta: BaseMeta) {
  return resolveFromResourceMetaSync(type, meta)
}

function resolveFromResourceMetaSync(_type: Resources | string, meta: BaseMeta) {
  if (!meta) {
    return null
  }

  return {
    meta,
    url: '#',
  }
}

async function getResourceMeta<Meta extends BaseMeta>(type: Resources, id: string): Promise<Meta> {
  const { client } = useApolloClient()
  const document = resourcesQueryMap[type]
  const { data } = await client.query({ query: document, variables: { id } })

  return data[type]
}

function getContextFor() {
  return invalidContext
}

async function convertToId(type: Resources, resourceID: { id?: string; slug?: string; sid?: string }): Promise<string> {
  const { id, slug, sid } = resourceID
  if (id) {
    return id
  }

  const { client } = useApolloClient()
  const document = resourcesQueryMap[type]
  const variables = Object.fromEntries(
    [
      ['slug', slug],
      ['sid', sid],
    ].filter(([_key, val]) => val),
  )

  const { data } = await client.query({ query: document, variables })
  const queryName = resourcesQueryNameMap[type]

  return data?.[queryName]?.id || ''
}
