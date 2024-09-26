import pRetry from 'p-retry'
import type { EventBusKey } from '@vueuse/core'
import type { NestedHooks } from 'hookable'
import { createHooks } from 'hookable'
import type { Promisable } from 'type-fest'
import WebflowGroup from '@assets/group-webflow.webp'
import MappingDialog from '../components/MappingDialog.vue'
import SettingPanel from '../components/SettingPanel.vue'
import CollectionSetup from '../components/CollectionSetup.vue'
import ConnectSite from '../components/ConnectSite.vue'
import type { Context, EnterCondition, OnType, PropsType, StepsContext, WebflowHooks } from './definition'
import { useWebflowAuthorized } from './useWebflowAuthorized'
import { isWebflowOnboardCompleted } from './utils'
import { InfoDialog } from '~/components/Integrations'
import type { WebflowCollectionType } from '~/graphql-operations'
import {
  ActivateWebflowDocument,
  GetWebflowCollectionDocument,
  WebflowActivatedDocument,
  WebflowAuthorizedDocument,
  WebflowOnboardingDocument,
} from '~/graphql-operations'
import { useApolloClient } from '~/lib/apollo'

export enum Steps {
  Connect = 1,
  SiteSetup = 2,
  CollectionSetup = 3,
  CollectionMapStart = 4,
  CollectionMapSetup = 5,
  Panel = 0,
}

export const WebflowAuthSuccessEventBus: EventBusKey<StepsContext> = Symbol('webflow-auth-success-event-bus')

