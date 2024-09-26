import { captureException } from '@sentry/vue'
import type { MaybeRefOrGetter } from 'vue'
import { useNotification } from './notification'
import { ApplyDealFuelCodeDocument, ApplyViededingueCodeDocument } from '~/graphql-operations'

interface UseLicenseCodeReturn {
  update: (code: string) => Promise<boolean>
  updateWithErrorNotify: (code: string) => Promise<boolean>
}

export const VIEDEDINGUE = 'viededingue'
export const DEALFUEL = 'dealfuel'
export const LICENSE_BASE_SOURCE = new Set([VIEDEDINGUE, DEALFUEL])

export type LicenseSource = typeof VIEDEDINGUE | typeof DEALFUEL

export function useLicenseCode(source: MaybeRefOrGetter<string>): UseLicenseCodeReturn {
  const { mutate: applyViededingueCode } = useMutation(ApplyViededingueCodeDocument)
  const { mutate: applyDealFuelCode } = useMutation(ApplyDealFuelCodeDocument)

  const updateViededingueCode = async (code: string) => {
    const res = await applyViededingueCode({ input: { code } })
    return Boolean(res?.data?.applyViededingueCode)
  }

  const updateDealFuelCode = async (code: string) => {
    const res = await applyDealFuelCode({ input: { code } })
    return Boolean(res?.data?.applyDealFuelCode)
  }

  const updateFn = computed((): ((code: string) => Promise<boolean>) => {
    const sourceName = toValue(source)
    if (sourceName === VIEDEDINGUE) {
      return updateViededingueCode
    }

    if (sourceName === DEALFUEL) {
      return updateDealFuelCode
    }

    return () => Promise.resolve(false)
  })

  const update = async (code: string) => {
    return await updateFn.value(code)
  }
  const { create } = useNotification()

  const showNotify = () => {
    create({
      title: 'Invalid license code',
      type: 'warning',
      iconName: 'warning',
    })
  }

  return {
    update,
    updateWithErrorNotify: async (code: string): Promise<boolean> => {
      try {
        const res = await update(code)
        if (!res) {
          showNotify()
        }
        return res
      } catch (err) {
        captureException(err)
        showNotify()
        return false
      }
    },
  }
}
