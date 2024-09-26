import { useWebflowState } from './useWebflowState'
import { ConnectWebflowDocument, DisconnectWebflowDocument, WebflowAuthorizedDocument } from '~/graphql-operations'
import { useSocialConnect } from '~/composables'
import { useApolloClient } from '~/lib/apollo'

export function useWebflowAuthorized(successCallback?: () => void) {
  const { result: resultWebflowAuthorized, loading: loadingAuthorized } = useQuery(WebflowAuthorizedDocument)

  const { client } = useApolloClient()
  const { deactivateWebflow } = useWebflowState()
  const { mutate: mutateDisconnectWebflow, loading: loadingDisconnectWebflow } = useMutation(
    DisconnectWebflowDocument,
    {
      refetchQueries: [WebflowAuthorizedDocument],
      awaitRefetchQueries: true,
    },
  )

  const url = ref()
  const { openNewWindow } = useSocialConnect(url, successCallback, undefined, { width: 500, height: 800 })

  async function connectWebflow() {
    const result = await client.mutate({
      mutation: ConnectWebflowDocument,
    })
    url.value = result?.data?.connectWebflow
    openNewWindow()
  }

  async function disconnectWebflow() {
    await mutateDisconnectWebflow()
    await deactivateWebflow()
  }

  const loading = computed(() => loadingDisconnectWebflow.value || loadingAuthorized.value)

  return {
    WebflowAuthorized: computed(() => Boolean(resultWebflowAuthorized.value?.webflowAuthorized)),
    connectWebflow,
    disconnectWebflow,
    loading,
  }
}
