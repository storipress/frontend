import type { Ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { ListDesksQuery } from '~/graphql-operations'
import { ListDesksDocument } from '~/graphql-operations'

function queryDesks() {
  return useQuery(ListDesksDocument, undefined, { errorPolicy: 'ignore' })
}

export interface UseCurrentDeskInput {
  result: Ref<ListDesksQuery | undefined>
}

export function useCurrentDesk(queryDesksResponse: UseCurrentDeskInput = queryDesks(), initialCurrentDesk?: string) {
  const { result } = queryDesksResponse

  const desks = computed(() => result.value?.desks || [])

  const mapSlugToDeskID = computed(() => {
    const result = new Map<string, string>()

    for (const desk of desks.value) {
      result.set(desk.slug, desk.id)
      for (const d of desk.desks || []) {
        result.set(d.slug, d.id)
      }
    }

    return result
  })

  const route = useRoute()
  const deskSlug = computed(() => route?.params?.deskSlug?.toString() || initialCurrentDesk || '')
  const deskId = computed(() => (deskSlug.value ? mapSlugToDeskID.value.get(deskSlug.value) || '' : ''))

  type MainDeskType = ListDesksQuery['desks'][0] & { open_access?: boolean }
  type SubDeskType = ListDesksQuery['desks'][0]['desks'][0]
  const mapIdToDesk = computed(() => {
    const result = new Map<string, MainDeskType | SubDeskType>()

    for (const desk of desks.value) {
      result.set(desk.id, desk)
      for (const d of desk.desks || []) {
        result.set(d.id, d)
      }
    }

    return result
  })
  const currentDesk = computed(() => mapIdToDesk.value.get(deskId.value))

  const mapIdToMainDesk = computed(() => {
    const result = new Map<string, MainDeskType>()

    for (const desk of desks.value) {
      result.set(desk.id, desk)
      for (const d of desk.desks || []) {
        result.set(d.id, desk)
      }
    }

    return result
  })
  const currentMainDesk = computed(() => mapIdToMainDesk.value.get(deskId.value))

  return {
    mapIdToDesk,
    currentDesk,
    mapIdToMainDesk,
    currentMainDesk,
  }
}

export function useDesks() {
  const { result, refetch } = useQuery(ListDesksDocument, undefined, { errorPolicy: 'ignore' })

  const desks = computed(() => cloneDeep(result.value?.desks) || [])

  const mainDeskMap = computed(() => {
    const map = new Map<string, string>()

    for (const desk of desks.value) {
      map.set(desk.id, desk.id)
      for (const d of desk.desks || []) {
        map.set(d.id, desk.id)
      }
    }

    return map
  })

  return {
    desks,
    mainDeskMap,
    refetch,
  }
}
