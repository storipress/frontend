import type { GetTagsQuery } from '~/graphql-operations'

export type TagType = GetTagsQuery['tags'][number]
