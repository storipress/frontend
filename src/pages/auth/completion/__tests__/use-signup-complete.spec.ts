import { beforeEach, expect, it, vi } from 'vitest'
import { useSignupCompletion } from '../use-signup-complete'
import { runComposable } from '~/test-helpers'
import { useLoading } from '~/composables/loading'

const survey = ref(false)

vi.mock('~/composables/meMeta', () => ({
  useMeMeta: () => ({
    userMeta: {
      value: {
        survey: survey.value,
      },
    },
  }),
}))

vi.mock('~/composables/loading', () => {
  const loading = vi.fn()
  return {
    useLoading: () => ({ loading }),
  }
})

beforeEach(() => {
  survey.value = false
})

it('getIncompleteStep should respect redirect', async () => {
  const { loading } = useLoading()
  survey.value = true

  const {
    result: { getIncompleteStep },
    router,
  } = runComposable(useSignupCompletion)

  await router.replace('/?redirect=/foo')

  vi.spyOn(router, 'replace')

  await expect(getIncompleteStep()).resolves.toBe(null)
  expect(router.replace).toHaveBeenCalledWith('/foo?redirect=%2Ffoo')
  expect(loading).not.toBeCalled()
})
