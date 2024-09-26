import { useRouteParams } from '@vueuse/router'
import { logicAnd } from '@vueuse/math'
import { Flags, useFeatureFlag } from '~/lib/feature-flag'

const newClientID = ref<string | null>(null)
const [isEnabled, setEnable] = useToggle(false)

export function useMigratorSplash() {
  const urlClientID = useRouteParams('clientID', null as null | string)
  const enabledScrapeMigrator = useFeatureFlag(Flags.ScrapeMigrator)

  return {
    isEnabled: logicAnd(enabledScrapeMigrator, isEnabled),
    clientID: computed(() => newClientID.value ?? urlClientID.value),
  }
}

export function useMigratorSplashControl() {
  return {
    setEnable: (input: string | null | boolean) => {
      if (input === null) {
        newClientID.value = null
        return
      }
      if (typeof input === 'string') {
        newClientID.value = input
        setEnable(Boolean(input))
        return
      }
      setEnable(input)
    },
  }
}
