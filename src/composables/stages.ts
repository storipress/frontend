import { computed } from 'vue'
import type { Ref } from 'vue'
import { GetStagesDocument } from '~/graphql-operations'
import { useQuery } from '~/lib/apollo'

export interface Stage {
  id: string
  name: string
  color: string
  order: number
  icon: string
  ready: boolean
  default: boolean
}

export function useStages(): Readonly<Ref<Stage[]>> {
  const { result } = useQuery(GetStagesDocument, undefined, { fetchPolicy: 'cache-first' })

  return computed(() => result.value?.stages ?? [])
}
