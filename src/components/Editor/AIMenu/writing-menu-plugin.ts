import { Extension } from '@tiptap/core'
import { match } from 'ts-pattern'
import type { CommandProps, Editor, Range } from '@tiptap/core'
import type { EditorState, PluginKey } from '@tiptap/pm/state'
import { Plugin } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import invariant from 'tiny-invariant'
import * as Sentry from '@sentry/vue'
import { useAIMenuStore } from './store'
import { customInsertContent } from './utils'
import { WriteMenuPluginKey } from './setting'

export interface WriteMenuOptions<I = any> {
  pluginKey?: PluginKey
  editor: Editor
  decorationTag?: string
  decorationClass?: string
  command: (props: { editor: Editor; range: Range; props: I }) => void
  render?: () => {
    onBeforeStart?: (props: WriteMenuProps<I>) => void
    onStart?: (props: WriteMenuProps<I>) => void
    onBeforeUpdate?: (props: WriteMenuProps<I>) => void
    onUpdate?: (props: WriteMenuProps<I>) => void
    onExit?: (props: WriteMenuProps<I>) => void
    onKeyDown?: (props: WriteMenuKeyDownProps) => boolean
  }
  allow?: (props: { editor: Editor; state: EditorState; range: Range }) => boolean
}

export interface WriteMenuProps<I = any> {
  editor: Editor
  range: Range
  state: 'loading' | 'idle'
  modify?: boolean
  command: (props: I) => void
  decorationNode: Element | null
  clientRect?: (() => DOMRect | null) | null
}

export interface WriteMenuKeyDownProps {
  view: EditorView
  event: KeyboardEvent
  range: Range
}

interface StartWritingMeta extends StartWritingInput {
  type: 'start'
}

export interface UpdateWritingMeta {
  type: 'update'
  added: number
}

interface ModifyWritingMeta {
  type: 'modify'
}

interface EndWritingMeta {
  type: 'end'
}

interface ExitWritingMeta {
  type: 'exit'
}

export interface RetryWritingMeta {
  type: 'retry'
  from: number
}

type WriteMenuPluginMeta =
  | StartWritingMeta
  | UpdateWritingMeta
  | ModifyWritingMeta
  | EndWritingMeta
  | ExitWritingMeta
  | RetryWritingMeta

interface WriteMenuPluginState {
  active: boolean
  modify?: boolean
  state: 'loading' | 'idle'
  prompt?: string | null
  decorationId?: string | null
  range: Range
}

async function writeResponse({
  editor,
  response,
  from,
}: {
  editor: Editor
  response: AsyncIterableIterator<string>
  from: number
}) {
  let start = from
  const AIstore = useAIMenuStore()

  try {
    for await (const text of response) {
      AIstore.bufferContent += text
      customInsertContent(start, editor, text)
      start += text.length
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      AIstore.chatId = ''
    } else {
      Sentry.captureException(error)
    }
  } finally {
    AIstore.editTo = start
    editor.commands.command(({ tr, dispatch }) => {
      const next = tr.setMeta(WriteMenuPluginKey, {
        type: 'end',
      } as EndWritingMeta)
      if (dispatch) dispatch(next)
      return true
    })
  }
}