export function useStepManager(hooks: NestedHooks<WebflowHooks> = {}) {
  const {
    result: authorizedResult,
    loading: authorizedLoading,
    refetch: authorizedRefetch,
  } = useQuery(WebflowAuthorizedDocument)
  const {
    result: onboardingResult,
    loading: onboardingLoading,
    refetch: onboardingRefetch,
  } = useQuery(WebflowOnboardingDocument)

  const currentStep = shallowRef()
  const context = useStepContext({ setCurrentStep, useInitCurrentStep })

  context.hooks.addHooks(hooks)

  const hasAuthorized = computed(() => authorizedResult.value?.webflowAuthorized)
  const hasSetupSite = computed(() => onboardingResult.value?.webflowOnboarding.site)
  const onboarding = computed(() => onboardingResult.value?.webflowOnboarding)

  const mapping = {
    [Steps.Connect]: defineStep<ReturnType<typeof useConnectWebflow>>({
      shouldEnter: async () => {
        if (context.webflow.initOnboarding.value) {
          await authorizedRefetch()
          context.webflow.initOnboarding.value = false
        }
        await until(authorizedLoading).not.toBeTruthy()
        await until(onboardingLoading).not.toBeTruthy()
        if (onboardingResult.value && isWebflowOnboardCompleted(onboardingResult.value)) {
          context.webflow.isAlreadyCompletedOnboarding.value = true
          return {
            status: false,
            nextStep: Steps.Panel,
          }
        }
        return normalizedEnter(!hasAuthorized.value)
      },
      component: InfoDialog,
      composable: useConnectWebflow,
    }),
    [Steps.SiteSetup]: defineStep<ReturnType<typeof useSetupSiteAndDomain>>({
      shouldEnter: async () => {
        await until(onboardingLoading).not.toBeTruthy()

        if (context.webflow.isReady.value && hasSetupSite.value) {
          sendTrack('webflow_onboarding_step_completed', {
            step_name: 'site_select',
            is_skipped: true,
          })
        }

        return normalizedEnter(!hasSetupSite.value)
      },
      component: ConnectSite,
      composable: useSetupSiteAndDomain,
    }),
    [Steps.CollectionSetup]: defineStep<ReturnType<typeof useSetupCollection>>({
      shouldEnter: async () => {
        await until(onboardingLoading).not.toBeTruthy()

        const result = await shouldRefetchOnboarding()
        const collection = Object.entries(result?.collection || []).flatMap(([type, value]) =>
          typeof value === 'boolean' && !value ? type : [],
        )
        const unsetMapping = Object.entries(result?.mapping || [])
          .filter(([_type, value]) => typeof value === 'boolean')
          .some(([_type, value]) => !value)

        if (collection?.length || unsetMapping) {
          return normalizedEnter([collection, true] as [string[], boolean])
        }
        if (context.webflow.isReady.value) {
          sendTrack('webflow_onboarding_step_completed', {
            step_name: 'collection_mapping',
            is_skipped: true,
            mapping_collections: [],
            mapping_count: 0,
          })
        }
        return normalizedEnter(false)
      },
      component: CollectionSetup,
      composable: useSetupCollection,
    }),
    [Steps.CollectionMapStart]: defineStep<ReturnType<typeof useStartMapCollection>>({
      shouldEnter: async () => {
        await until(onboardingLoading).not.toBeTruthy()

        const result = await shouldRefetchOnboarding()
        const mapping = Object.entries(result?.mapping || []).find(
          ([_type, value]) => typeof value === 'boolean' && !value,
        )
        if (mapping?.length) {
          const [type, value] = mapping
          return normalizedEnter([type, !value] as [string, boolean])
        }
        if (context.webflow.isReady.value && !context.webflow.manualMapping.value) {
          sendTrack('webflow_onboarding_step_completed', {
            step_name: 'field_mapping',
            mapping_collection: null,
            is_skipped: true,
          })
        }
        return normalizedEnter(Boolean(mapping))
      },
      component: InfoDialog,
      composable: useStartMapCollection,
    }),
    [Steps.CollectionMapSetup]: defineStep<ReturnType<typeof useSetupMapCollection>>({
      component: MappingDialog,
      composable: useSetupMapCollection,
    }),
    [Steps.Panel]: defineStep<ReturnType<typeof useSettingPanel>>({
      component: SettingPanel,
      composable: useSettingPanel,
    }),
  }

  async function shouldRefetchOnboarding() {
    if (context.webflow.isReady.value) {
      const result = await onboardingRefetch()
      return result?.data.webflowOnboarding
    } else {
      return onboarding.value
    }
  }

  const { isLoading: loadCurrentStepLoading, execute: loadCurrentStepExecute } = useAsyncState(
    loadCurrentStep,
    currentStep.value,
    { immediate: false },
  )
  const { isLoading: initCurrentStepLoading, execute: initCurrentStepExecute } = useAsyncState(
    initCurrentStep,
    undefined,
    { immediate: false },
  )

  async function setCurrentStep(step: Steps) {
    const result = await loadCurrentStepExecute(0, step)
    if (!result) return
    currentStep.value = result
  }
  async function useInitCurrentStep() {
    await initCurrentStepExecute(0)
  }

  async function loadCurrentStep(step: Steps) {
    return await mapping[step](context)
  }
  async function initCurrentStep() {
    context.webflow.initOnboarding.value = true
    const result = await authorizedRefetch()
    await onboardingRefetch()
    await until(result?.data.webflowAuthorized).not.toBeTruthy()
    context.webflow.hasAuthorized.value = false
    context.webflow.hasCompletedOnboarding.value = false
  }

  return {
    currentStep,
    visible: context.webflow.visible,
    context: context.webflow,
    setCurrentStep,
    useInitCurrentStep,
    isLoading: computed(
      () => loadCurrentStepLoading.value || initCurrentStepLoading.value || context.webflow.isLoading.value,
    ),
  }
}

export function defineStep<T>({
  shouldEnter = () => Promise.resolve({ type: undefined, status: true }),
  component,
  composable,
}: {
  shouldEnter?: () => Promise<EnterCondition>
  component: Component
  composable: (ctx: StepsContext, collectionType?: WebflowCollectionType) => { props: PropsType<T>; on: OnType<T> }
}) {
  return async (ctx: StepsContext) => {
    const { ...webflow } = ctx.webflow
    const { type, status, nextStep } = await shouldEnter()
    if (typeof type !== 'undefined') {
      Array.isArray(type)
        ? (webflow.uncompletedCollectionType.value = type as WebflowCollectionType[])
        : (webflow.currentCollectionType.value = type as WebflowCollectionType)
    }
    if (status) {
      webflow.isReady.value = true
      const { props, on: events } = composable(ctx)
      return {
        component,
        props,
        events,
      }
    } else {
      ctx.next(async ({ currentStep, hasCompletedOnboarding, hasAuthorized }) => {
        if (typeof nextStep !== 'undefined') {
          currentStep.value = nextStep
        } else {
          currentStep.value += 1
        }
        if (currentStep.value === Steps.SiteSetup) {
          hasAuthorized.value = true
        }
        if (currentStep.value === Steps.CollectionMapSetup && !type) {
          ctx.finishOnboarding()
          await ctx.hooks.callHook('afterOnboarding', ctx)
          ctx.close()
          hasCompletedOnboarding.value = true
          currentStep.value = Steps.Panel
        }
      })
      return null
    }
  }
}

