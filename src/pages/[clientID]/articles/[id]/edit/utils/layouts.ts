import type { MaybeRefOrGetter } from '@vueuse/core'
import { toValue } from '@vueuse/core'
import { computed, warn } from 'vue'
import { logicOr } from '@vueuse/math'
import type { LayoutData } from '~/components/Manager/StylePicker'
import { GetLayoutDocument, GetSiteTemplatesDocument } from '~/graphql-operations'
import { Flags } from '~/lib/feature-flag'

export function useLayouts() {
  const { result: layoutsResult, loading: layoutLoading } = useQuery(
    GetLayoutDocument,
    {},
    { fetchPolicy: 'cache-first' },
  )
  const { result: siteTemplatesResult, loading: siteTemplatesLoading } = useFeatureFlaggedQuery(
    Flags.CustomSite,
    GetSiteTemplatesDocument,
  )
  const layouts = computed(() => {
    return layoutsResult.value?.layouts?.map((layout) => {
      return {
        id: layout.id,
        name: layout.name,
        template: layout.template,
        data: JSON.parse(layout.data) as LayoutData,
      }
    })
  })

  const customLayouts = computed(() => {
    return siteTemplatesResult.value?.siteTemplates?.filter((item) => item.type === 'articleLayout') ?? []
  })

  const customBlocks = computed(() => {
    return siteTemplatesResult.value?.siteTemplates?.filter((item) => item.type === 'editorBlock') ?? []
  })

  const customSSRBlocks = computed(() => {
    return siteTemplatesResult.value?.siteTemplates?.filter((item) => item.type === 'editorBlockSsr') ?? []
  })

  return {
    isLoading: logicOr(layoutLoading, siteTemplatesLoading),
    layoutsResult,
    layouts,
    customLayouts,
    customBlocks,
    customSSRBlocks,
    layoutMap: computed(() => {
      return new Map(layouts.value?.map((layout) => [layout.id, layout]) ?? [])
    }),
    getCustomBlock(name: MaybeRefOrGetter<string>) {
      return computed(() => {
        const blockName = toValue(name)
        if (!blockName) {
          return null
        }

        const targetBlock = customBlocks.value.find((block) => block.name === blockName)
        const targetSSRBlock = customSSRBlocks.value.find((block) => block.name === blockName)
        if (!targetBlock && !targetSSRBlock) {
          return null
        }

        if (targetBlock && targetSSRBlock) {
          return {
            clientBlock: targetBlock,
            serverBlock: targetSSRBlock,
          }
        }
        warn(`Missing ${targetBlock ? 'server' : 'client'} block for ${name}`)
        return null
      })
    },
  }
}
