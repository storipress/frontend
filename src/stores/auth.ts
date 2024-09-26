import { defineStore } from 'pinia'
import { env } from '~/env'

export const useAuthStore = defineStore('client', () => {
  const clientID = ref('')
  const defaultClientID = ref('default')
  const apiPath = computed(() => (clientID.value ? `/client/${clientID.value}/graphql` : '/graphql'))
  const apiURL = computed(() => env.VITE_API_HOST + apiPath.value)
  const token = useStorage('storipress-token', '')
  const isAuth = computed(() => token.value !== '')
  const isResetPassword = ref(false)

  return {
    clientID,
    defaultClientID,
    token,
    isResetPassword,

    isAuth,
    apiPath,
    apiURL,
    $reset() {
      clientID.value = ''
      token.value = ''
    },
  }
})
