import { syncRef } from '@vueuse/core'
import { useProviderStore } from '~/stores/preview-provider'
import { useQuery } from '~/lib/apollo'
import { GetDesignDocument } from '~/graphql-operations'

interface DesignData {
  blocks: string[]
  images: Record<string, Record<string, string>>
}

export function useLogo() {
  const previewStore = useProviderStore()
  const { result } = useQuery(GetDesignDocument, { key: 'home' })
  const logo = computed(() => {
    const draft = result.value?.design?.draft
    if (!draft) {
      return ''
    }
    try {
      const { blocks, images } = JSON.parse(draft) as DesignData
      const [hero] = blocks
      return images[`b-${hero}`]?.logo || ''
    } catch {
      return ''
    }
  })

  syncRef(logo, toRef(previewStore, 'logo'), { immediate: true, direction: 'ltr', flush: 'sync' })
}
