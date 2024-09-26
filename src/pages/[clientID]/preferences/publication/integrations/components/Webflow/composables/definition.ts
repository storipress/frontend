import type { ToRefs } from 'vue'
import type { Promisable } from 'type-fest'
import type { Hookable } from 'hookable'
import type { Steps } from './useWebflowIntegration'
import type { WebflowCollectionType } from '~/graphql-operations'

export interface WebflowHooks {
  beforeAuth: (context: StepsContext, connectWebflow: () => void) => void | Promise<void>
  afterAuth: (context: StepsContext) => void | Promise<void>
  afterOnboarding: (context: StepsContext) => void | Promise<void>
}

export interface Context {
  currentStep: Steps
  visible: boolean
  currentCollectionType: WebflowCollectionType | undefined
  uncompletedCollectionType: WebflowCollectionType[] | undefined
  hasAuthorized: boolean
  hasCompletedOnboarding: boolean
  isAlreadyCompletedOnboarding: boolean
  manualMapping: boolean
  isLoading: boolean
  isReady: boolean
  loadingMessage: string
  initOnboarding: boolean
}

export interface StepsContext {
  webflow: ToRefs<Context>
  hooks: Hookable<WebflowHooks>
  open: () => void
  close: () => void
  back: () => void
  next: (handler: (ctx: ToRefs<Context>) => Promisable<void>) => Promise<void>
  loading: (time: number, message: string) => Promise<void>
  finishOnboarding: () => void
  initOnboarding: () => Promise<void>
}

export interface EnterCondition {
  type?: string[] | string
  nextStep?: Steps
  status: boolean
}

export type PropsType<T> = T extends { props: infer P } ? P : never

export type OnType<T> = T extends { on: infer O } ? O : never
