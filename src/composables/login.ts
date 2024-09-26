import type { Ref } from 'vue'
import { useRouteQuery } from '@vueuse/router'
import { EventType, UpolloClient } from '@upollo/web'
import * as Sentry from '@sentry/vue'
import { ApolloError } from '@apollo/client/core'
import { useNotification } from './notification'
import { useInvitedProfileCheck } from './invited-profile'
import { useLoading } from './loading'
import { useWithCurrentQuery } from './with-current-query'
import { CheckEmailExistDocument, GetMeEmailDocument, ImpersonateDocument, LoginDocument } from '~/graphql-operations'
import { useAuthStore } from '~/stores/auth'
import { useMeStore } from '~/stores/me'
import { useApolloClient } from '~/lib/apollo'
import { env } from '~/env'

const upollo = new UpolloClient(env.VITE_UPOLLO_API_KEY || '')

export enum LoginStep {
  FillInEmail = 0,
  FillInPassword = 1,
}

export enum ErrorKey {
  RateLimit = 'rate-limit',
  InvalidPassword = 'invalid-password',
}

export interface LoginError {
  key: ErrorKey
  message: string
}

interface LoginArgs {
  email: string
  password: string
}

const errorMap = {
  [ErrorKey.RateLimit]: "You've tried this too many times! Wait 3 minutes to try again or reset your password",
  [ErrorKey.InvalidPassword]: 'Your password was incorrect',
}

const { loading: loginLoading } = useLoading()

const userEmail = useSessionStorage('user-email', '', { flush: 'sync' })

interface UseLoginAPIReturn {
  login: (loginForm: LoginArgs) => Promise<string | undefined>
  loading: Ref<boolean>
}

export function useLoginApi(): UseLoginAPIReturn {
  const { mutate, loading } = useMutation(LoginDocument)
  const login = async (loginForm: LoginArgs) => {
    const result = await mutate(loginForm)

    if (result?.data?.signIn) return result.data.signIn.access_token
  }
  return { login, loading }
}

export function useImpersonateLoginApi(): UseLoginAPIReturn {
  const { mutate, loading } = useMutation(ImpersonateDocument)
  const login = async (loginForm: LoginArgs) => {
    const result = await mutate(loginForm)

    if (result?.data?.impersonate) return result.data.impersonate
  }
  return { login, loading }
}

export function useRedirect() {
  const router = useRouter()
  const redirectPath = useRouteQuery('redirect')
  const store = useAuthStore()

  const redirect = () => {
    const redirectTarget = redirectPath.value
    if (store.token && typeof redirectTarget === 'string' && redirectTarget.startsWith(location.origin)) {
      const url = new URL(redirectTarget)
      url.searchParams.set('token', store.token)
      location.href = url.toString()
    } else if (typeof redirectTarget !== 'string') {
      router.replace('/auth/login')
    }
  }
  return { redirect }
}

