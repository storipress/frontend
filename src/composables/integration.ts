import delay from 'delay'
import { logicNot } from '@vueuse/math'
import { P, match } from 'ts-pattern'
import * as Sentry from '@sentry/vue'
import { useNotification } from './notification'
import {
  ActivateIntegrationDocument,
  DeactivateIntegrationDocument,
  ListIntegrationsDocument,
  UpdateIntegrationDocument,
} from '~/graphql-operations'
import type {
  FacebookConfiguration,
  LinkedInConfiguration,
  ShopifyConfiguration,
  SlackConfiguration,
  TwitterConfiguration,
  WebflowConfiguration,
} from '~/graphql-operations'
import { SOCIAL_INTEGRATIONS } from '~/stores/integration'
import { useAuthStore } from '~/stores/auth'
import { env } from '~/env'
import { createDefaultData } from '~/pages/[clientID]/preferences/publication/integrations/utils'
import type { IntegrationSource, IntegrationsDataFromApi, IntegrationsKey } from '~/schema/integration'
import {
  IntegrationsKey as Integrations,
  IntegrationsDataFromApiSchema,
  IntegrationsDataSchema,
  integrationToTraceKey,
} from '~/schema/integration'

export { Integrations }

type Referrer = 'migration' | 'integration' | 'onboarding'

interface Configuration {
  [IntegrationsKey.Facebook]: FacebookConfiguration
  [IntegrationsKey.Twitter]: TwitterConfiguration
  [IntegrationsKey.Slack]: SlackConfiguration
  [IntegrationsKey.Shopify]: ShopifyConfiguration
  [IntegrationsKey.Webflow]: WebflowConfiguration
  [IntegrationsKey.LinkedIn]: LinkedInConfiguration
  [IntegrationsKey.Disqus]: never
  [IntegrationsKey.GoogleAdsense]: never
  [IntegrationsKey.GoogleAnalytics]: never
  [IntegrationsKey.HeaderFooterCode]: never
  [IntegrationsKey.Mailchimp]: never
  [IntegrationsKey.Zapier]: never
  [IntegrationsKey.WordPress]: never
}

export function useIntegrationUtils() {
  const apiHost = env.VITE_API_HOST
  const store = useAuthStore()
  const route = useRoute()
  const clientId = route?.params.clientID

  const {
    result: resultListIntegration,
    loading: loadingListIntegration,
    refetch: refetchListIntegration,
  } = useQuery(ListIntegrationsDocument)

  const integrationList = computed(() => resultListIntegration.value?.integrations)

  const integrationListMap = computed(() => {
    return new Map(integrationList.value?.map((integration) => [integration.key, integration]))
  })

  const getIntegration = (key: Integrations) => {
    return computed(() => integrationListMap.value.get(key))
  }

  const getActivateTime = (key: Integrations) => {
    return computed(() => getIntegration(key).value?.activated_at)
  }

  const getConfiguration = <T extends keyof Configuration>(key: T) => {
    return computed(() => getIntegration(key).value?.configuration as Configuration[T])
  }

  const getData = (key: Integrations) => {
    return computed(() => getIntegration(key).value?.data)
  }

  const getParseData = <T extends Integrations>(key: T) => {
    const data = getData(key)
    return computed<IntegrationsDataFromApi[T]>(() => (data.value ? JSON.parse(data.value) : null))
  }

  const getThirdPartyData = <T extends Integrations>(key: T) => {
    const data = getParseData(key)
    return computed(() => (Array.isArray(data.value) ? (data.value.length > 0 ? data.value : null) : data.value))
  }

  /**
   * Retrieves the third-party configuration or data based on the provided key.
   * @deprecated This function is temporary and subject to change. It currently returns configuration when available, falling back to data for unsupported cases.
   */
  const getThirdPartyDataOrConfiguration = <T extends Integrations>(key: T) => {
    return match(key)
      .with(P.union(Integrations.LinkedIn, Integrations.Webflow, Integrations.WordPress), () => {
        const configuration = getConfiguration(key)
        return configuration
      })
      .otherwise(() => {
        const data = getThirdPartyData(key)
        return data
      })
  }

  const isIntegrationConnectedWithData = (data: unknown) => {
    return match(data)
      .with([], () => false)
      .with(P.nullish, () => false)
      .otherwise((x) => {
        // x is object so we can use Object.keys
        if (typeof x === 'object' && x !== null) {
          return Object.keys(x).length > 0
        }

        // as here is impossible to be empty array or nullish, we can safely return true
        return true
      })
  }

  const isThirdPartyEnabled = (key: Integrations) => {
    const data = getThirdPartyDataOrConfiguration(key)

    return computed(() => Boolean(getActivateTime(key).value) && isIntegrationConnectedWithData(data.value))
  }

  const getThirdPartyApi = (key: Integrations, referrer?: Referrer) => {
    const thirdPartyData = getThirdPartyDataOrConfiguration(key)
    const hasAuthorized = isIntegrationConnectedWithData(thirdPartyData.value)
    const authorizationStatus = hasAuthorized ? 'disconnect' : 'connect'

    return match(key)
      .with(
        Integrations.LinkedIn,
        () => `${apiHost}/partners/linkedin/${authorizationStatus}?api-token=${store.token}&client_id=${clientId}`,
      )
      .with(
        Integrations.Shopify,
        () =>
          `${apiHost}/partners/shopify/${authorizationStatus}?client_id=${clientId}&api-token=${store.token}&referrer=${referrer}`,
      )
      .otherwise(() => `${apiHost}/client/${clientId}/${key}/${authorizationStatus}?api-token=${store.token}`)
  }

  const isReady = computed(() => !loadingListIntegration.value)

  return {
    isReady,
    resultListIntegration,
    loadingListIntegration,
    refetchListIntegration,
    getActivateTime,
    getConfiguration,
    getData,
    getParseData,
    getThirdPartyData,
    getThirdPartyApi,
    isIntegrationConnectedWithData,
    isThirdPartyEnabled,
  }
}

