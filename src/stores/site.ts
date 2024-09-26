import { defineStore } from 'pinia'
import type { GetSiteQuery, SubscriptionSetup } from '~/graphql-operations'
import { GetSiteDocument, GetSiteTutorialsDocument } from '~/graphql-operations'
import type { TutorialKeyType } from '~/components/Navbar/definition'
import { query } from '~/lib/apollo'
import { useAuthStore } from '~/stores/auth'

export const useSiteStore = defineStore('site', {
  state: () => ({
    site: undefined as GetSiteQuery['site'] | undefined,
    siteTutorials: {} as Record<TutorialKeyType, boolean>,
    showNewDeskTutorials: false,
    subscription: undefined as undefined | boolean,
    subscriptionSetup: 'none' as SubscriptionSetup,
  }),
  actions: {
    async fetchSite() {
      const store = useAuthStore()
      if (store.isAuth) {
        if (store.clientID && store.clientID !== 'default') {
          const { data } = await query(store.clientID, GetSiteDocument)
          this.site = data?.site
        }
      } else {
        throw new Error('Unauthenticated')
      }
    },
    async fetchSiteTutorials() {
      const store = useAuthStore()
      if (store.isAuth) {
        if (store.clientID && store.clientID !== 'default') {
          const { data } = await query(store.clientID, GetSiteTutorialsDocument)
          this.siteTutorials = JSON.parse(data?.site.tutorials)
        }
      } else {
        throw new Error('Unauthenticated')
      }
    },
    async fetchSiteSubscription() {
      const store = useAuthStore()
      if (store.isAuth) {
        if (store.clientID && store.clientID !== 'default') {
          const { data } = await query(store.clientID, GetSiteDocument)
          this.subscriptionSetup = data.site.subscription_setup
          this.subscription = data.site.subscription
        }
      } else {
        throw new Error('Unauthenticated')
      }
    },
    changeNewDeskTutorials(status: boolean) {
      this.showNewDeskTutorials = status
    },
  },
})
