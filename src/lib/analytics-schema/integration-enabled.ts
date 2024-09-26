import { defineTrackEvent } from './_define'
import { IntegrationSourceSchema, IntegrationTraceKeySchema } from '~/schema/integration'

export const integrationEnabled = defineTrackEvent({
  event: 'integration_enabled',
  properties: {
    integration: IntegrationTraceKeySchema,
    source: IntegrationSourceSchema,
  },
})
