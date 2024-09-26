import type { MaybeRefOrGetter } from '@vueuse/core'
import { toRef } from '@vueuse/core'
import { useClamp } from '@vueuse/math'
import { noop } from 'lodash'

export interface ScrollableListInput<Item = unknown> {
  items: MaybeRefOrGetter<Item[]>
  itemRefs?: Ref<HTMLElement[]>
  onSubmit?: (item: Item) => void
}

export function useScrollableList<Item = unknown>({
  items: inputItems,
  itemRefs = ref([]),
  onSubmit = noop,
}: ScrollableListInput<Item>) {
  const items = toRef(inputItems)
  const selectedIndex = useClamp(ref(0), 0, () => items.value.length - 1)

  const selectedItem = computed(() => ({
    item: items.value[selectedIndex.value],
    index: selectedIndex.value,
    element: itemRefs.value[selectedIndex.value],
  }))

  function onKeyDown({ event }: { event: KeyboardEvent }) {
    // https://storipress-media.atlassian.net/jira/software/projects/SPMVP/boards/1?selectedIssue=SPMVP-4007
    // If doesn't have search results, do nothing
    // if (items.value.length === 0) return false

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (selectedIndex.value <= 0) selectedIndex.value = items.value.length - 1
      else selectedIndex.value = selectedIndex.value - 1
      return true
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (selectedIndex.value >= items.value.length - 1) selectedIndex.value = 0
      else selectedIndex.value = selectedIndex.value + 1
      return true
    }

    if (event.key === 'Enter') {
      onSubmit(selectedItem.value.item)
      return true
    }

    return false
  }

  return {
    itemRefs,
    selectedIndex,
    selectedItem,
    onKeyDown,
  }
}
