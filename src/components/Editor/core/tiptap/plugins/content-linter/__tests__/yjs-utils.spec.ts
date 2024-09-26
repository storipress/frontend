import { setTimeout } from 'node:timers/promises'
import { Editor } from '@tiptap/core'
import { richInputExtensions } from '@storipress/tiptap-schema'
import { Collaboration } from '@tiptap/extension-collaboration'
import { expect, it } from 'vitest'
import { Doc, RelativePosition } from 'yjs'
import { posToRelative, relativeToPos } from '../yjs-utils'

it('can convert between absolute <-> relative position', async () => {
  const document = new Doc()
  const editor = new Editor({
    element: undefined,
    extensions: [
      ...richInputExtensions,
      Collaboration.configure({
        document,
      }),
    ],
  })

  // y-prosemirror use `setTimeout(0)` to init binding
  // see: https://github.com/yjs/y-prosemirror/blob/master/src/plugins/sync-plugin.js#L180
  await setTimeout(0)

  editor.commands.setContent('<p>hello world</p>')

  const relativePosFrom = posToRelative(editor.state, 1)
  const relativePosTo = posToRelative(editor.state, 6)

  expect(relativePosFrom).toBeInstanceOf(RelativePosition)
  expect(relativePosTo).toBeInstanceOf(RelativePosition)

  const absolutePosFrom = relativeToPos(document, editor.state, relativePosFrom)
  const absolutePosTo = relativeToPos(document, editor.state, relativePosTo)

  expect(absolutePosFrom).toBe(1)
  expect(absolutePosTo).toBe(6)
})
