import { useLinkedInNotify } from '../linkedin-notify'
import type { IntegrationItem } from '~/stores/integration'
import { useFakeTimer } from '~/test-helpers'

useFakeTimer()

const mockLinkedInData: IntegrationItem = {
  key: 'linkedin',
  configuration: {},
  activated_at: new Date(),
  data: JSON.stringify({ setup_organizations: false }),
}

describe('useLinkedInNotify', () => {
  it('should set showNotify to true when linkedIn is activated but not setup', async () => {
    const showNotify = ref(false)
    const linkedIn = ref<IntegrationItem | undefined>(mockLinkedInData)
    const updateIntegrations = vi.fn().mockResolvedValue(undefined)

    useLinkedInNotify({ showNotify, linkedIn, updateIntegrations })

    // Wait for promises to resolve
    await nextTick()

    expect(showNotify.value).toBe(true)
  })

  it('should set showNotify to false when linkedIn is disconnected', async () => {
    const showNotify = ref(true)
    const linkedIn = ref<IntegrationItem | undefined>(mockLinkedInData)
    const updateIntegrations = vi.fn().mockResolvedValue(undefined)

    useLinkedInNotify({ showNotify, linkedIn, updateIntegrations })

    // simulate disconnected
    linkedIn.value = {
      ...mockLinkedInData,
      activated_at: undefined,
      configuration: null,
    }

    await nextTick()

    expect(showNotify.value).toBe(false)
  })

  it('should retry updating integrations until LinkedIn is setup', async () => {
    const showNotify = ref(false)
    const linkedIn = ref<IntegrationItem | undefined>(mockLinkedInData)
    const updateIntegrations = vi.fn().mockImplementation(() => {
      linkedIn.value = {
        key: 'linkedin',
        configuration: {},
        activated_at: new Date(),
        data: JSON.stringify({ setup_organizations: true }),
      }
      return Promise.resolve(undefined)
    })

    useLinkedInNotify({ showNotify, linkedIn, updateIntegrations })

    expect(showNotify.value).toBe(true)

    await vi.advanceTimersByTimeAsync(10_000)

    expect(updateIntegrations).toHaveBeenCalled()
    expect(showNotify.value).toBe(false)
  })

  it('should retry updating integrations multiple until LinkedIn is setup', async () => {
    const showNotify = ref(false)
    const linkedIn = ref<IntegrationItem | undefined>(mockLinkedInData)
    let count = 0
    const updateIntegrations = vi.fn().mockImplementation(() => {
      count += 1
      if (count < 2) {
        return Promise.resolve(undefined)
      }

      linkedIn.value = {
        key: 'linkedin',
        configuration: {},
        activated_at: new Date(),
        data: JSON.stringify({ setup_organizations: true }),
      }
      return Promise.resolve(undefined)
    })

    useLinkedInNotify({ showNotify, linkedIn, updateIntegrations })

    expect(showNotify.value).toBe(true)

    await vi.advanceTimersByTimeAsync(10_000)

    expect(updateIntegrations).toHaveBeenCalledTimes(1)
    expect(showNotify.value).toBe(true)

    await vi.advanceTimersByTimeAsync(1_000)

    expect(updateIntegrations).toHaveBeenCalledTimes(2)
    expect(showNotify.value).toBe(false)
  })
})
