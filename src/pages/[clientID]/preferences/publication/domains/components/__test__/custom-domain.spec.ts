import { describe, expect, it } from 'vitest'
import { useThirdPartyCustomDomain } from '../custom-domain'
import { setupTestEnv } from '~/test-helpers'

setupTestEnv()

// * ref: we already test in src/composables/__tests__/site-url.spec.ts
describe('useThirdPartyCustomDomain', () => {
  it('should return connectedTarget', () => {
    const { connectedTarget } = useThirdPartyCustomDomain()

    expect(connectedTarget.value).toBe(null)
  })
})
