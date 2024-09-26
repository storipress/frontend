import type { WebflowOnboardingQuery } from '~/graphql-operations'

export function isWebflowOnboardCompleted(onboarding: WebflowOnboardingQuery) {
  const { webflowOnboarding } = onboarding
  const { site, mapping, collection } = webflowOnboarding
  return site && isCollectionSetupCompleted(collection) && isCollectionSetupCompleted(mapping)
}

interface CollectionSetup {
  blog: boolean
  author: boolean
  desk: boolean
  tag: boolean
}

function isCollectionSetupCompleted(mapping: CollectionSetup): boolean {
  return Object.values(mapping).every(Boolean)
}
