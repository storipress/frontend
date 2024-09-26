import { expect, it } from 'vitest'
import { Editor } from '@tiptap/core'
import { Collaboration } from '@tiptap/extension-collaboration'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { schemaExtensions } from '@storipress/tiptap-schema'
import * as Yjs from 'yjs'

it('[SPMVP-2719] undo should work', () => {
  const document = new Yjs.Doc()
  const editor = new Editor({
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
        },
      ],
    },
    extensions: [Collaboration.configure({ document }), ...schemaExtensions],
  })
  const plugin = new Plugin({
    key: new PluginKey('test-plugin'),
  })
  /* Trigger the bug in y-prosemirror https://github.com/yjs/y-prosemirror/issues/114
   * If there has any plugin registered after the editor created, it will cause the bug.
   * To verify the bug, please upgrade yjs >= 3.15.32 & y-prosemirror >= 1.1.0
   */
  editor.registerPlugin(plugin)

  // simulate user input
  editor.commands.insertContent({
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: 'Hello',
      },
    ],
  })

  // now should be able to undo
  expect(editor.can().undo()).toBe(true)

  // teardown editor or it will crash after test finish
  editor.destroy()
})