export function useLogin({ login, loading }: UseLoginAPIReturn, afterLoginHandler?: () => void) {
  const afterLoginHook = createEventHook<void>()
  const loginForm = reactive({
    email: '',
    password: '',
  })
  const currentStep = ref(LoginStep.FillInEmail)
  const isLogin = ref(false)
  const error = ref<LoginError | undefined>(undefined)

  const router = useRouter()
  const route = useRoute()
  const { withQuery } = useWithCurrentQuery()
  const store = useAuthStore()
  const meStore = useMeStore()
  const { checkProfileFilled } = useInvitedProfileCheck()
  const { create: notifications } = useNotification()

  const redirect = useStorage('redirect-path', '', sessionStorage)

  if (store.isResetPassword) {
    loginForm.email = userEmail.value
    currentStep.value = LoginStep.FillInPassword
  }

  const initEmailSessionStorage = () => {
    userEmail.value = ''
  }

  const reset = () => {
    userEmail.value = ''
    loginForm.password = ''
    error.value = undefined
    store.isResetPassword = false
  }

  whenever(
    () => currentStep.value === LoginStep.FillInEmail,
    () => {
      reset()
    },
  )
  onUnmounted(() => {
    store.isResetPassword = false
  })

  const { mutate: checkEmailMutate, loading: checkEmailLoading } = useMutation(CheckEmailExistDocument)

  const onSubmitEmail = async () => {
    error.value = undefined
    try {
      const result = await checkEmailMutate({
        email: loginForm.email,
      })
      userEmail.value = loginForm.email
      if (result?.data?.checkEmailExist) {
        currentStep.value = LoginStep.FillInPassword
        return true
      } else {
        router.push(withQuery('/auth/signup'))
        return false
      }
    } catch (e: unknown) {
      if (e instanceof ApolloError) {
        const message = e.graphQLErrors[0].message
        if (message.startsWith('Rate limit')) {
          error.value = {
            key: ErrorKey.RateLimit,
            message: errorMap[ErrorKey.RateLimit],
          }

          notifications({
            title: errorMap[ErrorKey.RateLimit],
            type: 'warning',
            iconName: 'warning',
          })
        } else {
          Sentry.captureException(error)
        }
      }
    }
    return false
  }

  const onSubmitPassword = async () => {
    isLogin.value = true
    error.value = undefined
    try {
      const result = await login(loginForm)

      if (result) {
        store.token = result
        const { client } = useApolloClient()
        const { data, error } = await client.query({
          query: GetMeEmailDocument,
        })
        if (data) {
          if (env.VITE_UPOLLO_API_KEY) {
            if (route.name === 'auth-user-impersonate') return
            upollo.track({ userId: data.me.id, userEmail: userEmail.value }, EventType.EVENT_TYPE_LOGIN_SUCCESS)
          }
          await afterLoginHook.trigger()
        } else {
          Sentry.captureException(error ?? new Error('fail to fetch user info after login'))
        }

        if (afterLoginHandler) {
          await loginLoading()
          afterLoginHandler()
          return
        }
        meStore.fetchMeEmail()
        if (route.query.redirect) {
          const location = router.resolve(route.query.redirect as string)
          const clientID =
            location.params.clientID && typeof location.params.clientID === 'string' ? location.params.clientID : null
          if (clientID) {
            const needFillProfile = await checkProfileFilled(location.params.clientID as string)
            if (needFillProfile) {
              await router.replace(`/${clientID}/invited`)
              return
            }
          }
          await router.replace(location)
        } else {
          await loginLoading()
          if (redirect.value) {
            router.replace(redirect.value)
            redirect.value = null
            return
          }
          router.replace('/workspaces')
        }
      }
    } catch (e: unknown) {
      if (e instanceof ApolloError) {
        const message = e.graphQLErrors[0].message
        if (message.startsWith('Rate limit')) {
          error.value = {
            key: ErrorKey.RateLimit,
            message: errorMap[ErrorKey.RateLimit],
          }

          notifications({
            title: errorMap[ErrorKey.RateLimit],
            type: 'warning',
            iconName: 'warning',
          })
        } else {
          error.value = {
            key: ErrorKey.InvalidPassword,
            message: errorMap[ErrorKey.InvalidPassword],
          }
        }
      }
      isLogin.value = false
    }
  }

  const onSubmit = async ({ email, password }: LoginArgs) => {
    switch (currentStep.value) {
      case LoginStep.FillInEmail:
        loginForm.email = email
        loginForm.password = password
        if (await onSubmitEmail()) {
          if (password) {
            await onSubmitPassword()
          }
        }
        break
      case LoginStep.FillInPassword:
        loginForm.password = password
        await onSubmitPassword()
        break
      default:
        throw new Error('invalid state')
    }
  }

  return {
    currentStep,
    error,
    loginForm,
    isLogin,
    initEmailSessionStorage,
    onSubmit,
    checkEmailLoading,
    loading,
    onAfterLogin: afterLoginHook.on,
  }
}
