import { destr } from 'destr'
import { captureException } from '@sentry/vue'
import delay from 'delay'
import { Effect, Schedule, pipe } from 'effect'
import type { IntegrationItem } from '~/stores/integration'

export function useLinkedInNotify({
  showNotify,
  linkedIn,
  updateIntegrations,
}: {
  showNotify: Ref<boolean>
  linkedIn: Ref<IntegrationItem | undefined>
  updateIntegrations: () => Promise<void>
}) {
  whenever(
    linkedIn,
    (linkedInData) => {
      const linkedInAlreadySetup = checkLinkedInSetup(linkedInData.data)
      if (linkedInData.activated_at && !linkedInAlreadySetup) {
        showNotify.value = true
      }
    },
    { immediate: true },
  )

  whenever(
    isLinkedInDisconnected,
    () => {
      showNotify.value = false
    },
    {
      immediate: true,
    },
  )

  function isLinkedInDisconnected() {
    if (!linkedIn.value) {
      return false
    }
    return !linkedIn.value.activated_at || !linkedIn.value.configuration
  }

  whenever(
    showNotify,
    async () => {
      try {
        await updateIntegrationsWithRetry()
      } catch (error) {
        captureException(error)
      }

      showNotify.value = false
    },
    {
      immediate: true,
    },
  )

  async function updateIntegrationsWithRetry(): Promise<boolean> {
    await delay(10_000)

    return pipe(
      Effect.promise(() => updateIntegrations()),
      Effect.filterOrFail(() => {
        const linkedInData = linkedIn.value ?? {
          data: null,
        }

        return checkLinkedInSetup(linkedInData.data)
      }),
      Effect.retry({
        times: 10,
        schedule: Schedule.spaced(1_000),
      }),
      Effect.as(true),
      Effect.runPromise,
    )
  }
}

function checkLinkedInSetup(json: string) {
  const linkedInData = destr<{ setup_organizations?: boolean }>(json)
  return Boolean(linkedInData.setup_organizations)
}
