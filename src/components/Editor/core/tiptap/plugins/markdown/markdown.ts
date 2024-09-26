import { Extension, posToDOMRect } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { ResolvedPos } from '@tiptap/pm/model'
import { DOMParser, DOMSerializer, Slice } from '@tiptap/pm/model'
import markdown from 'markdown-it'
import type { Instance } from 'tippy.js'
import tippy from 'tippy.js'
import type { Editor } from '@tiptap/core'
import { VueRenderer } from '@tiptap/vue-3'
import type { EditorView } from 'prosemirror-view'
import CheckButton from './CheckButton.vue'

// from: https://github.com/ProseMirror/prosemirror-view/blob/6bfe0c43af771a86f3a473b0f53270ce6b958fc8/src/clipboard.ts#L55
function defaultClipboardTextParser(text: string, $context: ResolvedPos, view: EditorView) {
  const marks = $context.marks()
  const { schema } = view.state
  const serializer = DOMSerializer.fromSchema(schema)
  const parser = DOMParser.fromSchema(schema)
  const dom = document.createElement('div')
  text.split(/(?:\r\n?|\n)+/).forEach((block) => {
    const p = dom.appendChild(document.createElement('p'))
    if (block) p.appendChild(serializer.serializeNode(schema.text(block, marks)))
  })
  return parser.parseSlice(dom, { preserveWhitespace: true, context: $context })
}

export function mountCheckButton(
  component: Ref<VueRenderer | null>,
  clickFn: () => void,
  mountFn: (mounted: boolean) => void,
  editor: Editor,
) {
  component.value?.destroy()
  component.value = new VueRenderer(CheckButton, {
    props: {
      clickFn,
      mountFn,
    },
    editor,
  })
}

export const Markdown = Extension.create({
  name: 'clipboardTextSerializer',

  addProseMirrorPlugins() {
    let tippyTarget: Instance | null = null
    const editor = this.editor
    const component: Ref<VueRenderer | null> = ref(null)
    return [
      new Plugin({
        key: new PluginKey('clipboardTextPlugin'),
        props: {
          clipboardTextParser: (text: string, $context, _plain, view: EditorView): Slice => {
            const dom = document.createElement('div')
            const scope = effectScope()
            const from = editor.state.selection.from - 1
            const md = markdown()
            const parser = DOMParser.fromSchema(view.state.schema)
            const markdownString = md.render(text)
            const buttonMounted = ref(false)
            const domRect = () => posToDOMRect(view, editor.state.selection.from, editor.state.selection.to)
            const clickFn = () => {
              tippyTarget?.destroy()
              editor.commands.deleteRange({ from, to: editor.state.selection.to })
              const content = defaultClipboardTextParser(text, $context, view)
              editor.commands.insertContent(content.toJSON())
              editor.commands.command(({ tr, dispatch }) => {
                dispatch?.(tr.insert(from, content.content))
                return true
              })
            }

            const mountFn = (mounted: boolean) => {
              buttonMounted.value = mounted
            }

            dom.innerHTML = markdownString
            const hasFormat = dom.querySelectorAll(':not(p)').length > 0
            if (!hasFormat) {
              return defaultClipboardTextParser(text, $context, view)
            }

            mountCheckButton(component, clickFn, mountFn, editor)

            scope.run(() => {
              whenever(buttonMounted, () => {
                tippyTarget?.destroy()
                tippyTarget = tippy(view.dom, {
                  getReferenceClientRect: domRect,
                  appendTo: () => document.body,
                  content: component.value?.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  allowHTML: true,
                  placement: 'bottom-start',
                  popperOptions: {
                    modifiers: [
                      { name: 'flip', enabled: false },
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 0],
                        },
                      },
                    ],
                  },
                  onDestroy: () => {
                    component.value?.destroy()
                    component.value = null
                  },
                  onMount() {
                    tippyTarget?.popper.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
                    window.scroll({ top: window.scrollY + 100, behavior: 'smooth' })
                  },
                })
              })
              onKeyStroke(() => {
                tippyTarget?.destroy()
                scope.stop()
              })
            })

            return parser.parseSlice(dom, { preserveWhitespace: true, context: $context })
          },
          transformPasted(slice, view) {
            let fragment = slice.content
            let shouldReplace = false
            fragment.forEach((node) => {
              if (node.attrs?.level === 1) {
                shouldReplace = true
              }
            })

            fragment.forEach((node, _, index) => {
              if (shouldReplace && node.attrs?.level < 3) {
                fragment = fragment.replaceChild(
                  index,
                  view.state.schema.node(
                    node.type,
                    {
                      ...node.attrs,
                      level: node.attrs.level + 1,
                    },
                    node.content,
                    node.marks,
                  ),
                )
              }
            })
            return new Slice(fragment, slice.openStart, slice.openEnd)
          },
        },
      }),
    ]
  },
})
