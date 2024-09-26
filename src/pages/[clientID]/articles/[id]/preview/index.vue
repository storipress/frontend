<script lang="ts" setup>
import * as Y from 'yjs'
import { syncRef, useElementSize } from '@vueuse/core'
import { truncate } from 'lodash-es'
import { useProvideFieldStorage, wrapFieldAsStorage } from '@storipress/custom-field'
import { useLogo } from './use-logo'
import { useRemoteDialog } from '~/modules/editor/pinia'
import { Preview, usePreview } from '~/components/Preview'
import { useProviderStore } from '~/stores/preview-provider'
import { useWorkspaceStore } from '~/stores/workspace'
import { useProvideYDoc } from '~/composables/context'
import type { TCustomModule } from '~/utils/customLayout/types'
import { injectRequire } from '~/utils/editor/inject-require'

// ensure store initialized
useRemoteDialog()

const workspaceStore = useWorkspaceStore()
const root = ref()
const providerStore = useProviderStore()
const { y, isScrolling } = useScroll(window)
const customLayoutPreview = ref({ __name: '', setup: () => {} })
const prevYPos = ref(0)
const ydoc = new Y.Doc()
const bias = 660 // preview full height is not same as view height, need to decrease this value

useProvideYDoc(ydoc)
useLogo()
useHead({
  title: computed(
    () =>
      `${truncate(providerStore.title, { length: 20 })} - ${workspaceStore.currentWorkspace?.name ?? ''} - Storipress`,
  ),
})

const { height } = useElementSize(root, { width: 1070, height: 800 })
syncRef(height, toRef(providerStore, 'height'), { immediate: true, direction: 'ltr' })

usePreview(providerStore)
watch(
  providerStore,
  () => {
    if (providerStore.$syncInfo.ready) {
      // only in iframe need to record position
      if (window.top !== window) {
        window.scrollTo({ top: prevYPos.value * (height.value - bias) })
      }
      providerStore.$sync()
    }
  },
  { flush: 'sync' },
)

watch(isScrolling, () => {
  if (isScrolling.value === false) {
    prevYPos.value = y.value / (height.value - bias)
  }
})

declare global {
  interface Window {
    tailwind: {
      config: unknown
    }
  }
}

watch(
  () => providerStore.customLayoutUrl,
  async (newCustomLayoutUrl) => {
    if (newCustomLayoutUrl) {
      const module = { exports: {} as TCustomModule }
      if (newCustomLayoutUrl) {
        const jsFile = await import(newCustomLayoutUrl)
        jsFile.default.factory(module, injectRequire(false))
        customLayoutPreview.value = module.exports

        await loadScript('https://cdn.tailwindcss.com', { async: true })
        window.tailwind.config = { darkMode: ['class', '.force-use-dark-mode'] }
      }
    }
  },
)

function loadScript(src: string, option: { async?: boolean } = {}) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = Boolean(option.async)

    script.onload = resolve
    script.onerror = reject

    document.body.appendChild(script)
  })
}

useProvideFieldStorage(wrapFieldAsStorage(reactiveComputed(() => providerStore.customFields)))
</script>

<template>
  <article
    v-if="customLayoutPreview && providerStore.isCustomLayout && providerStore.$syncing"
    class="flex min-h-full bg-white"
  >
    <component :is="customLayoutPreview" />
  </article>
  <Preview
    v-else-if="providerStore.$syncing"
    ref="root"
    class="flex"
    :template-name="providerStore.templateName"
    :style-tree="providerStore.tree"
  />
</template>
