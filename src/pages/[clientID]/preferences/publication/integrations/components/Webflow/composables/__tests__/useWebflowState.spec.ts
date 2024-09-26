import { beforeEach, expect, it } from 'vitest'
import { setActivePinia } from 'pinia'
import { useWebflowState } from '../useWebflowState'
import { setupApolloClient, setupTestPinia } from '~/test-helpers'

beforeEach(() => {
  setupApolloClient()
  setActivePinia(setupTestPinia())
})

it('should return the state', async () => {
  const state = useWebflowState()
  expect(state.loading.value).toBe(true)

  await until(state.loading).toBe(false)

  expect(state.loading.value).toBe(false)
  expect(state.webflowActivated.value).toBe(true)
  expect(state.activateWebflow).toBeInstanceOf(Function)
  expect(state.deactivateWebflow).toBeInstanceOf(Function)
})
