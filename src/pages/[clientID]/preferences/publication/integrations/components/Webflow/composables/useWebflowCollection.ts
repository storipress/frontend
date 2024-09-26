import {
  WebflowCollectionType as CollectionType,
  CreateWebflowCollectionDocument,
  GetWebflowCollectionDocument,
  ListWebflowCollectionsDocument,
  PullWebflowCollectionsDocument,
  UpdateWebflowCollectionDocument,
  UpdateWebflowCollectionMappingDocument,
} from '~/graphql-operations'
import type {
  CreateWebflowCollectionInput,
  ListWebflowCollectionsQuery,
  UpdateWebflowCollectionInput,
  UpdateWebflowCollectionMappingInput,
  WebflowCollectionType,
} from '~/graphql-operations'
import { useApolloClient } from '~/lib/apollo'

interface SelectedCollection {
  id: ListWebflowCollectionsQuery['webflowCollections'][number]['id']
  displayName: ListWebflowCollectionsQuery['webflowCollections'][number]['displayName']
}

const COLLECTION_TYPE = Object.values(CollectionType)

export function useWebflowCollection(unsetCollection = COLLECTION_TYPE) {
  const {
    result: webflowCollections,
    loading: loadingCollections,
    refetch: refetchCollections,
  } = useQuery(ListWebflowCollectionsDocument)
  const { mutate: mutateUpdateCollection, loading: loadingUpdateCollection } = useMutation(
    UpdateWebflowCollectionDocument,
  )
  const { mutate: mutateUpdateCollectionMapping, loading: loadingUpdateCollectionMapping } = useMutation(
    UpdateWebflowCollectionMappingDocument,
  )
  const { mutate: mutateCreateWebflowCollection, loading: loadingCreateWebflowCollection } = useMutation(
    CreateWebflowCollectionDocument,
  )
  const { mutate: mutatePullWebflowCollections, loading: loadingPullWebflowCollections } =
    useMutation(PullWebflowCollectionsDocument)

  const selectedCollection = reactive({}) as Record<WebflowCollectionType, SelectedCollection>

  const collectionsMap = computed(() => {
    return new Map(
      webflowCollections.value?.webflowCollections.map(({ id, displayName }) => [id, { id, displayName }]) ?? [],
    ).set('create', {
      id: 'create',
      displayName: 'I do not have a corresponding collection, create collection',
    })
  })

  const collections = computed(() => {
    return Array.from(collectionsMap.value.values())
  })

  const selectedIds = computed(() => {
    const ids = Object.values(selectedCollection).flatMap((collection) => collection?.id ?? [])

    return new Set(ids)
  })

  const { client } = useApolloClient()
  async function getAutoSelectedCollectionId(type: WebflowCollectionType) {
    const { data } = await client.query({ query: GetWebflowCollectionDocument, variables: { type } })

    return collectionsMap.value.get(data.webflowCollection?.id ?? '')
  }

  async function updateCollection(inputs: UpdateWebflowCollectionInput[]) {
    const promise = inputs.map((input) => mutateUpdateCollection({ input }))
    try {
      return await Promise.all(promise)
    } catch (e) {
      return false
    }
  }

  async function createCollection(inputs: CreateWebflowCollectionInput[]) {
    const promise = inputs.map((input) => mutateCreateWebflowCollection({ input }))
    await Promise.all(promise)
  }

  async function pullCollections() {
    await mutatePullWebflowCollections({ refresh: true })
    await refetchCollections()
  }

  async function updateCollectionMapping(input: UpdateWebflowCollectionMappingInput) {
    await mutateUpdateCollectionMapping({ input })
  }

  const { isLoading: loadingAutoSelectedCollections } = useAsyncState(
    async () => {
      await until(loadingCollections).not.toBeTruthy()

      if (unsetCollection.length === 0) {
        const result = await Promise.all(
          COLLECTION_TYPE.map(async (type) => [type, await getAutoSelectedCollectionId(type)]),
        )
        Object.assign(selectedCollection, Object.fromEntries(result))
      } else {
        const result = unsetCollection.map((unsetType) => [unsetType, undefined])
        Object.assign(selectedCollection, Object.fromEntries(result))
      }
    },
    undefined,
    {
      resetOnExecute: false,
    },
  )

  const loading = computed(
    () =>
      loadingCollections.value ||
      loadingAutoSelectedCollections.value ||
      loadingUpdateCollection.value ||
      loadingCreateWebflowCollection.value ||
      loadingUpdateCollectionMapping.value ||
      loadingPullWebflowCollections.value,
  )

  return {
    selectedCollection,
    collections,
    selectedIds,
    loading,
    updateCollection,
    createCollection,
    updateCollectionMapping,
    pullCollections,
  }
}
