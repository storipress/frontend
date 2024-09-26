import { EditorView, minimalSetup } from 'codemirror'
import type { Content } from '@tiptap/core'
import { Editor } from '@tiptap/core'
import { describe, it, vi } from 'vitest'
import type { Node } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'
import { createMaybeEscape } from '../maybe-escape'
import { extensions } from './helper'

vi.stubGlobal(
  'IntersectionObserver',
  class IntersectionObserver {
    observe = () => {}
  },
)

interface TextFixtureInput {
  content: Content
  codeBlockIndex: number
}

const basicFixture: TextFixtureInput = {
  codeBlockIndex: 1,
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'line 1',
          },
        ],
      },
      {
        type: 'codeBlock',
        attrs: {
          language: 'javascript',
        },
        content: [
          {
            type: 'text',
            text: 'console.log("Hello world")',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'line 2',
          },
        ],
      },
    ],
  },
}

const codeBlockAtHead: TextFixtureInput = {
  codeBlockIndex: 0,
  content: {
    type: 'doc',
    content: [
      {
        type: 'codeBlock',
        attrs: {
          language: 'javascript',
        },
        content: [
          {
            type: 'text',
            text: 'console.log("Hello world")',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'line after',
          },
        ],
      },
    ],
  },
}

const codeBlockAtBottom: TextFixtureInput = {
  codeBlockIndex: 1,
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'line before',
          },
        ],
      },
      {
        type: 'codeBlock',
        attrs: {
          language: 'javascript',
        },
        content: [
          {
            type: 'text',
            text: 'console.log("Hello world")',
          },
        ],
      },
    ],
  },
}

describe('createMaybeEscape', () => {
  it('should escape from code block', () => {
    const { maybeEscape, editor } = setupFixture(basicFixture)

    maybeEscape('line', -1)

    expect(editor.state.selection.$from.node(1).type.name).toBe('paragraph')
  })

  it('should keep in head codeblock', () => {
    const { maybeEscape, editor } = setupFixture(codeBlockAtHead)

    // test cursor keep in codeblock
    maybeEscape('line', -1)

    expect(editor.state.selection.$from.node(1).type.name).toBe('codeBlock')

    // test cursor could move
    maybeEscape('line', 1)

    expect(editor.state.selection.$from.node(1).type.name).toBe('paragraph')
  })

  it('should keep in bottom codeblock', () => {
    const { maybeEscape, editor } = setupFixture(codeBlockAtBottom)

    maybeEscape('line', 1)

    expect(editor.state.selection.$from.node(1).type.name).toBe('codeBlock')
  })
})

function setupFixture({ content, codeBlockIndex }: TextFixtureInput) {
  const editor = new Editor({
    extensions,
    content,
  })

  const codeMirror = new EditorView({
    extensions: minimalSetup,
  })

  const $rootPos = editor.state.doc.resolve(0)
  const codeBlockPos = $rootPos.posAtIndex(codeBlockIndex)

  // +1 to put cursor at the start of codeblock
  editor.view.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, codeBlockPos + 1)))

  const maybeEscape = createMaybeEscape(
    {
      editor,
      node: editor.state.doc.nodeAt(codeBlockPos) as Node,
      getPos: () => codeBlockPos,
    },
    () => codeMirror,
    { shouldScroll: false },
  )
  return { maybeEscape, editor }
}