export function normalizedEnter(result: [string[] | string, boolean] | boolean) {
  if (typeof result === 'boolean') {
    return { type: undefined, status: result }
  } else {
    const [type, status] = result
    return { type, status }
  }
}

export function useConnectWebflow(ctx: StepsContext) {
  const { client } = useApolloClient()
  const { connectWebflow } = useWebflowAuthorized(connectSuccessCallback)

  async function connectSuccessCallback() {
    await client.mutate({
      mutation: ActivateWebflowDocument,
      refetchQueries: [WebflowAuthorizedDocument, WebflowActivatedDocument],
      awaitRefetchQueries: true,
    })
    sendTrack('webflow_onboarding_step_completed', { step_name: 'connect' })
    ctx.next(({ currentStep, hasAuthorized }) => {
      hasAuthorized.value = true
      currentStep.value = Steps.SiteSetup
    })
    await ctx.hooks.callHook('afterAuth', ctx)
  }

  ctx.hooks.callHook('beforeAuth', ctx, connectWebflow)

  return {
    props: {
      img: WebflowGroup,
      title: 'Connect Storipress to your Webflow Site',
      content: 'Experience the full power of Storipress on Webflow',
      buttonText: 'Connect account',
    },
    on: {
      clickButton: connectWebflow,
    },
  }
}

function useSetupSiteAndDomain(ctx: StepsContext) {
  return {
    props: {},
    on: {
      clickNext: () => {
        sendTrack('webflow_onboarding_step_completed', { step_name: 'site_select', is_skipped: false })
        ctx.next(async ({ currentStep }) => {
          await ctx.loading(5000, 'Connecting to Webflow…')
          currentStep.value = Steps.CollectionSetup
        })
      },
    },
  }
}

function useSetupCollection(ctx: StepsContext) {
  const { ...webflow } = ctx.webflow
  const { refetch: onboardingRefetch } = useQuery(WebflowOnboardingDocument)

  const set = new Set(webflow.uncompletedCollectionType.value)
  const checkCreateCompleted = async () => {
    const result = await onboardingRefetch()
    const uncompleted = Object.entries(result?.data.webflowOnboarding.collection || []).find(
      ([type, value]) => set.has(type as WebflowCollectionType) && !value,
    )

    if (uncompleted?.length) {
      throw new Error(`${uncompleted[0]} create not completed`)
    } else {
      return true
    }
  }

  return {
    props: {
      collectionType: webflow.uncompletedCollectionType.value,
    },
    on: {
      clickNext: () => {
        sendTrack('webflow_onboarding_step_completed', {
          step_name: 'collection_mapping',
          is_skipped: false,
          mapping_collections: Array.from(set),
          mapping_count: set.size,
        })
        ctx.next(async ({ currentStep, uncompletedCollectionType, isLoading, loadingMessage }) => {
          if (uncompletedCollectionType.value?.length) {
            loadingMessage.value = 'Creating collection…'
            isLoading.value = true
            await pRetry(checkCreateCompleted, { retries: 12 })
          }
          isLoading.value = false
          loadingMessage.value = ''
          currentStep.value = Steps.CollectionMapStart
        })
      },
    },
  }
}

function useStartMapCollection(ctx: StepsContext) {
  const { ...webflow } = ctx.webflow
  return {
    props: {
      img: WebflowGroup,
      title: `Map your ${webflow.currentCollectionType.value} collection`,
      content: `In the next step, map your ${webflow.currentCollectionType.value} collection to Storipress`,
      buttonText: `Map ${webflow.currentCollectionType.value} collection`,
    },
    on: {
      clickButton: () => {
        ctx.next(({ currentStep, manualMapping }) => {
          manualMapping.value = true
          currentStep.value = Steps.CollectionMapSetup
        })
      },
    },
  }
}