export function WriteMenuPlugin<I = any>({
  pluginKey = WriteMenuPluginKey,
  editor,
  decorationTag = 'span',
  decorationClass = 'suggestion',
  command = () => ({}),
  render = () => ({}),
  allow = () => true,
}: WriteMenuOptions<I>) {
  let props: WriteMenuProps<I> | undefined
  const renderer = render?.()

  const plugin: Plugin<WriteMenuPluginState> = new Plugin({
    key: pluginKey,

    view() {
      return {
        update: (view, prevState) => {
          const prev: WriteMenuPluginState = this.key?.getState(prevState)
          const next: WriteMenuPluginState = this.key?.getState(view.state)

          // See how the state changed
          const changed = prev.range.to !== next.range.to || prev.state !== next.state
          const started = !prev.active && next.active
          const stopped = prev.active && !next.active
          const handleStart = started
          const handleChange = changed
          const handleExit = stopped

          if (!next.active && !stopped) {
            return
          }

          const state = handleExit && !handleStart ? prev : next
          const decorationNodeList = view.dom.querySelectorAll(`[data-decoration-id="${state.decorationId}"]`)
          const decorationNode = decorationNodeList[decorationNodeList.length - 1]

          props = {
            editor,
            range: state.range,
            state: state.state,
            modify: state.modify,
            command: (commandProps) => {
              command({
                editor,
                range: state.range,
                props: commandProps,
              })
            },
            decorationNode,
            // virtual node for popper.js or tippy.js
            // this can be used for building popups without a DOM node
            clientRect: decorationNode
              ? () => {
                  // because of `items` can be asynchrounous we’ll search for the current decoration node
                  const { decorationId } = this.key?.getState(editor.state) as WriteMenuPluginState
                  const currentDecorationNodeList = view.dom.querySelectorAll(`[data-decoration-id="${decorationId}"]`)
                  const currentDecorationNode = currentDecorationNodeList[currentDecorationNodeList.length - 1]

                  return currentDecorationNode?.getBoundingClientRect() || null
                }
              : () => {
                  const rect = coordsToDOMRect(view.coordsAtPos(state.range.from))
                  // 32 is the default height of paragraph
                  return new DOMRect(rect.x, rect.y, rect.width, Math.max(rect.height, 32))
                },
          }

          if (handleStart) {
            renderer?.onBeforeStart?.(props)
          }

          if (handleChange) {
            renderer?.onBeforeUpdate?.(props)
          }

          if (handleExit) {
            renderer?.onExit?.(props)
          }

          if (handleChange) {
            renderer?.onUpdate?.(props)
          }

          if (handleStart) {
            renderer?.onStart?.(props)
          }
        },

        destroy: () => {
          if (!props) {
            return
          }

          renderer?.onExit?.(props)
        },
      }
    },

    state: {
      // Initialize the plugin's internal state.
      init() {
        const state: WriteMenuPluginState = {
          active: false,
          state: 'idle',
          range: {
            from: 0,
            to: 0,
          },
        }

        return state
      },

      // Apply changes to the plugin state from a view transaction.
      apply(transaction, prev, oldState, state) {
        const meta = transaction.getMeta(pluginKey) as WriteMenuPluginMeta
        const store = useAIMenuStore()

        if (!meta) {
          return prev
        }

        const { selection } = transaction
        let { from, to, $from } = selection

        return match(meta)
          .with({ type: 'start' }, ({ response, prompt }): WriteMenuPluginState => {
            // If we found a match, update the current state to show it
            if (allow({ editor, state, range: { from, to: from } })) {
              editor.setEditable(false)
              const decorationId = `id_${Math.floor(Math.random() * 0xffffffff)}`

              writeResponse({ editor, response, from })
              // extend from to start of the paragraph
              if ($from.parent.type.name === 'paragraph') {
                from = $from.before()
              } else {
                to = from
              }
              return {
                ...prev,
                prompt,
                active: true,
                state: 'loading',
                decorationId: prev.decorationId ? prev.decorationId : decorationId,
                range: {
                  from,
                  to,
                },
              }
            } else {
              return {
                ...prev,
                active: false,
              }
            }
          })
          .with({ type: 'update' }, ({ added }): WriteMenuPluginState => {
            return {
              ...prev,
              state: 'loading',
              range: {
                from: prev.range.from,
                to: prev.range.to + added,
              },
            }
          })
          .with({ type: 'retry' }, ({ from }): WriteMenuPluginState => {
            return {
              ...prev,
              state: 'loading',
              range: {
                from,
                to: from,
              },
            }
          })
          .with({ type: 'modify' }, (): WriteMenuPluginState => {
            if (allow({ editor, state, range: { from, to } })) {
              editor.setEditable(false)
              editor.commands.focus()

              const decorationId = `id_${Math.floor(Math.random() * 0xffffffff)}`
              return {
                ...prev,
                active: true,
                state: 'loading',
                modify: true,
                decorationId: prev.decorationId ? prev.decorationId : decorationId,
                range: {
                  from,
                  to,
                },
              }
            } else {
              return {
                ...prev,
                active: false,
                modify: false,
              }
            }
          })
          .with({ type: 'end' }, (): WriteMenuPluginState => {
            editor.setEditable(true)
            return {
              ...prev,
              state: 'idle',
            }
          })
          .with({ type: 'exit' }, (): WriteMenuPluginState => {
            editor.setEditable(true)
            store.response = ''
            store.responseEnd = true
            store.prompt = ''
            return {
              ...prev,
              active: false,
              modify: false,
              state: 'idle',
              range: {
                from: 0,
                to: 0,
              },
              prompt: null,
              decorationId: null,
            }
          })
          .exhaustive()
      },
    },

    props: {
      // Call the keydown hook if suggestion is active.
      handleKeyDown(view, event) {
        const state = plugin.getState(view.state)
        invariant(state, 'WriteMenuPlugin: state is undefined')
        const { active, range } = state

        if (!active) {
          return false
        }

        return renderer?.onKeyDown?.({ view, event, range }) || false
      },

      // Setup decorator on the currently active suggestion.
      decorations(state) {
        const pluginState = plugin.getState(state)
        invariant(pluginState, 'WriteMenuPlugin: pluginState is undefined')

        const { active, range, decorationId, modify } = pluginState

        if (!active) {
          return null
        }

        return DecorationSet.create(state.doc, [
          Decoration.inline(range.from, range.to, {
            nodeName: decorationTag,
            class: decorationClass,
            style: modify ? 'background-color: rgba(2, 132, 199, 0.25)' : undefined,
            'data-decoration-id': decorationId || undefined,
          }),
        ])
      },
    },
  })

  return plugin
}

