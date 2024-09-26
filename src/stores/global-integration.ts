import type { NestedHooks } from 'hookable'
import { defineStore } from 'pinia'
import type { WebflowHooks } from '~/pages/[clientID]/preferences/publication/integrations/components/Webflow'

// use any here to match hookable define
// skipcq: JS-0323
interface IntegrationState<Hooks extends Record<string, any>> {
  visible: boolean
  hooks?: NestedHooks<Hooks>
}

export const useGlobalIntegration = defineStore('globalIntegration', () => {
  const webflowIntegration = shallowRef<IntegrationState<WebflowHooks>>({
    visible: false,
    hooks: undefined,
  })

  const showGlobalIntegration = ref(false)
  const linkedInNotify = ref(false)

  return {
    showGlobalIntegration,
    webflow: readonly(webflowIntegration),
    showWebflow(hooks?: NestedHooks<WebflowHooks>) {
      showGlobalIntegration.value = true
      // to prevent clear previous hooks
      if (webflowIntegration.value.visible) {
        return
      }

      webflowIntegration.value = {
        visible: true,
        hooks,
      }
    },
    hideWebflow() {
      webflowIntegration.value = {
        visible: false,
        hooks: undefined,
      }
    },
    linkedInNotify,
  }
})
