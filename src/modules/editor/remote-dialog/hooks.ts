import { computed, watch } from 'vue'
import pDefer from 'p-defer'
import { remoteDialog } from './pinia'

import type { DialogInfo } from './types'

export function useRemoteDialog<T extends DialogInfo>(type: T['type']) {
  const store = remoteDialog()

  return {
    open(param: T['param']): Promise<T['returnValue']> {
      const deferred = pDefer<NonNullable<T['returnValue']>>()
      store.SET_DIALOG({ type, param, returnValue: null })
      const stopListen = watch(
        () => store.info?.returnValue as T['returnValue'] | null | undefined,
        (returnValue: T['returnValue'] | null | undefined) => {
          if (returnValue) {
            stopListen()
            deferred.resolve(returnValue!)
            store.SET_DIALOG(null)
          } else if (!store.info) {
            stopListen()
            deferred.resolve()
          }
        },
      )
      return deferred.promise
    },
  }
}

export function useRemoteDialogProvider<T extends DialogInfo>(type: T['type']) {
  const store = remoteDialog()

  return {
    param: computed((): T['param'] | null => {
      if (store.info?.type === type) {
        return store.info.param
      }
      return null
    }),
    reply(returnValue: T['returnValue']) {
      store.SET_RETURN(returnValue)
      // ref: https://github.com/tailwindlabs/headlessui/issues/1000
      // dialog close doesn't reset the overflow-hidden, so we need to do it manually
      setTimeout(() => {
        document.documentElement.setAttribute('style', '')
      }, 100)
    },
    close() {
      store.SET_DIALOG(null)
      setTimeout(() => {
        document.documentElement.setAttribute('style', '')
      }, 100)
    },
  }
}
