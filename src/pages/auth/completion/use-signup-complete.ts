import invariant from 'tiny-invariant'
import * as Sentry from '@sentry/vue'
import { GetBillingDocument, ListPublicationsDocument } from '~/graphql-operations'
import { query, useQuery } from '~/lib/apollo'
import { useMeMeta, useWaitCondition, useWithCurrentQuery } from '~/composables'

enum Steps {
  Survey = 'surveyMeta',
  Checkout = 'subscribed',
}

const steps = [
  { key: Steps.Survey, path: '/auth/completion/survey' },
  { key: Steps.Checkout, path: '/auth/completion/checkout' },
]

export function useSignupCompletion() {
  const router = useRouter()
  const route = useRoute()
  const { withQuery } = useWithCurrentQuery()

  const { result: billingResult, refetch: refetchBilling } = useQuery(GetBillingDocument)
  const { userMeta } = useMeMeta()
  const getClientID = useWaitCondition({
    check: () => _getClientID(),
    title: 'Creating your publication',
    descriptionOptions: {
      descriptions: [
        '1 of 3: Confirming your account',
        '2 of 3: Initializing your publication',
        '3 of 3: Applying publication settings',
        'Finalizing your publication. Keep your browser window open.',
      ],
    },
    maxRetry: 30,
    async beforeReturn({ loading }) {
      await loading({
        loadingIcon: false,
        title: 'Success, your publication is ready to go!',
        interval: 1000,
      })
    },
    notifyOptions: [
      {
        timeout: '5 seconds',
        handler: () => {
          Sentry.captureException(new Error('tenant creation more than 5 seconds'))
        },
      },
      {
        timeout: '15 seconds',
        handler: () => {
          Sentry.captureException(new Error('tenant creation more than 15 seconds'))
        },
      },
      {
        timeout: '25 seconds',
        handler: () => {
          Sentry.captureException(new Error('tenant creation more than 25 seconds'))
        },
      },
    ],
  })

  const status = computed(() => {
    return {
      subscribed: billingResult.value?.billing?.has_pm || billingResult.value?.billing?.subscribed,
      surveyMeta: userMeta.value?.survey,
    }
  })

  /**
   * @notice Must check signup and create publication flow after modify this function
   */
  const getIncompleteStep = async () => {
    await refetchBilling()
    const result = steps.find((step) => !status.value[step.key])

    if (result) {
      return withQuery(result.path)
    }

    // create publication flow should go though here
    if (route.query.redirect && !Array.isArray(route.query.redirect)) {
      const redirectTarget = withQuery(route.query.redirect)
      router.replace(redirectTarget)
      return null
    }

    invariant(!Array.isArray(route.query.redirect), 'unexpected multiple redirect target')

    // ! this step will block current flow and ensure user has a publication
    const clientId = await getClientID()

    invariant(clientId, 'client id not defined for migrate step')
    router.replace('/auth/completion/book-onboarding-call')

    return null
  }

  async function _getClientID(): Promise<string | undefined> {
    const publicationListPromise = query('default', ListPublicationsDocument, undefined, {
      fetchPolicy: 'network-only',
    })
    const { data } = await publicationListPromise
    return data.publications[0]?.id
  }

  return {
    getIncompleteStep,
  }
}

export function getFirstCompletionStep() {
  return steps[0]
}