export function useIntegration<T extends Integrations>(key: T, source: IntegrationSource = 'settings') {
  const dataFromApiSchema = IntegrationsDataFromApiSchema.shape[key]
  const dataSchema = IntegrationsDataSchema.shape[key]

  const visible = ref(false)
  const integrationData = ref(createDefaultData(key))

  const {
    refetchListIntegration,
    getActivateTime,
    getConfiguration,
    getData,
    getThirdPartyData,
    isThirdPartyEnabled,
    getThirdPartyApi: _getThirdPartyApi,
  } = useIntegrationUtils()

  const activatedTime = getActivateTime(key)
  const isActivated = computed(() => Boolean(getActivateTime(key).value))
  const data = getData(key)
  const configuration = getConfiguration(key)
  const thirdPartyData = getThirdPartyData(key)
  const authorizedAndEnabled = isThirdPartyEnabled(key)

  const getThirdPartyApi = (referrer?: Referrer) => {
    return _getThirdPartyApi(key, referrer)
  }

  const initIntegrationData = () => {
    integrationData.value = JSON.parse(data.value)
  }

  watch(data, (data) => {
    if (data) {
      const parseData = JSON.parse(data)

      if (env.DEV) {
        dataFromApiSchema.parse(parseData)
      } else {
        const res = dataFromApiSchema.safeParse(parseData)
        if (!res.success) {
          Sentry.captureException(res.error, (scope) => {
            scope.setContext('integration', { dataFromApi: data.value, dataFormat: parseData })
            return scope
          })
        }
      }
    }

    initIntegrationData()
  })
  whenever(logicNot(visible), () => {
    initIntegrationData()
  })

  const { create: notifications } = useNotification()

  const { mutate: mutateUpdateIntegration } = useMutation(UpdateIntegrationDocument)
  const onUpdate = async (showNotify = true) => {
    if (env.DEV) {
      dataSchema.parse(integrationData.value)
    } else {
      const res = dataSchema.safeParse(integrationData.value)
      if (!res.success) {
        Sentry.captureException(res.error, (scope) => {
          scope.setContext('integration', { data: integrationData.value })
          return scope
        })
      }
    }

    await mutateUpdateIntegration({
      input: {
        key,
        data: JSON.stringify(integrationData.value),
      },
    })
    await refetchListIntegration()

    if (showNotify) {
      notifications({
        title: 'Integration updated',
        type: 'warning',
        content: 'Changes will go live on your site in 3-5 minutes.',
      })
    }
  }

  const { mutate: mutateActivateIntegration, onDone: onDoneActivateIntegration } =
    useMutation(ActivateIntegrationDocument)
  const onActivate = async (updateData = true) => {
    if (updateData) {
      if (env.DEV) {
        dataSchema.parse(integrationData.value)
      } else {
        const res = dataSchema.safeParse(integrationData.value)
        if (!res.success) {
          Sentry.captureException(res.error, (scope) => {
            scope.setContext('integration', { data: integrationData.value })
            return scope
          })
        }
      }

      await mutateUpdateIntegration({
        input: {
          key,
          data: JSON.stringify(integrationData.value),
        },
      })
    }
    await mutateActivateIntegration({ key })
    notifications({
      title: 'Integration activated',
      type: 'primary',
      content: 'Changes will go live on your site in 3-5 minutes.',
    })

    // after successfully authorizing and enabling the third-party integration, delay one second and then re-fetch the data
    if (SOCIAL_INTEGRATIONS.has(key)) {
      await delay(1000)
    }
    await refetchListIntegration()
  }

  const { mutate: mutateDeactivateIntegration, onDone: onDoneDeactivateIntegration } = useMutation(
    DeactivateIntegrationDocument,
    {
      refetchQueries: [ListIntegrationsDocument],
    },
  )
  const onDeactivate = async () => {
    await mutateDeactivateIntegration({ key })
    notifications({
      title: 'Integration deactivated',
      type: 'warning',
      content: 'Changes will go live on your site in 3-5 minutes.',
    })
  }

  const onSwitch = async (showModal = true) => {
    if (!activatedTime.value) {
      await mutateActivateIntegration({ key })
      refetchListIntegration()
      visible.value = showModal
      notifications({
        title: 'Integration activated',
        type: 'primary',
        content: 'Changes will go live on your site in 3-5 minutes.',
      })
    } else {
      await mutateDeactivateIntegration({ key })
      notifications({
        title: 'Integration deactivated',
        type: 'warning',
        content: 'Changes will go live on your site in 3-5 minutes.',
      })
    }
  }

  onDoneActivateIntegration(({ data }) => {
    const integrationKey = data?.activateIntegration?.key ?? ''

    if (!integrationKey) return

    sendTrack('integration_enabled', { integration: integrationToTraceKey(integrationKey), source })
  })

  onDoneDeactivateIntegration(({ data }) => {
    const integrationKey = data?.deactivateIntegration?.key ?? ''

    if (!integrationKey) return

    sendTrack('integration_disabled', { integration: integrationToTraceKey(integrationKey), source })
  })

  whenever(visible, () => {
    sendTrack('integration_view', { integration: integrationToTraceKey(key), source })
  })

  return {
    visible,
    integrationData,
    configuration,
    thirdPartyData,
    activatedTime,
    isActivated,
    authorizedAndEnabled,
    onActivate,
    onUpdate,
    onDeactivate,
    onSwitch,
    getThirdPartyApi,
  }
}
