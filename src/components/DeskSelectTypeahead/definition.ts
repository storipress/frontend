import type { ListDesksQuery } from '~/graphql-operations'

export type DeskType = Partial<ListDesksQuery['desks'][number]>
