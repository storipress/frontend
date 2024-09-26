import type { AnyExtension } from '@tiptap/vue-3'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { Document, Paragraph, Text } from '@storipress/tiptap-schema'
import { defineComponent, h } from 'vue'
import { createUnsplashClient } from './unsplash'
import { UnsplashPicker } from '~/components/Editor/unsplash-picker/index'

const baseExtensions = [Document, Paragraph, Text]

export function createStoryComponent(schema: AnyExtension) {
  return defineComponent({
    name: `${schema.name}View`,

    props: {
      attrs: {
        type: Object,
        default: () => ({}),
      },
    },

    setup(props) {
      const client = createUnsplashClient('')
      const editor = new Editor({
        extensions: [...baseExtensions, schema],
        content: {
          type: 'doc',
          content: [
            {
              type: schema.name,
              attrs: props.attrs,
            },
          ],
        },
      })

      return () => [h(UnsplashPicker, { client }), h(EditorContent, { editor })]
    },
  })
}
