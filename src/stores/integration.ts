import { defineStore } from 'pinia'
import { isIntegrationConnectedWithData } from './integration-helper'
import { query } from '~/lib/apollo'
import { useAuthStore } from '~/stores/auth'
import { useWorkspaceStore } from '~/stores/workspace'
import { ListIntegrationsDocument } from '~/graphql-operations'
import type { IntegrationConfiguration, ListIntegrationsQuery } from '~/graphql-operations'
import { env } from '~/env'

type Integrations = 'twitter' | 'facebook' | 'slack' | 'shopify' | 'webflow' | 'linkedin'
type Referrer = 'migration' | 'integration' | 'onboarding'
export const SOCIAL_INTEGRATIONS = new Set(['twitter', 'facebook', 'slack', 'shopify', 'webflow', 'linkedin'])

export type IntegrationItem = ListIntegrationsQuery['integrations'][number]

export const useIntegrationStore = defineStore('integration', {
  state: () => ({
    integrations: [] as IntegrationItem[],
  }),
  getters: {
    socialIntegrations(state) {
      return state.integrations.filter((integration) => SOCIAL_INTEGRATIONS.has(integration.key))
    },
  },
  actions: {
    async fetchIntegrations() {
      const store = useAuthStore()
      if (store.isAuth) {
        const { data } = await query(store.clientID, ListIntegrationsDocument)
        this.integrations = data?.integrations
      } else {
        throw new Error('Unauthenticated')
      }
    },

    delay(time: number) {
      return new Promise((resolve) => setTimeout(resolve, time))
    },

    async delayFetchIntegrations() {
      await this.delay(1000)
      await this.fetchIntegrations()
    },

    socialData(type: Integrations) {
      if (!this.socialIntegrations.length) return
      if (type === 'linkedin' || type === 'webflow') {
        return this.socialIntegrations.find((item) => item.key === type)?.configuration
      }
      const data = this.socialIntegrations.find((item) => item.key === type)?.data
      if (!data) return null
      return JSON.parse(data)
    },

    socialActivateStatus(type: Integrations) {
      if (!this.socialIntegrations.length) return
      return this.socialIntegrations.find((item) => item.key === type)?.activated_at
    },

    socialConnectStatus(type: Integrations) {
      return computed(() => {
        if (!this.socialIntegrations.length || !SOCIAL_INTEGRATIONS.has(type)) {
          return {
            isConnected: false,
            active: false,
            data: null,
          }
        }

        const active = this.socialActivateStatus(type)
        const rawData = this.socialData(type)
        const data = Array.isArray(rawData) ? (rawData.length > 0 ? rawData : null) : rawData
        return {
          isConnected: active && data,
          active,
          data,
        }
      })
    },

    getSocialConfiguration<T extends IntegrationConfiguration>(type: Integrations) {
      if (!this.socialIntegrations.length) return
      return this.socialIntegrations.find((item) => item.key === type)?.configuration as T
    },

    isSocialConnected(type: Integrations) {
      const status = this.socialConnectStatus(type)
      return computed(() => {
        return status.value.isConnected
      })
    },

    getSocialConnectUrl(type: Integrations, referrer?: Referrer) {
      const store = useAuthStore()
      const workspaceStore = useWorkspaceStore()
      const currentWorkspace = computed(() => {
        return {
          id: workspaceStore.currentWorkspace?.id ?? '',
        }
      })

      const apiHost = env.VITE_API_HOST
      const clientID = currentWorkspace.value.id

      if (type === 'linkedin') {
        return `${apiHost}/partners/${type}/connect?api-token=${store.token}&client_id=${clientID}`
      } else {
        const data = this.socialData(type)
        const isConnected = isIntegrationConnectedWithData(data)
        const connectType = isConnected ? 'disconnect' : 'connect'
        if (type === 'shopify') {
          return `${apiHost}/partners/${type}/${connectType}?client_id=${clientID}&api-token=${store.token}&referrer=${referrer}`
        }

        return `${apiHost}/client/${clientID}/${type}/${connectType}?api-token=${store.token}`
      }
    },

    editorSocialConnect(type: 'twitter' | 'facebook' | 'linkedin') {
      const store = useAuthStore()
      const workspaceStore = useWorkspaceStore()
      const currentWorkspace = computed(() => {
        return {
          id: workspaceStore.currentWorkspace?.id ?? '',
        }
      })

      return computed(() => {
        if (type === 'linkedin') {
          return `${env.VITE_API_HOST}/partners/${type}/connect?api-token=${store.token}&client_id=${currentWorkspace.value.id}`
        }
        return `${env.VITE_API_HOST}/client/${currentWorkspace.value.id}/${type}/connect?api-token=${store.token}`
      })
    },

    reset() {
      this.integrations = []
    },
  },
})
