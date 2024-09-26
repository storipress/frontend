import { makeDestructurable } from '@vueuse/core'
import * as Sentry from '@sentry/vue'
import { GetMeMetaDocument, UpdateUserMetaDocument } from '~/graphql-operations'
import { useClientID } from '~/lib/client-id'
import type { ViewTypes } from '~/components/Scheduler/definitions'

export enum SurveyKey {
  Purpose = 'business_purpose',
  Describes = 'user_role',
  Frequency = 'publishing_frequency',
  Source = 'refer_source',
}

export enum SurveyTarget {
  NewAccount = 'new_account',
  NewPublication = 'new_publication',
  Invitees = 'invitees',
}

export enum UsedFeature {
  Scheduler = 'scheduler',
  FirstFeature = 'first_feature',
}

export const SurveyTargetRule = {
  [SurveyTarget.NewAccount]: 'all',
  [SurveyTarget.NewPublication]: [SurveyKey.Purpose, SurveyKey.Source],
  [SurveyTarget.Invitees]: [SurveyKey.Describes, SurveyKey.Frequency],
}

interface UserMeta {
  hasEnteredWorkspaces?: boolean
  enterTimes?: number
  survey?: Record<SurveyKey, string>
  usedFeatures?: UsedFeature[]
  lastSchedulerView?: ViewTypes
}

export function useMeMeta() {
  const { result, loading } = useQuery(GetMeMetaDocument)
  const { mutate } = useMutation(UpdateUserMetaDocument)

  const userMeta = computed(() => (result.value?.me.meta ? JSON.parse(result.value?.me.meta) : {}))

  const setUserMeta = async (meta: UserMeta) => {
    // confirm that the existing user meta has been loaded and merge it with the new data
    // if loading the existing data fails, catch to avoid overwriting the existing user meta
    try {
      await until(loading).not.toBeTruthy({ timeout: 5000, throwOnTimeout: true })

      const merge = { ...userMeta.value, ...meta }
      await mutate({ meta: JSON.stringify(merge) })
    } catch (e) {
      sendTrack('user_meta_merge_fails', {
        message: e,
        new_meta: meta,
      })

      Sentry.captureException(new Error('merge user meta fails'), (scope) => {
        scope.setContext('setUserMeta', { newMeta: meta })
        return scope
      })
    }
  }

  return { userMeta, setUserMeta, loading }
}

export function useMeTenantScopedMeta() {
  const { userMeta, setUserMeta, loading } = useMeMeta()
  const clientID = useClientID()

  if (!clientID) {
    throw new Error('clientID is not defined')
  }

  const scopedMeta = computed(() => userMeta.value[clientID] ?? {})

  const setScopedMeta = async (meta: Record<string, unknown>) => {
    const merge = { ...scopedMeta.value, ...meta }
    await setUserMeta({ [clientID]: merge })
  }

  return makeDestructurable(
    { scopedMeta, setScopedMeta, loading } as const,
    [scopedMeta, setScopedMeta, loading] as const,
  )
}

/**
 * get all used features
 *
 * @returns - a set of used features + helper function for set used feature
 */
export function useUsedFeatures() {
  const { userMeta, setUserMeta, loading } = useMeMeta()
  const usedFeatures = computed(() => {
    return new Set<UsedFeature>(userMeta.value.usedFeatures ?? [])
  })

  const setUsedFeature = (feature: UsedFeature) => {
    const set = new Set(usedFeatures.value)
    set.add(feature)
    setUserMeta({ usedFeatures: [...set] })
  }

  return makeDestructurable(
    { usedFeatures, setUsedFeature, loading } as const,
    [usedFeatures, setUsedFeature, loading] as const,
  )
}

/**
 * a helper to remember user used feature, useful for show indicator for feature usage.
 *
 * @example
 *
 * const [isUsed, setUsedFeature] = useUsedFeature(key)
 *
 * <button @click="setUsed">
 *   use this feature
 *   <span v-if="!isUsed" class="indicator" />
 * </button>
 *
 * @param key - the feature key
 * @param defaultValue - default value for feature state.
 * @returns - a tuple of the feature state and a function to set the state.
 * @see {@link useUsedFeatures}>
 */
export function useUsedFeature(key: UsedFeature, defaultValue = false) {
  const [usedFeatures, setUsedFeature, loading] = useUsedFeatures()

  const isUsed = computed(() => (loading.value ? defaultValue : usedFeatures.value.has(key)))
  const setUsed = () => setUsedFeature(key)

  return makeDestructurable({ isUsed, setUsed, usedFeatures } as const, [isUsed, setUsed, usedFeatures] as const)
}

export function useCheckSurveyCompletion() {
  const { userMeta } = useMeMeta()
  const userSurveyMeta = computed(() => {
    const meta = userMeta.value?.survey ? Object.keys(userMeta.value.survey) : []
    return new Set(meta)
  })

  return (target: SurveyTarget) => {
    const rules = SurveyTargetRule[target]

    let result
    if (rules === 'all') {
      result = Object.values(SurveyKey).map((meta) => userSurveyMeta.value.has(meta))
    } else {
      result = (rules as SurveyKey[]).map((rule) => userSurveyMeta.value.has(rule))
    }

    return !result.includes(false)
  }
}