function useSetupMapCollection(ctx: StepsContext) {
  const { ...webflow } = ctx.webflow
  const { result: onboardingResult, refetch: onboardingRefetch } = useQuery(WebflowOnboardingDocument)
  const { result: webflowCollectionResult, refetch: webflowCollectionRefetch } = useQuery(
    GetWebflowCollectionDocument,
    {
      type: webflow.currentCollectionType.value as WebflowCollectionType,
    },
  )

  const collection = computed(() => webflowCollectionResult.value?.webflowCollection)

  return {
    props: reactive({
      collectionType: webflow.currentCollectionType.value,
      collection,
    }),
    on: {
      refreshCollection: async () => {
        await webflowCollectionRefetch()
      },
      clickBack: () => {
        ctx.back()
      },
      clickSync: () => {
        const mapping = computed(() => {
          return Object.entries(onboardingResult.value?.webflowOnboarding.mapping || []).find(
            ([_type, value]) => typeof value === 'boolean' && !value,
          )
        })

        if (!webflow.hasCompletedOnboarding.value && !webflow.isAlreadyCompletedOnboarding.value) {
          sendTrack('webflow_onboarding_step_completed', {
            step_name: 'field_mapping',
            mapping_collection: webflow.currentCollectionType.value as WebflowCollectionType,
            is_skipped: false,
          })
        }
        ctx.next(async ({ currentStep, hasCompletedOnboarding, isAlreadyCompletedOnboarding }) => {
          await onboardingRefetch()
          if (mapping.value?.length) {
            currentStep.value = Steps.CollectionMapStart
          } else {
            if (!hasCompletedOnboarding.value && !isAlreadyCompletedOnboarding.value) {
              sendTrack('webflow_onboarding_step_completed', {
                step_name: 'onboard_completed',
              })
              await ctx.hooks.callHook('afterOnboarding', ctx)
            }
            hasCompletedOnboarding.value = true
            currentStep.value = Steps.Panel
            ctx.close()
          }
        })
      },
    },
  }
}

function useSettingPanel(ctx: StepsContext) {
  return {
    props: {},
    on: {
      mapping: (type: WebflowCollectionType) => {
        ctx.next(({ currentStep, currentCollectionType }) => {
          currentCollectionType.value = type
          currentStep.value = Steps.CollectionMapSetup
        })
      },
      disconnect: async () => {
        await ctx.initOnboarding()
        ctx.next(({ currentStep }) => {
          currentStep.value = Steps.Connect
          ctx.close()
        })
      },
    },
  }
}

export function useStepContext({
  setCurrentStep,
  useInitCurrentStep,
}: {
  setCurrentStep: (step: Steps) => void
  useInitCurrentStep: () => Promisable<void>
}): StepsContext {
  const context: Context = reactive({
    currentStep: Steps.Connect,
    currentCollectionType: undefined,
    uncompletedCollectionType: undefined,
    visible: false,
    hasAuthorized: false,
    hasCompletedOnboarding: false,
    isAlreadyCompletedOnboarding: false,
    manualMapping: false,
    isLoading: false,
    isReady: false,
    loadingMessage: '',
    initOnboarding: false,
  })

  return {
    webflow: { ...toRefs(context) },
    hooks: createHooks(),
    open: () => (context.visible = true),
    close: () => (context.visible = false),
    back: () => {
      if (context.hasCompletedOnboarding || context.isAlreadyCompletedOnboarding) {
        context.currentStep = Steps.Panel
      } else {
        context.currentStep -= 1
      }
      setCurrentStep(context.currentStep)
    },
    next: async (handler) => {
      const ctx = toRefs<Context>(context)
      await handler({ ...ctx })
      setCurrentStep(context.currentStep)
    },
    loading: async (time, message) => {
      context.loadingMessage = message
      context.isLoading = true
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve(true)
        }, time),
      )
      context.isLoading = false
      context.loadingMessage = ''
    },
    finishOnboarding: () => {
      sendTrack('webflow_onboarding_step_completed', {
        step_name: 'onboard_completed',
      })
    },
    initOnboarding: async () => {
      await useInitCurrentStep()
    },
  }
}
