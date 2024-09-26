import { ActivateWebflowDocument, DeactivateWebflowDocument, WebflowActivatedDocument } from '~/graphql-operations'

export function useWebflowState() {
  const {
    result: resultWebflowActivated,
    loading: loadingActivated,
    refetch: refetchActivated,
  } = useQuery(WebflowActivatedDocument)
  const { mutate: activateWebflowMutate, loading: activateWebflowLoading } = useMutation(ActivateWebflowDocument)
  const { mutate: deactivateWebflowMutate, loading: deactivateWebflowLoading } = useMutation(DeactivateWebflowDocument)

  const webflowActivated = computed(() => Boolean(resultWebflowActivated.value?.webflowInfo.activated_at))

  async function activateWebflow() {
    await activateWebflowMutate()
    await refetchActivated()
  }

  async function deactivateWebflow() {
    await deactivateWebflowMutate()
    await refetchActivated()
  }

  const loading = computed(
    () => activateWebflowLoading.value || deactivateWebflowLoading.value || loadingActivated.value,
  )

  return {
    webflowActivated,
    activateWebflow,
    deactivateWebflow,
    loading,
  }
}
