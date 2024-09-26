import type { MaybeRefOrGetter } from '@vueuse/core'
import { toValue } from '@vueuse/core'
import { onBeforeRouteLeave } from 'vue-router'

export function useGoBackOrPath(path: MaybeRefOrGetter<string>): () => void {
  const router = useRouter()

  onBeforeRouteLeave((to, _from, next) => {
    const { sp_from } = to.query
    if (sp_from === 'redirect') {
      return router.push(toValue(path))
    }
    next()
  })

  return () => {
    // HACK: it is hack method, ref:https://stackoverflow.com/a/70965943
    const lastPath = router?.options?.history?.state?.back
    // ignore the `/redirect`
    if (lastPath && !(lastPath as string).startsWith('/redirect')) {
      return router.back()
    }
    return router.push(toValue(path))
  }
}
