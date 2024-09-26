<route lang="yaml">
meta:
  layout: auth
</route>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as Yup from 'yup'
import Card from '~/components/Auth/Card/Card.vue'
import { LICENSE_BASE_SOURCE, useLicenseCode, useWithCurrentQuery } from '~/composables'
import { useUserTimezone } from '~/composables/timezones'
import { env } from '~/env'
import { SignUpDocument } from '~/graphql-operations'
import { getUTM } from '~/lib/analytics'
import { reditus } from '~/lib/integrations'
import { sendLinkedInConvert } from '~/lib/linkedin-track'
import { useAuthStore } from '~/stores/auth'
import { useSignupStore } from '~/stores/signup'
import { getFirstCompletionStep } from '../completion/use-signup-complete'
import AppSumo from '../components/appsumo.vue'
import NewUser from '../components/new-user.vue'
import { isCompanyEmail } from './is-company-email'

defineOptions({
  name: 'SignupDefault',
})

useHead({
  title: 'Sign up - Storipress',
})

const route = useRoute()

const authStore = useAuthStore()
const signupStore = useSignupStore()
const { signupInfo } = signupStore

const {
  source,
  client,
  email: queryEmail,
  appsumoCode,
  isInvite,
  isAppsumo,
  errorKey,
  errorMessage,
  routeQuery,
} = toRefs(signupStore)
source.value = route.query.source as string
client.value = route.query.client as string
queryEmail.value = route.query.email as string
appsumoCode.value = route.query.appsumo_code as string
routeQuery.value = route.query

if (queryEmail.value) {
  signupInfo.email = queryEmail.value as string
}

const showLicenseCode = computed(() => LICENSE_BASE_SOURCE.has(source.value))

const Welcome = computed(() => (isAppsumo.value ? AppSumo : NewUser))

const baseSchema = {
  email: Yup.string()
    .email()
    .required()
    .test({
      name: 'free-email',
      message: 'Please use your company email',
      test: (email) => {
        // if there is a signup source, ignore this check
        if (source.value) {
          return true
        }
        return isCompanyEmail(email)
      },
    })
    .label('Email'),
  password: Yup.string().min(8).required().label('Password'),
}
const nameSchema = {
  firstName: Yup.string().required().label('First name'),
  lastName: Yup.string().required().label('Last name'),
}
const schema = Yup.object().shape({
  ...baseSchema,
  ...nameSchema,
  ...(!isInvite.value && {
    publicationName: Yup.string().label('Publication name').required(),
  }),
  ...(showLicenseCode.value && {
    licenseCode: Yup.string().label('License code').required().uuid('invalid license code'),
  }),
})

const router = useRouter()

router.replace('/auth/login')

const { updateWithErrorNotify } = useLicenseCode(source)

const presetEmail = ref(false)
const userEmail = useSessionStorage('user-email', '')
if (userEmail.value) {
  signupInfo.email = userEmail.value
  presetEmail.value = true
  userEmail.value = ''
}

const { handleSubmit, setFieldError, values } = useForm({
  initialValues: {
    email: '',
    password: '',
  } as Record<string, string>,
  validationSchema: schema,
})

const EMPTY_FORM_VALUE = {
  email: '',
  firstName: '',
  lastName: '',
  publicationName: '',
  isCompanyEmail: false,
}
const previousTrack = shallowRef(EMPTY_FORM_VALUE)

watchDebounced(
  () => values,
  ({ email, firstName, lastName, publicationName }) => {
    if (!email && !firstName && !lastName && !publicationName) {
      previousTrack.value = EMPTY_FORM_VALUE
      return
    }
    if (
      email === previousTrack.value.email &&
      firstName === previousTrack.value.firstName &&
      lastName === previousTrack.value.lastName &&
      publicationName === previousTrack.value.publicationName
    ) {
      return
    }
    const trackProperties = {
      email,
      firstName,
      lastName,
      publicationName,
      isCompanyEmail: isCompanyEmail(email),
    }
    previousTrack.value = trackProperties
    sendTrack('user_filled_signup_form', trackProperties)
  },
  { deep: true, debounce: 500, maxWait: 2000 },
)

const isCheckoutIDValid = ref(false)

const { withQuery } = useWithCurrentQuery()
const { mutate: signUpMutate, loading: signUpLoading } = useMutation(SignUpDocument)
const nextStep = handleSubmit(async () => {
  try {
    const utm = getUTM()
    const nameInput = {
      first_name: signupInfo.firstName,
      last_name: signupInfo.lastName,
    }

    if (!showLicenseCode.value || !authStore.token) {
      const result = await signUpMutate({
        input: {
          email: signupInfo.email,
          password: signupInfo.password,
          timezone: useUserTimezone(),
          campaign: utm ? JSON.stringify(utm) : undefined,
          ...nameInput,
          ...(isCheckoutIDValid.value && {
            checkout_id: route.query.checkout_id as string,
          }),
          ...(isAppsumo.value && {
            appsumo_code: appsumoCode.value as string,
          }),
          ...(!isInvite.value && {
            publication_name: signupInfo.publicationName,
          }),
        },
      })

      if (!result?.data?.signUp?.access_token) throw new Error('No token')
      sendIdentify(result.data.signUp.user_id, {
        email: signupInfo.email,
      })
      reditus('track', 'conversion', { email: signupInfo.email })
      sendLinkedInConvert(env.VITE_LINKEDIN_CONVERSION_ID_SIGNUP)

      authStore.token = result.data.signUp.access_token
      sendTrackUnchecked('onboarding_step_completed', {
        step: 1,
        stepName: 'account_publication',
      })
    }

    if (showLicenseCode.value && !(await updateWithErrorNotify(signupInfo.licenseCode))) {
      return
    }

    if (isInvite.value) {
      const redirect = withQuery('/auth/completion/survey')
      router.replace(redirect)
      return
    }
  } catch (error: unknown) {
    if (error instanceof ApolloError) {
      const errorExtensions = error.graphQLErrors[0]?.extensions
      if (errorExtensions) {
        errorKey.value = (errorExtensions.validation as any)?.email?.[0] || 'other'
      } else {
        captureException(new Error('Fail to signup', { cause: error }))
        errorKey.value = 'other'
      }
    }
    onEmailFail()
    return
  }

  const nextStep = getFirstCompletionStep()
  router.replace(nextStep.path)
})

function onEmailFail() {
  setFieldError('email', errorMessage.value)
  errorKey.value = ''
}
</script>

<template>
  <Card title="Storipress is currently not open to signups">
    <template #description>
      <component :is="Welcome" />
    </template>
    <div class="text-body">
      <div class="mb-2 text-stone-500">
        By proceeding, you agree to our
        <a href="https://storipress.com/legal/terms" target="_blank" rel="noopener noreferrer" class="text-emerald-700">
          Terms and Conditions
        </a>
      </div>
      <div>
        <div class="text-stone-500">
          Already have an account? <router-link class="text-emerald-700" to="/auth/login">Log in</router-link>
        </div>
      </div>
    </div>
  </Card>
</template>
