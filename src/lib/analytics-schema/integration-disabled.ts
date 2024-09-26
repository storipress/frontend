import { defineTrackEvent } from './_define'
import { IntegrationSourceSchema, IntegrationTraceKeySchema } from '~/schema/integration'

export const integrationDisabled = defineTrackEvent({
  event: 'integration_disabled',
  properties: {
    integration: IntegrationTraceKeySchema,
    source: IntegrationSourceSchema,
  },
})
