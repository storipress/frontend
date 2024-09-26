import { describe, expect, it, vi } from 'vitest'
import { setActivePinia } from 'pinia'
import {
  Steps,
  defineStep,
  normalizedEnter,
  useConnectWebflow,
  useStepContext,
  useStepManager,
} from '../useWebflowIntegration'
import { InfoDialog } from '~/components/Integrations'
import { setupApolloClient, setupTestPinia } from '~/test-helpers'

beforeEach(() => {
  setActivePinia(setupTestPinia())
  setupApolloClient()
})

describe('useWebflowIntegration', () => {
  it('setCurrentStep', async () => {
    const { currentStep, setCurrentStep, useInitCurrentStep } = useStepManager()
    const context = useStepContext({ setCurrentStep, useInitCurrentStep })
    const composable = useConnectWebflow(context)

    await setCurrentStep(Steps.Connect)
    expect(currentStep.value).toEqual({
      component: InfoDialog,
      props: composable.props,
      events: { clickButton: expect.any(Function) },
    })
  })

  it('defineStep', () => {
    const step = {
      step1: defineStep<ReturnType<typeof useConnectWebflow>>({
        shouldEnter: () => Promise.resolve({ type: undefined, status: true }),
        component: InfoDialog,
        composable: useConnectWebflow,
      }),
    }

    expect(step.step1).toEqual(expect.any(Function))
  })

  it('should enter is true', async () => {
    const { setCurrentStep, useInitCurrentStep } = useStepManager()
    const context = useStepContext({ setCurrentStep, useInitCurrentStep })
    const composable = useConnectWebflow(context)
    context.next = vi.fn()

    const step = {
      step1: defineStep<ReturnType<typeof useConnectWebflow>>({
        shouldEnter: () => Promise.resolve({ type: undefined, status: true }),
        component: InfoDialog,
        composable: useConnectWebflow,
      }),
    }

    const stepResult = await step.step1(context)
    expect(stepResult).toEqual({
      component: InfoDialog,
      props: composable.props,
      events: { clickButton: expect.any(Function) },
    })
    expect(context.next).not.toHaveBeenCalled()
  })

  it('should enter is false', async () => {
    const { setCurrentStep, useInitCurrentStep } = useStepManager()
    const context = useStepContext({ setCurrentStep, useInitCurrentStep })
    context.next = vi.fn()

    const step = {
      step1: defineStep<ReturnType<typeof useConnectWebflow>>({
        shouldEnter: () => Promise.resolve({ type: undefined, status: false }),
        component: InfoDialog,
        composable: useConnectWebflow,
      }),
      step2: defineStep<ReturnType<typeof useConnectWebflow>>({
        component: InfoDialog,
        composable: useConnectWebflow,
      }),
    }

    await step.step1(context)
    expect(context.next).toBeCalledTimes(1)
  })

  it('normalizedEnter', () => {
    const notPassedType = normalizedEnter(true)
    const passedType = normalizedEnter(['blog', true])

    expect(notPassedType).toStrictEqual({ type: undefined, status: true })
    expect(passedType).toStrictEqual({ type: 'blog', status: true })
  })
})

describe('useStepContext', () => {
  it('call initOnboarding should call the onboarding function', () => {
    const setCurrentStep = vi.fn()
    const initOnboarding = vi.fn()
    const context = useStepContext({ setCurrentStep, useInitCurrentStep: initOnboarding })

    context.initOnboarding()

    expect(initOnboarding).toBeCalled()
    expect(setCurrentStep).not.toBeCalled()
  })

  it('loading should set loading state', async () => {
    vi.useFakeTimers()
    const setCurrentStep = vi.fn()
    const initOnboarding = vi.fn()
    const context = useStepContext({ setCurrentStep, useInitCurrentStep: initOnboarding })

    expect(context.webflow.isLoading.value).toBe(false)
    expect(context.webflow.loadingMessage.value).toBe('')

    context.loading(1000, 'Loading')
    expect(context.webflow.isLoading.value).toBe(true)
    expect(context.webflow.loadingMessage.value).toBe('Loading')

    await vi.runOnlyPendingTimersAsync()
    expect(context.webflow.isLoading.value).toBe(false)
    expect(context.webflow.loadingMessage.value).toBe('')
  })

  it('back should go back to previous step', () => {
    const setCurrentStep = vi.fn()
    const initOnboarding = vi.fn()
    const context = useStepContext({ setCurrentStep, useInitCurrentStep: initOnboarding })
    context.webflow.currentStep.value = Steps.Connect

    context.back()

    expect(setCurrentStep).toBeCalledWith(Steps.Panel)
  })

  it('next should go to specific step', async () => {
    const setCurrentStep = vi.fn()
    const initOnboarding = vi.fn()
    const context = useStepContext({ setCurrentStep, useInitCurrentStep: initOnboarding })
    context.webflow.currentStep.value = Steps.Connect

    await context.next(({ currentStep }) => {
      expect(currentStep.value).toBe(Steps.Connect)
      currentStep.value = Steps.SiteSetup
    })

    expect(setCurrentStep).toBeCalledWith(Steps.SiteSetup)
  })
})
