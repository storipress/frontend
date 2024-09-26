import { CUSTOM_FIELD_STORAGE_KEY } from '@storipress/custom-field/model/ctx'
import type { Ref } from 'vue'
import { createSSRApp } from 'vue'
import { wrapFieldAsStorage } from '@storipress/custom-field'
import { renderToString } from 'vue/server-renderer'
import type { CustomModule } from './load-module'
import { EditorBlockRoot } from './editor-block-root'

export function useRender(mod: Ref<CustomModule | null>) {
  return {
    async render(fields: Record<string, unknown[]>): Promise<string> {
      if (!mod.value?.exports) {
        return ''
      }

      const app = createSSRApp(
        defineComponent(() => {
          return () => {
            const child = mod.value?.exports ? h(mod.value.exports) : null
            return h(EditorBlockRoot, {}, [child])
          }
        }),
      )
      app.provide(CUSTOM_FIELD_STORAGE_KEY, wrapFieldAsStorage(fields))
      return renderToString(app)
    },
  }
}
