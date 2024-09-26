import { Extension } from '@tiptap/core'
import type { DebouncedFunc } from 'lodash-es'
import { VueRenderer } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import { debounce } from 'lodash-es'
import * as Sentry from '@sentry/vue'
import { z } from 'zod'
import { hash } from 'ohash'
import type * as Y from 'yjs'
import invariant from 'tiny-invariant'
import { JSONParser } from '@streamparser/json-whatwg'
import type { EditorState } from '@tiptap/pm/state'
import { synced } from './hook'
import CheckButton from './CheckButton.vue'
import { ContentLinterMetaKey, deserializeLinterPos, serializeLinterPos } from './utils'
import { DecorationEnum, RecordEnum, decorationTrack } from './types'

import type {
  ContentLinterOptions,
  ContentLinterStorage,
  IHashMeta,
  ILinterSetting,
  IPostBody,
  RowRecord,
  SerializedPos,
} from './types'
import { useAuthStore } from '~/stores/auth'
import { postAI, postSpellCheck } from '~/components/Editor/utils'
import { ListLintersDocument } from '~/graphql-operations'
import { isIframe } from '~/utils'

const linterObjectSchema = z.object({
  parent: z.object({
    explanation: z.string(),
    ruleBreach: z.string(),
    severity: z.string(),
    suggestedChange: z.string(),
  }),
})

let debounced: DebouncedFunc<() => void>

export function extendStartEnd(initStart: number, initEnd: number, content: string) {
  let start = initStart
  let end = initEnd
  while (content[start]?.match(/\w/)) {
    start -= 1
  }

  while (content[end]?.match(/\w/)) {
    end += 1
  }
  return [start + 1, end]
}

export function sendLinter(editor: Editor) {
  editor.commands.setMeta(ContentLinterMetaKey, {})
}

export function recordContentChanged(rowRecordMap: Y.Map<RowRecord>, rowRecord: string, nowContent: string) {
  const oldRecord = rowRecordMap.get(rowRecord)
  if (oldRecord?.content !== nowContent) {
    return true
  }
  return false
}

export function hashMeta(metaContent: IHashMeta | null) {
  if (!metaContent) {
    return ''
  }
  const { from, to, targetText, type } = metaContent
  return hash({ from, to, targetText, type })
}

export async function waitPostSpellCheck(
  content: string,
  editor: Editor,
  options: ContentLinterOptions,
  lastAbort: AbortController,
) {
  const spellCheckResult = await postSpellCheck(content, lastAbort.signal)
  if (spellCheckResult.edits.length > 0) {
    spellCheckResult.edits.forEach((item) => {
      const metaContent = {
        from: item.sentence_start + item.start + 1,
        to: item.sentence_start + item.end + 1,
        targetText: item.sentence.slice(item.start, item.end),
        title: 'Suggested change',
        description: item.replacement,
        type: DecorationEnum.spellCheck,
        dismissed: false,
      }
      const serialized = serializeLinterPos(editor.state, metaContent)
      const linterMap = options.document.getMap(DecorationEnum.spellCheck)
      const hashedSerialized = hashMeta(serialized)
      if (!linterMap.get(hashedSerialized)) {
        linterMap.set(hashedSerialized, serialized)
        sendLinter(editor)
      }
    })
  }
  options.rowRecordMap.set('spellCheck', { content })
}

export async function waitPostAI(
  postBody: IPostBody,
  content: string,
  editor: Editor,
  options: ContentLinterOptions,
  linterSetting: ILinterSetting,
  lastAbort: AbortController,
) {
  try {
    const streamResult = await postAI(postBody, lastAbort.signal)
    const parser = new JSONParser()
    const reader = streamResult.body?.pipeThrough(parser).getReader()
    if (!reader) {
      options.rowRecordMap.set(linterSetting.prompt, {
        content,
        prompt: linterSetting.prompt,
      })
      return
    }

    while (true) {
      const { done, value } = await reader.read()
      if (value?.key === 'suggestedChange') {
        const result = linterObjectSchema.safeParse(value)
        if (!result.success) {
          continue
        }
        const { parent } = result.data

        if (parent.explanation && parent.suggestedChange && parent.ruleBreach) {
          if (Number.parseInt(parent.severity) < 3) {
            continue
          }

          const matchesPos = []
          const ruleBreach = parent.ruleBreach
          let nowIndex = content.indexOf(ruleBreach, 0)
          while (nowIndex >= 0) {
            matchesPos.push(nowIndex)
            nowIndex = content.indexOf(ruleBreach, nowIndex + 1)
          }

          matchesPos.forEach((targetTextPos) => {
            const [start, end] = extendStartEnd(targetTextPos, targetTextPos + parent.ruleBreach.length, content)

            const metaContent = {
              from: start + 1,
              to: end + 1,
              targetText: parent.ruleBreach,
              title: parent.explanation,
              description: parent.suggestedChange,
              type: DecorationEnum.linter,
              dismissed: false,
            }

            const serialized = serializeLinterPos(editor.state, metaContent)
            const linterMap = options.document.getMap(DecorationEnum.linter)
            const hashedSerialized = hashMeta(serialized)
            if (!linterMap.get(hashedSerialized)) {
              linterMap.set(hashedSerialized, serialized)
              sendLinter(editor)
            }
          })
        }
      }
      if (done) {
        break
      }
    }

    options.rowRecordMap.set(linterSetting.prompt, {
      content,
      prompt: linterSetting.prompt,
    })
  } catch {
    // do nothing
  }
}

