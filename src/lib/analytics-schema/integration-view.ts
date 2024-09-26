import { defineTrackEvent } from './_define'
import { IntegrationSourceSchema, IntegrationTraceKeySchema } from '~/schema/integration'

export const integrationView = defineTrackEvent({
  event: 'integration_view',
  properties: {
    integration: IntegrationTraceKeySchema,
    source: IntegrationSourceSchema,
  },
})
