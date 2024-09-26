import type { AnyExtension } from '@tiptap/core'
import { Editor } from '@tiptap/vue-3'
import { markRaw } from 'vue'
import { CustomShortcuts } from './custom-shortcuts'

import type { FullPresetInput } from './presets'
import { base, createFull } from './presets'

export function configureEditor(extensions: AnyExtension[]): Editor {
  return markRaw(
    new Editor({
      extensions: [...extensions, CustomShortcuts],
    }),
  )
}

export function configureBasicEditor() {
  return configureEditor(base)
}

export function configureFullEditor(input: FullPresetInput) {
  const { extensions, destroy } = createFull(input)
  return { editor: configureEditor(extensions), destroy }
}
