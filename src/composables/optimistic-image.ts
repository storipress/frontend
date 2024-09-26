import type { MaybeRef } from '@vueuse/core'
import { computed, ref, unref } from 'vue'
import { isInvalidImage } from '~/utils/file'

interface UseOptimisticImageInput {
  url: MaybeRef<string | null | undefined>
  upload: (file: File) => Promise<void>
}

export function useOptimisticImage({ url, upload }: UseOptimisticImageInput) {
  const optimisticImage = ref<string>()
  const loading = ref(false)

  return {
    url: computed((): string | undefined => optimisticImage.value || unref(url) || undefined),
    loading,
    upload: async (file: File) => {
      if (await isInvalidImage(file)) return
      loading.value = true
      optimisticImage.value = URL.createObjectURL(file)
      await upload(file)
      if (optimisticImage.value) {
        URL.revokeObjectURL(optimisticImage.value)
        optimisticImage.value = undefined
      }
      loading.value = false
    },
  }
}
