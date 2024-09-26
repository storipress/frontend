import type { Integrations as IntegrationsKey } from '~/composables'
import { useIntegrationUtils } from '~/composables'

interface UseExclusiveIntegrationInput {
  integrationName: string
  conflictKey: IntegrationsKey.Webflow | IntegrationsKey.Shopify
  conflictName: string
  conflictMessage?: string
}

export function useExclusiveIntegration({
  integrationName,
  conflictKey,
  conflictName,
  conflictMessage = `You cannot use the ${integrationName} integration with ${conflictName}`,
}: UseExclusiveIntegrationInput): Ref<{ disabled: boolean; reason: string } | boolean> {
  const { isThirdPartyEnabled } = useIntegrationUtils()
  const isEnabled = isThirdPartyEnabled(conflictKey)

  return computed(() => {
    return isEnabled.value
      ? {
          disabled: true,
          reason: conflictMessage,
        }
      : false
  })
}
