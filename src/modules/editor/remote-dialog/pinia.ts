import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { DialogInfo } from './types'

export const remoteDialog = defineStore(
  'remoteDialog',
  () => {
    const info = ref<DialogInfo<string> | null>(null)

    return {
      info,
      SET_DIALOG(newInfo: DialogInfo | null) {
        info.value = newInfo
      },

      SET_RETURN(newReturnValue: unknown) {
        if (!info.value) return
        info.value.returnValue = newReturnValue
      },
    }
  },
  { sync: { enabled: true } },
)
