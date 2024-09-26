import { captureException, captureMessage } from '@sentry/vue'
import delay from 'delay'
import { useAuthStore } from '~/stores/auth'
import { useGlobalIntegration } from '~/stores/global-integration'
import { Integrations, RedirectTarget, useNotification, useRedirectPortal } from '~/composables'
import { SetupWordpressDocument } from '~/graphql-operations'
import { mutate } from '~/lib/apollo'

export enum ChoosePublicationAction {
  Webflow = 'webflow',
  Shopify = 'shopify',
  Wordpress = 'wordpress',
  Integration = 'integration',
  Other = 'other',
}

const ACTION_MESSAGE: Record<string, string> = {
  [ChoosePublicationAction.Webflow]: 'Choose a publication to connect Webflow integration',
  [ChoosePublicationAction.Wordpress]: 'Choose a publication to connect Wordpress integration',
  [ChoosePublicationAction.Shopify]: 'Choose a publication to connect Shopify integration',
}

const ACTION_ONLY_ALLOW_ADMIN = new Set([
  ChoosePublicationAction.Webflow,
  ChoosePublicationAction.Integration,
  ChoosePublicationAction.Shopify,
  ChoosePublicationAction.Wordpress,
])

const ADMIN_TABS = ['owner', 'admin']

export function useChoosePublicationAction(action_ = useDetectAction()) {
  const action = ref(action_)
  const authStore = useAuthStore()
  const globalIntegration = useGlobalIntegration()
  const router = useRouter()
  const route = useRoute()
  function setupWordpress(clientID: string, variables: { code: string }) {
    return mutate(clientID, SetupWordpressDocument, variables)
  }
  const { create } = useNotification()
  const portal = useRedirectPortal()

  function showWordpressConnectSuccess() {
    create({
      title: 'WordPress integration has been activated',
    })
  }

  function showWordpressConnectError() {
    create({
      type: 'warning',
      iconName: 'warning',
      title: 'WordPress integration activation failed. Please try again.',
    })
  }

  function clearActionAndStay() {
    action.value = null
    router.replace({
      path: '/workspaces',
    })
  }

  return {
    hasAction: computed(() => Boolean(action.value)),
    message: computed(() => {
      if (!action.value) return 'My Publications'

      const message = ACTION_MESSAGE[action.value] ?? 'Choose a publication to continue the process'
      return message
    }),
    includeTabs: computed(() => {
      if (!action.value) return null

      const onlyAdmin = ACTION_ONLY_ALLOW_ADMIN.has(action.value)
      return onlyAdmin ? ADMIN_TABS : null
    }),
    handleAction: async ({ event, navigate, clientId }: { event: Event; navigate: () => void; clientId: string }) => {
      switch (action.value) {
        case ChoosePublicationAction.Webflow: {
          event.preventDefault()
          globalIntegration.showGlobalIntegration = true
          authStore.clientID = clientId

          globalIntegration.showWebflow({
            beforeAuth(_ctx, connectWebflow) {
              // skip clicking connect button
              connectWebflow()
            },
            afterOnboarding() {
              navigate()
              // delay cleanup state to prevent bug
              nextTick(() => {
                globalIntegration.showGlobalIntegration = false
              })
            },
          })
          break
        }
        case ChoosePublicationAction.Wordpress: {
          event.preventDefault()
          const codeQuery = route.query.code
          const code = Array.isArray(codeQuery) ? codeQuery[0] : codeQuery

          if (!code) {
            showWordpressConnectError()
            captureMessage('No wordpress code')
            return
          }

          try {
            const res = await setupWordpress(clientId, {
              code,
            })

            if (!res?.data?.setupWordPress || res.errors) {
              sendTrack('wordpress_onboarding_failed')
              showWordpressConnectError()
              clearActionAndStay()
              return
            }
          } catch (error) {
            captureException(error)
            sendTrack('wordpress_onboarding_failed')
            showWordpressConnectError()
            clearActionAndStay()
            return
          }

          // backend need some time to setup Wordpress integration
          // In this period, Wordpress integration is show as deactivated and may confuse user
          sendTrack('wordpress_onboarding_succeeded')
          showWordpressConnectSuccess()
          // typically wp connect won't longer then 1s, wait it to ensure consistent state
          await delay(1000)
          portal({
            integration: Integrations.WordPress,
            to: RedirectTarget.Integration,
            client_id: clientId,
          })
          break
        }
        case ChoosePublicationAction.Shopify:
        case ChoosePublicationAction.Integration:
        case ChoosePublicationAction.Other: {
          event.preventDefault()
          authStore.clientID = clientId
          router.push({
            path: '/redirect',
            query: {
              // make it default to `integration` as shopify install route won't have the `to` query
              to: action.value === ChoosePublicationAction.Shopify ? 'integration' : null,
              ...route.query,
              client_id: clientId,
              sp_from: 'workspaces',
            },
          })
          break
        }
        default: {
          navigate()
        }
      }
      // set workspace selector back to normal mode after clicked
      action.value = null
    },
  }
}

export function useDetectAction(): ChoosePublicationAction | null {
  const route = useRoute()

  if (route.query.integration === 'webflow') {
    return ChoosePublicationAction.Webflow
  }

  if (route.query.integration === 'wordpress') {
    return ChoosePublicationAction.Wordpress
  }

  if (route.query.integration === 'shopify') {
    return ChoosePublicationAction.Shopify
  }

  if (route.query.sp_from !== 'redirect') return null

  if (route.query.to === RedirectTarget.Integration) {
    return ChoosePublicationAction.Integration
  }

  return ChoosePublicationAction.Other
}
