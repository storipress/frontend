import { expect, it } from 'vitest'
import { isWebflowOnboardCompleted } from '../utils'

it('can check onboarding completed', () => {
  expect(
    isWebflowOnboardCompleted({
      webflowOnboarding: {
        site: false,
        mapping: {
          author: false,
          blog: false,
          desk: false,
          tag: false,
        },
        collection: {
          author: false,
          blog: false,
          desk: false,
          tag: false,
        },
      },
    }),
  ).toBe(false)

  expect(
    isWebflowOnboardCompleted({
      webflowOnboarding: {
        site: true,
        mapping: {
          author: true,
          blog: true,
          desk: true,
          tag: false,
        },
        collection: {
          author: true,
          blog: true,
          desk: true,
          tag: true,
        },
      },
    }),
  ).toBe(false)

  expect(
    isWebflowOnboardCompleted({
      webflowOnboarding: {
        site: true,
        mapping: {
          author: true,
          blog: true,
          desk: true,
          tag: true,
        },
        collection: {
          author: false,
          blog: true,
          desk: true,
          tag: true,
        },
      },
    }),
  ).toBe(false)

  expect(
    isWebflowOnboardCompleted({
      webflowOnboarding: {
        site: true,
        mapping: {
          author: true,
          blog: true,
          desk: true,
          tag: true,
        },
        collection: {
          author: true,
          blog: true,
          desk: true,
          tag: true,
        },
      },
    }),
  ).toBe(true)
})