export function setAbort(storage: ContentLinterStorage, abortRecord: string) {
  if (!storage.lastAbort[abortRecord]) {
    return new AbortController()
  } else {
    storage.lastAbort[abortRecord].abort()
    return new AbortController()
  }
}

export function checkLinterElement(doc: Y.Doc, state: EditorState, item: SerializedPos): SerializedPos | undefined {
  if (!doc || !state || !item) {
    return
  }

  if (!item.from || !item.from.item) {
    return
  }

  if (!item.to || !item.to.item) {
    return
  }

  const linterElement = deserializeLinterPos(doc, state, item)
  if (!linterElement) {
    return
  }

  linterElement.to = linterElement.to + (linterElement.bias || 0)

  // Part 1
  // When we delete the element, the returned linter element position linterElement.to will always bigger than linterElement.from 1
  // We should ignore this situation by check whether linterElement.from + 1 bigger than linterElement.to
  // Part 2
  // When we delete the photo between two paragraphs, old elements position will be larger than nodeSize 1
  // We should check node size should be larger than linterElement.to + 1
  if (
    state.doc.nodeSize <= linterElement.to + 1 ||
    linterElement.from <= 0 ||
    linterElement.from + 1 >= linterElement.to
  ) {
    return
  }

  try {
    const text = state.doc.textBetween(linterElement.from, linterElement.to)
    if (text !== linterElement.targetText) {
      return
    }
  } catch (err) {
    Sentry.captureException(err, (scope) => {
      scope.setTag('linter_position', 'error')
      return scope
    })
    return
  }

  return linterElement
}

export function sendToLinterFromMap(ydoc: Y.Doc, editor: Editor, ydocMap: Y.Map<SerializedPos>) {
  const pendingCleanup = new Set<string>()
  for (const [key, item] of ydocMap.entries()) {
    const linterElement = checkLinterElement(ydoc, editor.state, item)
    if (linterElement) {
      sendLinter(editor)
    } else {
      pendingCleanup.add(key)
    }
  }

  for (const key of pendingCleanup) {
    ydocMap.delete(key)
  }
}

export function clearUselessRowRecord(linterSetting: ILinterSetting[], rowRecordMap: Y.Map<RowRecord>) {
  if (!rowRecordMap) {
    return
  }

  const settingSet = new Set<string>()
  // Add the prompt value of each element to the settingSet.
  linterSetting.forEach((nowSetting: ILinterSetting) => {
    settingSet.add(nowSetting.prompt)
  })

  for (const [key, item] of rowRecordMap.entries()) {
    // Check if the item has a prompt property and if its value is not in the settingSet.
    if (item.prompt && !settingSet.has(item.prompt)) {
      rowRecordMap.delete(key)
    }
  }
}