export interface StartWritingInput {
  prompt: string
  response: AsyncIterableIterator<string>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    writeMenu: {
      startWriting: (input: StartWritingInput) => ReturnType
      toggleAI: () => ReturnType
      startModify: () => ReturnType
      closeAIMenu: () => ReturnType
    }
  }
}

export const WriteMenu = Extension.create<Omit<WriteMenuOptions, 'editor'>>({
  name: 'writeMenu',

  addOptions() {
    return {
      pluginKey: WriteMenuPluginKey,
      decorationTag: 'span',
      decorationClass: 'ai-suggestion',
      command: () => ({}),
      render: () => ({}),
      allow: () => true,
    }
  },

  addCommands() {
    return {
      toggleAI: () => () => {
        return this.editor.chain().startModify().run()
      },
      startWriting: ({ prompt, response }) => {
        return ({ tr, dispatch }: CommandProps) => {
          if (dispatch) {
            sendTrackUnchecked('ai_view', {
              type: 'create',
            })
            dispatch(
              tr.setMeta(WriteMenuPluginKey, {
                type: 'start',
                prompt,
                response,
              }),
            )
          }
          return true
        }
      },
      startModify: () => {
        return ({ tr, dispatch }: CommandProps) => {
          if (dispatch) {
            sendTrackUnchecked('ai_view', {
              type: 'modify',
            })
            dispatch(
              tr.setMeta(WriteMenuPluginKey, {
                type: 'modify',
              }),
            )
          }
          return true
        }
      },
      closeAIMenu: () => {
        return ({ tr, dispatch }: CommandProps) => {
          if (dispatch) {
            dispatch(
              tr.setMeta(WriteMenuPluginKey, {
                type: 'exit',
              }),
            )
          }
          return true
        }
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      WriteMenuPlugin({
        editor: this.editor,
        ...this.options,
      }),
    ]
  },
})

function coordsToDOMRect(croods: { left: number; right: number; top: number; bottom: number }): DOMRect {
  return new DOMRect(croods.left, croods.top, croods.right - croods.left, croods.bottom - croods.top)
}
