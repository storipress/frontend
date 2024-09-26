import { expect, it } from 'vitest'
import { webflowOnboardingStepCompleted } from '../webflow-onboarding-step-completed'

it.each([
  [
    {
      event: 'webflow_onboarding_step_completed',
      properties: {
        step_name: 'connect',
      },
    },
    {
      event: 'webflow_onboarding_step_completed',
      properties: {
        step_name: 'collection_mapping',
        is_skipped: false,
        mapping_collections: ['blog', 'author'],
        mapping_count: 2,
      },
    },
  ],
])('can verify correct events', (event) => {
  expect(() => {
    webflowOnboardingStepCompleted.parse(event)
  }).not.toThrow()
})
