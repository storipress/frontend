import { Extension } from '@tiptap/core'
import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import invariant from 'tiny-invariant'
import type * as Y from 'yjs'
import type { EditorState } from '@tiptap/pm/state'
import { ContentLinterPluginKey } from './utils'
import { checkLinterElement } from './content-linter'
import { DecorationEnum, decorationStyle } from './types'
import type { ContentLinterOptions, ContentLinterStorage, ITextSplit, RowRecord, SerializedPos } from './types'

export function addTextSplit(state: EditorState, linterElement: SerializedPos) {
  const textSplit: ITextSplit[] = []
  const sliceContent = state.doc.slice(linterElement.from, linterElement.to)

  let textStart = linterElement.from
  let textEnd = 0
  sliceContent.content.forEach((item) => {
    textEnd = textStart + (item.text?.length ?? 0)
    textSplit.push({
      from: textStart,
      to: textEnd,
      id: `linterIssue-${textStart}-${textEnd}`,
    })
    textStart += item.text?.length ?? 0
  })

  return textSplit
}

export function recDecor() {
  const decorMap = new Map()
  function isNoDecoratorInRange(linterElement: SerializedPos) {
    return !decorMap.get(linterElement.from) || decorMap.get(linterElement.from) !== linterElement.to
  }

  function setDecor(linterElement: SerializedPos) {
    decorMap.set(linterElement.from, linterElement.to)
  }

  return {
    isNoDecoratorInRange,
    setDecor,
  }
}

export function getYdocMapElement(ydoc: Y.Doc, editorState: EditorState, ydocMap: Y.Map<SerializedPos>) {
  const elements = []
  for (const [_, item] of ydocMap.entries()) {
    const linterElement = checkLinterElement(ydoc, editorState, item)
    if (linterElement) {
      elements.push(linterElement)
    }
  }
  return elements
}

export function addDecoration(
  elements: SerializedPos[],
  state: EditorState,
  decorations: Decoration[],
  decorationTag: string,
  decorationType: DecorationEnum,
) {
  const { isNoDecoratorInRange, setDecor } = recDecor()
  elements.forEach((linterElement) => {
    if (
      isNoDecoratorInRange(linterElement) &&
      state.doc.textBetween(linterElement.from, linterElement.to) === linterElement.targetText &&
      !linterElement.dismissed
    ) {
      setDecor(linterElement)
      const textSplit = addTextSplit(state, linterElement)
      textSplit.forEach((item) => {
        decorations.push(
          Decoration.inline(item.from, item.to, {
            nodeName: decorationTag,
            class: decorationStyle[decorationType],
            'data-title': linterElement.title ?? '',
            'data-description': linterElement.description ?? '',
            'data-target': linterElement.targetText,
            'data-type': linterElement.type,
            'data-from': `${linterElement.from}`,
            'data-to': `${linterElement.to}`,
            'data-bias': `${linterElement.bias}`,
            id: item.id,
          }),
        )
      })
    }
  })
}

export const linterDecoration = Extension.create<ContentLinterOptions, ContentLinterStorage>({
  name: 'linterDecoration',
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
  addProseMirrorPlugins() {
    const plugin = new Plugin({
      key: ContentLinterPluginKey,
      props: {
        decorations: (state) => {
          invariant(this.options.document, 'document must be provided')
          this.options.linterMap = this.options.document.getMap(DecorationEnum.linter)
          this.options.spellCheckMap = this.options.document.getMap(DecorationEnum.spellCheck)
          const linterElements = getYdocMapElement(this.options.document, state, this.options.linterMap)
          const spellCheckElements = getYdocMapElement(this.options.document, state, this.options.spellCheckMap)
          const { isEditable } = this.editor
          const { decorationTag } = this.options
          const decorations: Decoration[] = []

          if (!isEditable) {
            return DecorationSet.empty
          }

          addDecoration(linterElements, state, decorations, decorationTag, DecorationEnum.linter)
          addDecoration(spellCheckElements, state, decorations, decorationTag, DecorationEnum.spellCheck)
          return DecorationSet.create(state.doc, decorations)
        },
      },
    })
    return [plugin]
  },
})
