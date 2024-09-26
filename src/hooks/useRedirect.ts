import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const LOGIN_PATH = '/auth/login'

export function useRedirect(path = LOGIN_PATH) {
  const router = useRouter()
  router.push(path)
}

export function useConditionRedirect(condition: () => boolean, truePath: string, falsePath: string) {
  const router = useRouter()
  if (condition()) {
    router.push(truePath)
  } else {
    router.push(falsePath)
  }
}

export function useRedirectDependOnAuth(hasAuthPath: string, defaultPath = LOGIN_PATH) {
  const store = useAuthStore()
  useConditionRedirect(() => store.isAuth, hasAuthPath, defaultPath)
}

export function useCheckIfNoAuthRedirect(callback: () => void, redirectPath = LOGIN_PATH) {
  const store = useAuthStore()
  const router = useRouter()
  if (!store.isAuth) {
    router.push(redirectPath)
  } else if (callback) {
    callback()
  }
}

export function useRolePermissions(permission: Ref<boolean>, redirectTo = '/', ready = ref(true)) {
  const router = useRouter()
  watchEffect(() => {
    if (!ready.value) return
    if (permission.value) return
    router.replace(redirectTo)
  })
}

export function useCheckFeature(enableFeature: Ref<boolean>, redirectTo = '/', ready = ref(true)) {
  const router = useRouter()

  const unwatch = watchEffect(async () => {
    if (!ready.value) return
    await nextTick()
    if (enableFeature.value) return
    unwatch()
    router.replace(redirectTo)
  })
}
