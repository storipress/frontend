import { defineStore } from 'pinia'
import type { LocationQuery } from 'vue-router'

export const useSignupStore = defineStore('signup', () => {
  const source = ref('')
  const client = ref('')
  const email = ref('')
  const appsumoCode = ref('')
  const routeQuery = ref<LocationQuery>({})

  const errorData = {
    email: 'This email is invalid. Please correct the email format.',
    unique: 'The email address has already been allocated to another user.',
    other: 'Oops... something went wrong. Please reload the page to try again',
  }
  const errorKey = ref<keyof typeof errorData | ''>('')
  const errorMessage = computed(() => errorKey.value && errorData[errorKey.value])

  const isInvite = computed(() => source.value === 'invitation')
  const isAppsumo = computed(() => source.value === 'appsumo')
  const isProphet = computed(() => source.value === 'prophet')
  const isCreateNewPublication = computed(() => routeQuery.value?.redirect?.includes('create-publication'))

  const signupInfo = reactive({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    publicationName: '',
    couponCode: '',
    licenseCode: '',
  })
  return {
    source,
    client,
    email,
    appsumoCode,
    routeQuery,

    errorKey,
    errorMessage,

    isInvite,
    isAppsumo,
    isProphet,
    isCreateNewPublication,

    signupInfo,
  }
})
