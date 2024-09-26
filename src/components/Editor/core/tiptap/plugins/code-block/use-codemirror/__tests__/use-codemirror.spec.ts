import { describe, it } from 'vitest'
import { Editor } from '@tiptap/vue-3'
import type { EditorView } from 'codemirror'
import { minimalSetup } from 'codemirror'
import type { Node } from '@tiptap/pm/model'
import type { ShallowRef } from 'vue'
import invariant from 'tiny-invariant'
import { useCodeMirror } from '../use-codemirror'
import { extensions } from './helper'
import { render } from '~/test-helpers'
import { raf } from '~/utils'

describe('useCodeMirror', () => {
  it('should be defined', () => {
    const editor = new Editor({
      extensions,
      content: {
        type: 'doc',
        content: [
          {
            type: 'codeBlock',
          },
        ],
      },
    })

    let outerCm: ShallowRef<EditorView | undefined> = shallowRef()
    const comp = defineComponent(() => {
      const { cm, target } = useCodeMirror({
        props: {
          editor,
          getPos: () => 0,
          node: editor.state.doc.nodeAt(0) as Node,
        },
        getExtensions: () => [minimalSetup],
      })
      outerCm = cm
      return () => {
        return h('div', { ref: target })
      }
    })

    render(comp)

    expect(outerCm.value).toBeDefined()
  })

  it('value should be synced from codemirror', async () => {
    const editor = new Editor({
      extensions,
      content: {
        type: 'doc',
        content: [
          {
            type: 'codeBlock',
          },
        ],
      },
    })

    let outerCm: ShallowRef<EditorView | undefined> = shallowRef()
    const comp = defineComponent(() => {
      const { cm, target } = useCodeMirror({
        props: {
          editor,
          getPos: () => 0,
          node: editor.state.doc.nodeAt(0) as Node,
        },
        getExtensions: () => [minimalSetup],
      })
      outerCm = cm
      return () => {
        return h('div', { ref: target })
      }
    })

    render(comp)

    invariant(outerCm.value, 'outerCm is undefined')
    const cm = outerCm.value

    cm.dispatch({
      changes: {
        from: 0,
        to: 0,
        insert: 'hello',
      },
    })

    await raf()

    expect(editor.getText()).toBe('hello')
  })
})
