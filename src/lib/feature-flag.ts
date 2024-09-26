import type { Attributes, FeatureResult, JSONValue } from '@growthbook/growthbook'
import { GrowthBook } from '@growthbook/growthbook'
import type { DeepReadonly, Ref } from 'vue'
import { computed, readonly, ref, watch } from 'vue'
import * as Sentry from '@sentry/vue'
import type { MaybeRefOrGetter } from '@vueuse/core'
import { toRef, tryOnScopeDispose, useStorage } from '@vueuse/core'
import { noop } from 'lodash-es'
import { nanoid } from 'nanoid'
import { __IS_DEV__ } from './env'
import { wheneverOnce } from '~/composables/whenever-once'
import { env } from '~/env'

export interface AppFeatures {
  'trial-snackbar': boolean
  billing: boolean
  members: boolean
  'slack-integration': boolean
  'scheduler-navigation-switch': boolean
  'members-comment-count': boolean
  'editor-permission-check': boolean
  permission: boolean
  'trial-snackbar-hide-day': number
  'editor-focal-point-zoom': boolean
  'editor-focal-point': boolean
  'forbid-upload-animated-image': boolean
  'scrape-migrator': boolean
  'custom-site': boolean
  'shopify-integration': boolean
  'paid-custom-domain': boolean
  'public-api': boolean
  'zapier-integration': boolean
  'custom-canonical': boolean
  'zapier-zaps-list': Record<string, unknown>
  'webflow-integration': boolean
  'paid-ai': boolean
  'grammerly-integration': boolean
  'offline-editor': boolean
  'wordpress-integration': boolean
  'force-plus-plan': boolean
  'ai-linter': boolean
}

// Create a GrowthBook instance
const growthbook = new GrowthBook<AppFeatures>({
  qaMode: __IS_DEV__,
  enableDevMode: __IS_DEV__,
})

export const deviceId = useStorage('storipress-device-id', nanoid())

const featureUpdateSignal = ref(0)

export const featureLoaded = computed(() => featureUpdateSignal.value > 0)

const FEATURES_ENDPOINT = env.VITE_FEATURES_ENDPOINT

const DEFAULT_ATTRIBUTES: Attributes = {
  id: '',
  email: '',
  deviceId: deviceId.value,
  loggedIn: false,
  browser: navigator.userAgent,
  clientID: '',
  signedUpSource: '',
  role: 'contributor',
  plan: 'free',
  // make local same as dev for easier testing
  env: env.VITE_SENTRY_ENV === 'local' ? 'dev' : env.VITE_SENTRY_ENV,
  url: window.location.pathname,
}

export function useGrowthBookInit() {
  loadFeatures()

  growthbook.setAttributes(DEFAULT_ATTRIBUTES)

  growthbook.setRenderer(() => {
    featureUpdateSignal.value++
  })

  tryOnScopeDispose(() => {
    growthbook.setRenderer(noop)
  })
}

export function setAttributes(attributes: Readonly<Attributes>) {
  growthbook.setAttributes(attributes)
}

export function updateAttributes(partialAttributes: Readonly<Attributes>) {
  const attributes = {
    ...growthbook.getAttributes(),
    ...partialAttributes,
  }
  setAttributes(attributes)
}

function loadFeatures() {
  fetch(FEATURES_ENDPOINT)
    .then((res) => res.json())
    .then((json) => {
      growthbook.setFeatures(json.features)
    })
    .catch((error) => {
      Sentry.captureException(error)
    })
}

export function useGrowthBook() {
  return growthbook
}

// skipcq: JS-0323
export function useFeature<T extends JSONValue = any>(key: keyof AppFeatures): DeepReadonly<Ref<FeatureResult<T>>> {
  const feature = ref(growthbook.evalFeature(key))

  watch(featureUpdateSignal, () => {
    feature.value = growthbook.evalFeature(key)
  })

  return readonly(feature) as DeepReadonly<Ref<FeatureResult<T>>>
}

// skipcq: JS-0323
export function useFeatureValue<T extends JSONValue = any>(
  key: keyof AppFeatures,
  defaultValue?: T | null,
): Readonly<Ref<T>> {
  const feature = useFeature<T>(key)

  // @ts-expect-error type is too deep
  return computed(() => feature.value.value ?? defaultValue)
}

export function useFeatureFlag(key: keyof AppFeatures): Readonly<Ref<boolean>> {
  const feature = useFeature(key)

  return computed(() => feature.value.on)
}

export function useWhenFeatureEnabled(key: keyof AppFeatures, callback: () => void) {
  const feature = useFeatureFlag(key)

  wheneverOnce(
    feature,
    () => {
      callback()
    },
    { immediate: true },
  )
}

export function resolveFeatureFlag(
  maybeKeyOrFlag: MaybeRefOrGetter<boolean> | keyof AppFeatures,
): Readonly<Ref<boolean>> {
  if (typeof maybeKeyOrFlag === 'string') {
    return useFeatureFlag(maybeKeyOrFlag)
  }

  return toRef(maybeKeyOrFlag)
}

export function useFeatureFlagEvery(keys: (keyof AppFeatures)[]): Readonly<Ref<boolean>> {
  const flags = keys.map((key) => useFeatureFlag(key))

  return computed(() => flags.every((flag) => flag.value))
}

/**
 * NEVER USE THIS FUNCTION DIRECTLY
 * @deprecated don't use this in app code, use it in storybook or test, mark it as deprecated so you can see this warning
 */
export function enableFeatures(features: string[]) {
  growthbook.setFeatures(Object.fromEntries(features.map((key) => [key, { defaultValue: true }])))
}

export enum Flags {
  Billing = 'billing',
  EditorFocalPoint = 'editor-focal-point',
  EditorFocalPointZoom = 'editor-focal-point-zoom	',
  EditorPermissionCheck = 'editor-permission-check',
  ForbidUploadAnimatedImage = 'forbid-upload-animated-image',
  Members = 'members',
  MembersCommentCount = 'members-comment-count',
  Permission = 'permission',
  SchedulerNavigationSwitch = 'scheduler-navigation-switch',
  ScrapeMigrator = 'scrape-migrator',
  TrialSnackbar = 'trial-snackbar',
  TrialSnackbarHideDay = 'trial-snackbar-hide-day',
  CustomSite = 'custom-site',
  PaidCustomDomain = 'paid-custom-domain',
  OfflineEditor = 'offline-editor',

  ForcePlusPlan = 'force-plus-plan',

  // integrations
  SlackIntegration = 'slack-integration',
  ShopifyIntegration = 'shopify-integration',
  ZapierIntegration = 'zapier-integration',
  WebflowIntegration = 'webflow-integration',
  WordpressIntegration = 'wordpress-integration',
  PaidAi = 'paid-ai',
  AiLinter = 'ai-linter',
}
