import { Editor } from '@tiptap/vue-3'
import { extensions } from './helper'

it('expect editor insertContentAt ok', async () => {
  const editor = new Editor({
    extensions,
    content: {
      type: 'doc',
    },
  })
  editor.commands.insertContentAt(0, '\n')
  editor.commands.insertContentAt(3, '123')
  expect(editor.getHTML()).toBe(`<p>
</p><p>123</p>`)
})
