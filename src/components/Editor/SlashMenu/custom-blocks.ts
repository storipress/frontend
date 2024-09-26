import type { Editor, Range } from '@tiptap/vue-3'
import { BlockType } from '../core/utils'
import type { BlockItem } from './setting'
import { Flags } from '~/lib/feature-flag'
import { CustomFieldGroupType, CustomFieldGroupsDocument, TemplateType } from '~/graphql-operations'
import { useLayouts } from '~/pages/[clientID]/articles/[id]/edit/utils'
import type { SiteTemplate } from '~/graphql-operations'

type CustomBlock = SiteTemplate & { id?: string }
export function useListCustomBlocks() {
  const { result: fieldsResult } = useFeatureFlaggedQuery(Flags.CustomSite, CustomFieldGroupsDocument)
  return computed(() => {
    return (
      fieldsResult.value?.customFieldGroups?.data.filter(
        (group) => group.type === CustomFieldGroupType.ArticleContentBlock,
      ) ?? []
    )
  })
}

export function customBlockItems() {
  const { customBlocks: availableCustomBlocks } = useLayouts()
  const customFieldGroups = useListCustomBlocks()

  const customBlocks = computed(() => {
    const ids = new Set(availableCustomBlocks.value.map(({ name }) => name))
    return [
      ...availableCustomBlocks.value,
      ...customFieldGroups.value
        .filter(({ key }) => !ids.has(key))
        .map(({ id, key, description }) => ({ id, name: key, description, type: TemplateType.EditorBlock })),
    ] as CustomBlock[]
  })

  function customBlockItem(block: CustomBlock): BlockItem {
    const uuid = crypto.randomUUID()
    const embedSchema = { name: 'html', blockName: block.name, uuid, ...(block?.id && { id: block.id }) }
    return {
      action: 'setEmbed',
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().deleteRange(range).setEmbed(embedSchema).setTextSelection(range.from).focus().run()
      },
      description: 'Embed a custom block',
      iconName: 'lego',
      key: BlockType.custom,
      options: embedSchema,
      title: block.name as string,
    }
  }

  return computed(() => ({
    title: 'Custom Article Blocks',
    blocks: customBlocks.value?.map((item) => customBlockItem(item)) ?? [],
  }))
}
