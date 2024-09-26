import { acceptHMRUpdate, defineStore } from 'pinia'
import type { GetMeEmailQuery, GetMeQuery } from '~/graphql-operations'
import { GetMeDocument, GetMeEmailDocument } from '~/graphql-operations'
import { useAuthStore } from '~/stores/auth'

export const useMeStore = defineStore('me', {
  state: () => ({
    me: undefined as GetMeQuery['me'] | undefined,
    userIdentification: undefined as GetMeEmailQuery['me'] | undefined,
  }),
  actions: {
    fetchMe() {
      const store = useAuthStore()
      if (store.isAuth) {
        if (store.clientID && store.clientID !== 'default') {
          const { result } = useQuery(GetMeDocument)
          const me = computed(() => result.value?.me)
          syncRef(me, toRef(this, 'me'), { direction: 'ltr' })
        }
      } else {
        throw new Error('Unauthenticated')
      }
    },
    fetchMeEmail() {
      const store = useAuthStore()
      if (store.isAuth) {
        const { result } = useQuery(GetMeEmailDocument)
        syncRef(
          computed(() => result.value?.me),
          toRef(this, 'userIdentification'),
          { direction: 'ltr' },
        )
      } else {
        throw new Error('Unauthenticated')
      }
    },
    initialize() {
      this.fetchMe()
      this.fetchMeEmail()
    },
    reInitialize() {
      this.$reset()
      this.initialize()
    },
    async prepareForUsing() {
      if (this.me === undefined) this.initialize()
    },
  },
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useMeStore, import.meta.hot))
