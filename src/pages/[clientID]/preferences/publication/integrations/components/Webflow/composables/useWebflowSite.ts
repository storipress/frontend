import {
  ListWebflowSitesDocument,
  PullWebflowSitesDocument,
  UpdateWebflowDomainDocument,
  UpdateWebflowSiteDocument,
  WebflowInfoDocument,
} from '~/graphql-operations'
import type { ListWebflowSitesQuery } from '~/graphql-operations'

export function useWebflowSite() {
  const { result: webflowSites, loading: loadingSites, refetch: refetchSites } = useQuery(ListWebflowSitesDocument)
  const { result: webflowInfo, loading: loadingInfo } = useQuery(WebflowInfoDocument)
  const { mutate: mutateUpdateSite, loading: loadingUpdateSite } = useMutation(UpdateWebflowSiteDocument)
  const { mutate: mutateUpdateDomain, loading: loadingUpdateDomain } = useMutation(UpdateWebflowDomainDocument)
  const { mutate: mutatePullWebflowSites, loading: loadingPullWebflowSites } = useMutation(PullWebflowSitesDocument)
  const selectedSite = ref<ListWebflowSitesQuery['webflowSites'][number]>()
  const selectedDomain = ref<string>()
  const sites = computed(() => {
    return webflowSites.value?.webflowSites ?? []
  })
  const domains = computed(() => {
    if (!selectedSite.value?.id) return []

    return [...selectedSite.value.customDomains.map(({ url }) => url), selectedSite.value.defaultDomain]
  })

  watchEffect(() => {
    if (!webflowSites.value || !webflowInfo.value || selectedSite.value) return

    const site = webflowSites.value.webflowSites.find(({ id }) => id === webflowInfo.value?.webflowInfo?.site_id)
    if (!site) return
    selectedSite.value = site

    const domain = webflowInfo.value?.webflowInfo?.domain
    const domainSet = new Set(domains.value)
    if (!domain || !domainSet.has(domain)) return
    selectedDomain.value ??= domain
  })

  async function updateSite() {
    const id = selectedSite.value?.id
    if (!id) return

    await mutateUpdateSite({ input: { value: id } })
  }
  async function updateDomain() {
    const domain = selectedDomain.value
    if (!domain) return

    await mutateUpdateDomain({ input: { value: domain } })
  }

  async function updateInfo() {
    await updateSite()
    await updateDomain()
  }

  async function pullSites() {
    await mutatePullWebflowSites({ refresh: true })
    await refetchSites()
  }

  const loading = computed(
    () =>
      loadingSites.value ||
      loadingInfo.value ||
      loadingUpdateSite.value ||
      loadingUpdateDomain.value ||
      loadingPullWebflowSites.value,
  )

  return {
    selectedSite,
    selectedDomain,
    sites,
    domains,
    loading,
    updateSite,
    updateDomain,
    updateInfo,
    pullSites,
  }
}
