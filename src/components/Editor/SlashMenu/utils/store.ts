import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GroupItem } from '~/components/Editor/SlashMenu/setting.ts'

export const useSlashMenuStore = defineStore('slashMenuStore', () => {
  const customBlocks: Ref<GroupItem> = ref({ title: '', blocks: [] })
  return {
    customBlocks,
    SET_CUSTOM_BLOCKS: (value: GroupItem) => {
      customBlocks.value = value
    },
  }
})
