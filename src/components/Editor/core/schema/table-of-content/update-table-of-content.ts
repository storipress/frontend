import type { TableOfContentDataItem } from '@tiptap-pro/extension-table-of-content'
import type { Ref } from 'vue'
import { tryOnMounted } from '@vueuse/core'

interface TableOfContentItem {
  id: string
  textContent: string
  level: number
}

export type InputItems = Pick<TableOfContentDataItem, 'id' | 'textContent' | 'level'>[]

interface UseUpdateTableOfContentInput {
  items: Ref<InputItems>
  updateItems: (items: TableOfContentItem[]) => void
}

export function useUpdateTableOfContent({ items, updateItems }: UseUpdateTableOfContentInput) {
  const prevToc: Record<string, TableOfContentItem> = {}

  tryOnMounted(() => {
    for (const item of items.value) {
      prevToc[item.id] = item
    }
  })

  watch(items, (changedItems) => {
    let changed = false
    for (const item of changedItems) {
      if (
        !prevToc[item.id] ||
        prevToc[item.id].textContent !== item.textContent ||
        prevToc[item.id].level !== item.level
      ) {
        prevToc[item.id] = item
        changed = true
      }
    }

    if (changed) {
      updateItems(
        changedItems
          .filter((item) => item.textContent)
          .map((item): TableOfContentItem => ({ id: item.id, textContent: item.textContent, level: item.level })),
      )
    }
  })
}
