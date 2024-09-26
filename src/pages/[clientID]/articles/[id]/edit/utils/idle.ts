import type { Ref } from 'vue'
import { idleTime } from '../setting'

export function useIdleClearEditing(editingColumn: Ref<string>) {
  const refresh = useDebounceFn(() => {
    editingColumn.value = ''
  }, idleTime)

  refresh()
  useEventListener(document, 'input', refresh)
}
