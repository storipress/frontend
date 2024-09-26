import { debounce as createDebounce } from 'lodash-es'
import { useEditorStore } from '~/stores/editor'

export interface BatchOptions {
  debounce?: number
}

export function createBatch<T extends Record<string, unknown>>(
  executor: (data: T) => Promise<void>,
  { debounce = 50 }: BatchOptions = {},
) {
  const completed = ref(true)
  const online = useOnline()
  const editorStore = useEditorStore()
  let data = {} as T

  const debouncedExecutor = createDebounce(async () => {
    // To fix this bug https://storipress-media.atlassian.net/jira/software/projects/SPMVP/boards/1?selectedIssue=SPMVP-3329
    // This bug will send empty data to backend to cause error
    if (Object.keys(data).length === 0) {
      completed.value = true
      return
    }

    try {
      editorStore.SET_API_IS_RUNNING(true)
      await executor(data)
      editorStore.SET_API_IS_RUNNING(false)
      data = {} as T
      completed.value = true
    } catch {
      if (data.slug) {
        delete data.slug
      }
    }
  }, debounce)

  watch(online, (nowIsOnline, oldIsOnline) => {
    if (nowIsOnline && !oldIsOnline) {
      debouncedExecutor()
    }
  })

  return {
    batchUpdate: (partial: Partial<T>) => {
      Object.assign(data, partial)
      debouncedExecutor()
    },
    completed,
  }
}