export const contentLinter = Extension.create<ContentLinterOptions, ContentLinterStorage>({
  name: 'ContentLinter',
  addOptions() {
    return {
      className: 'content-hint',
      decorationTag: 'span',
      document: undefined as unknown as Y.Doc,
      linterMap: undefined as unknown as Y.Map<SerializedPos>,
      spellCheckMap: undefined as unknown as Y.Map<SerializedPos>,
      rowRecordMap: undefined as unknown as Y.Map<RowRecord>,
    }
  },
  onCreate() {
    invariant(this.options.document, 'document must be provided')
    this.options.linterMap = this.options.document.getMap(DecorationEnum.linter)
    this.options.spellCheckMap = this.options.document.getMap(DecorationEnum.spellCheck)
    const syncListener = synced.on(() => {
      sendToLinterFromMap(this.options.document, this.editor, this.options.linterMap)
      sendToLinterFromMap(this.options.document, this.editor, this.options.spellCheckMap)
      syncListener.off()
    })

    const editorElement = this.editor.view.dom
    const { result } = useQuery(ListLintersDocument)
    this.storage.component = markRaw(
      new VueRenderer(CheckButton, {
        editor: this.editor,
        props: {
          floatSetting: null,
        },
      }),
    )

    this.storage.spellCheckComponent = markRaw(
      new VueRenderer(CheckButton, {
        editor: this.editor,
        props: {
          floatSetting: null,
        },
      }),
    )

    editorElement?.addEventListener('click', (e) => {
      const el = e.target as HTMLElement | undefined
      const targetId = el?.id
      if (targetId && targetId.startsWith('linterIssue')) {
        const title = el.getAttribute('data-title')
        const description = el.getAttribute('data-description')
        const targetText = el.getAttribute('data-target')
        const type = el.getAttribute('data-type') as DecorationEnum
        const from = Number.parseInt(el.getAttribute('data-from') ?? '0')
        const to = Number.parseInt(el.getAttribute('data-to') || '0')
        const bias = Number.parseInt(el.getAttribute('data-bias') || '0')

        if (typeof title !== 'string' || typeof description !== 'string' || !type || !targetText) {
          return
        }

        this.storage.component.updateProps({
          floatSetting: {
            referenceElement: e.target,
            shouldShow: true,
            showApply: true,
            showDeleted: description === '',
            type,
            title,
            description: description === '' ? targetText : description,
            onApply: () => {
              this.editor.chain().deleteRange({ from, to }).insertContentAt(from, description).run()
              this.storage.component.updateProps({ floatSetting: { shouldShow: false } })
              sendTrack(`ai_${decorationTrack[type]}_applied`)
            },
            onDismiss: () => {
              const metaContent = {
                from,
                to,
                targetText,
                title,
                description,
                type,
                bias,
                dismissed: false,
              }

              const serialized = serializeLinterPos(this.editor.state, metaContent)
              const optionMap = type === DecorationEnum.spellCheck ? this.options.spellCheckMap : this.options.linterMap
              const hashedSerialized = hashMeta(serialized)
              const targetElement = optionMap.get(hashedSerialized)
              if (targetElement && serialized) {
                optionMap.set(hashedSerialized, { ...serialized, dismissed: true })
                sendTrack(`ai_${decorationTrack[type]}_dismissed`)
                sendLinter(this.editor)
              }
              this.storage.component.updateProps({ floatSetting: { shouldShow: false } })
            },
          },
        })
      }
    })

    watch(
      () => result.value?.linters.edges,
      (val) => {
        if (val) {
          this.storage.linterSetting = val.map((item) => item.node)
          clearUselessRowRecord(this.storage.linterSetting, this.options.rowRecordMap)
        }
      },
    )
  },
  addStorage() {
    return {
      component: null as unknown as VueRenderer,
      spellCheckComponent: null as unknown as VueRenderer,
      lastAbort: {},
      linterSetting: [
        {
          title: '',
          description: '',
          prompt: '',
        },
      ],
    }
  },
  onTransaction({ transaction }) {
    if (isIframe) {
      return
    }
    invariant(this.options.document, 'document must be provided')
    const authStore = useAuthStore()
    this.options.rowRecordMap = this.options.document.getMap(RecordEnum.rowRecord)
    const linter = () => {
      let content = ''
      transaction.doc.descendants((node) => {
        if (!node.isTextblock || !node.textContent) {
          content += '\n'
          return
        }
        content += `${node.textContent}\n`
      })

      if (this.storage.linterSetting.length > 0 && this.storage.linterSetting.some((setting) => setting.prompt)) {
        this.storage.linterSetting.forEach((nowSetting: ILinterSetting) => {
          const rowRecord = nowSetting.prompt
          const recordNotFound = !this.options.rowRecordMap.has(rowRecord)
          if (
            (recordNotFound || recordContentChanged(this.options.rowRecordMap, rowRecord, content)) &&
            nowSetting.prompt
          ) {
            this.storage.lastAbort[rowRecord] = setAbort(this.storage, rowRecord)
            const postBody = {
              type: 'lint-v2',
              content,
              target: nowSetting.prompt,
              client_id: authStore.clientID,
            }
            waitPostAI(postBody, content, this.editor, this.options, nowSetting, this.storage.lastAbort[rowRecord])
          }
        })
      }

      const rowRecord = 'spellCheck'
      const recordNotFound = !this.options.rowRecordMap.has(rowRecord)
      if (recordNotFound || recordContentChanged(this.options.rowRecordMap, rowRecord, content)) {
        this.storage.lastAbort[rowRecord] = setAbort(this.storage, rowRecord)
        waitPostSpellCheck(content, this.editor, this.options, this.storage.lastAbort[rowRecord])
      }
    }

    if (debounced) {
      debounced?.cancel()
    }
    debounced = debounce(linter, 2000)

    debounced()
  },
})
