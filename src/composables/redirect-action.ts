import type { MaybeRefOrGetter } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export interface UseConditionRedirectActionInput {
  shouldRedirect: MaybeRefOrGetter<boolean>
  target: MaybeRefOrGetter<RouteLocationRaw>
  enabled?: MaybeRefOrGetter<boolean>
  replace?: boolean
}

export function useConditionRedirectAction({
  shouldRedirect,
  target,
  enabled = true,
  replace,
}: UseConditionRedirectActionInput) {
  return useConditionAction({
    trigger: shouldRedirect,
    action: useRedirection({ target, replace }),
    enabled,
  })
}

export interface UseRedirectionInput {
  target: MaybeRefOrGetter<RouteLocationRaw>
  replace?: boolean
}

export function useRedirection({ target, replace }: UseRedirectionInput) {
  const router = useRouter()
  return () => {
    const route = toValue(target)
    if (replace) {
      return router.replace(route)
    } else {
      return router.push(route)
    }
  }
}

export interface UseConditionActionInput {
  trigger: MaybeRefOrGetter<boolean>
  action: () => void
  enabled?: MaybeRefOrGetter<boolean>
}

export function useConditionAction({ trigger, action, enabled = true }: UseConditionActionInput) {
  watch(
    [toRef(enabled), toRef(trigger)],
    ([enabled, trigger]) => {
      if (enabled && trigger) {
        action()
      }
    },
    { immediate: true, flush: 'sync' },
  )
}

export function useHomePage() {
  const route = useRoute()

  return () => {
    if (route.params.clientID) {
      return `/${route.params.clientID}/articles/desks/all`
    } else {
      return '/workspaces'
    }
  }
}
