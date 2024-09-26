import type { Ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useMeMeta } from '~/composables'
import { useEditorStore } from '~/stores/editor'

export function useUnload(allSaved: Ref<boolean>, mutateAll: () => void) {
  const { userMeta, setUserMeta } = useMeMeta()
  const editorStore = useEditorStore()

  const event = () => {
    if (!editorStore.apiIsRunning) {
      mutateAll()
    }
    return allSaved.value ? null : 'alert'
  }

  window.onbeforeunload = event

  onBeforeRouteLeave(() => {
    setUserMeta({ enterTimes: (userMeta.value.enterTimes ?? 0) + 1 })
    if (!editorStore.apiIsRunning) {
      mutateAll()
    }
    if (!allSaved?.value) {
      const answer = window.confirm('Leave site? Changes you made may not be saved.')
      if (!answer) return false
    }
  })

  onBeforeUnmount(() => {
    // Refresh page will auto reset store status
    // We only need to manually reset store when we go to kanban page

    editorStore.RESET_STORE()
    window.onbeforeunload = null
  })
}
