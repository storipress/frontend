import type { VueRenderer } from '@tiptap/vue-3'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { mountCheckButton } from '../markdown'
import { render } from '~/test-helpers'

export const extensions = [Document, Paragraph, Text]

it('check component element having value after button mounted', async () => {
  const component: Ref<VueRenderer | null> = ref(null)
  const buttonMounted = ref(false)
  const editor = new Editor({
    extensions,
    content: {
      type: 'doc',
    },
  })
  render(EditorContent, { props: { editor } })
  mountCheckButton(
    component,
    () => {},
    (mounted: boolean) => {
      buttonMounted.value = mounted
    },
    editor,
  )

  await nextTick()
  expect(buttonMounted.value).toBe(true)
  expect(component.value?.element).toBeTruthy()
})
