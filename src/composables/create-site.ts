import * as Sentry from '@sentry/vue'
import type { Promisable } from 'type-fest'
import { noop } from 'lodash-es'
import { useLoading } from '~/composables'
import { query } from '~/lib/apollo'
import { CreateSiteDocument, GetSiteDocument, ListPublicationsDocument } from '~/graphql-operations'

export function useCreateSite(
  onCreated: (id: string, redirect: (path?: string) => Promise<void>) => Promisable<void> = noop,
) {
  const { loading, transformDescription, ready } = useLoading()
  const clientID = ref('')
  const stopCheckTenant = ref(false)
  const { onDone, mutate, loading: loadingCreateSite } = useMutation(CreateSiteDocument)
  const router = useRouter()
  const doneHook = createEventHook<string>()
  const redirect = async (path = `/${clientID.value}/articles/desks/all`) => {
    if (!clientID.value) {
      return
    }

    await router.replace({ path })
  }

  const checkTenant = async (id: string, onSuccess: () => void) => {
    try {
      const result = await query(id, GetSiteDocument)
      if (result.data.site) {
        onSuccess()
        await loading({
          loadingIcon: false,
          title: 'Success, your publication is ready to go!',
          interval: 1000,
        })
        clientID.value = id
        await onCreated(id, redirect)
        ready()
        doneHook.trigger(id)
      }
    } catch (e) {
      if (!stopCheckTenant.value) {
        setTimeout(async () => await checkTenant(id, onSuccess), 1000)
      }
    }
  }

  onDone(({ data }) => {
    if (data?.createSite) {
      startLoading(data.createSite)
    }
  })

  async function startLoading(maybeID?: string) {
    const publicationListPromise = query('default', ListPublicationsDocument, undefined, {
      fetchPolicy: 'network-only',
    })
    async function getClientID() {
      if (maybeID) {
        return maybeID
      }
      const { data } = await publicationListPromise
      return data.publications[0].id
    }
    await loading({
      title: 'Creating your publication',
    })
    await transformDescription({
      descriptions: [
        '1 of 3: Confirming your account',
        '2 of 3: Initializing your publication',
        '3 of 3: Applying publication settings',
        'Finalizing your publication. Keep your browser window open.',
      ],
    })
    await loading({
      title: 'Creating your publication',
      interval: 3000,
    })
    const id = await getClientID()
    const clearWarningTimer = createTimeout(5000, () => {
      Sentry.captureException(new Error('tenant creation more than 20 seconds'), (scope) => {
        scope.setTag('request_fail', 'createSite')
        return scope
      })
    })
    const clearTimeoutTimer = createTimeout(15000, () => {
      stopCheckTenant.value = true
      Sentry.captureException(new Error('tenant creation more than 30 seconds'), (scope) => {
        scope.setTag('request_fail', 'createSite')
        return scope
      })
    })
    await checkTenant(id, () => {
      clearWarningTimer()
      clearTimeoutTimer()
    })
  }

  return {
    clientID,
    mutate,
    mutateCreateSite: mutate,
    loadingCreateSite,
    startLoading,
    redirect,
    onDone: doneHook.on,
  }
}

function createTimeout(time: number, handler: () => void) {
  let dismiss = noop
  const timer = setTimeout(() => {
    handler()
    dismiss()
  }, time)
  dismiss = () => {
    clearTimeout(timer)
    dismiss = noop
  }
  return () => {
    dismiss()
  }
}
