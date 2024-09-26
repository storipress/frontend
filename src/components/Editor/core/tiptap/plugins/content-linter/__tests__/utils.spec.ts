import { setTimeout } from 'node:timers/promises'
import { Editor } from '@tiptap/core'
import { richInputExtensions } from '@storipress/tiptap-schema'
import { Collaboration } from '@tiptap/extension-collaboration'
import { expect, it } from 'vitest'
import { Doc } from 'yjs'
import invariant from 'tiny-invariant'
import { deserializeLinterPos, serializeLinterPos } from '../utils'
import { DecorationEnum } from '../types'

it('can serialize and deserialize dismiss data', async () => {
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
  await setTimeout(0)

  editor.commands.setContent('<p>hello world</p>')

  const serialized = serializeLinterPos(editor.state, {
    from: 1,
    to: 6,
    targetText: 'hello',
    type: DecorationEnum.linter,
    title: 'title',
    description: 'decoration',
    dismissed: false,
  })

  expect(serialized).toHaveProperty('from')
  expect(serialized).toHaveProperty('to')
  invariant(serialized, 'serialized is not null')

  const deserialized = deserializeLinterPos(document, editor.state, serialized)
  expect(deserialized).toBeDefined()
  invariant(deserialized, 'deserialized is not null')

  expect(deserialized.from).toBe(1)
  expect(deserialized.to).toBe(6)
  expect(deserialized.targetText).toBe('hello')
})

it('will not crash if missing item', async () => {
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

  const serialized = serializeLinterPos(editor.state, {
    from: 1,
    to: 6,
    targetText: 'hello',
    type: DecorationEnum.linter,
    title: 'title',
    description: 'decoration',
    dismissed: false,
  })

  invariant(serialized, 'serialized is null')
  Reflect.deleteProperty(serialized.from, 'item')

  const deserialized = deserializeLinterPos(document, editor.state, serialized)
  expect(deserialized).toBeNull()
})
