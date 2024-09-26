import { IntegrationsKey, integrationToTraceKey } from '../integration'

describe('integrationToTraceKey', () => {
  it('can convert to trace key', () => {
    expect(integrationToTraceKey(IntegrationsKey.HeaderFooterCode)).toBe('custom_code')
    expect(integrationToTraceKey(IntegrationsKey.Facebook)).toBe('facebook')
  })
})
