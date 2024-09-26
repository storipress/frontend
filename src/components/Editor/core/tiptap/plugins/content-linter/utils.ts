import type { EditorState } from '@tiptap/pm/state'
import { PluginKey } from '@tiptap/pm/state'
import type { Mapping } from '@tiptap/pm/transform'
import * as Y from 'yjs'
import type { IBaseLinterPos, SerializedPos } from './types'
import { posToRelative, relativeToPos } from './yjs-utils'

export const ContentLinterPluginKey = new PluginKey('contentLinterPlugin')
export const ContentLinterMetaKey = 'contentLinter'

export function posMapThroughMapping<T extends IBaseLinterPos>(pos: T[], mapping: Mapping): T[] {
  return pos.map((item) => {
    return {
      ...item,
      from: mapping.map(item.from),
      to: mapping.map(item.to, -1),
    }
  })
}

export function serializeLinterPos(state: EditorState, pos: SerializedPos): SerializedPos | null {
  // With relative position, we don't need to mapping position to new position when editing
  const from = posToRelative(state, pos.from)
  let to = posToRelative(state, pos.to)
  let bias = 0

  if (!from || !to) {
    return null
  }

  // If pos at the end of the paragraph, absolutePositionToRelativePosition will not return to.item
  // It will break the after position transformation, we should reduce 1 to get the item.
  // We will add the bias back when applying change.
  // ref: https://github.com/storipress/manager-next/pull/2372/commits/e69d8ff1427454a10d5a273032be4e1f3ed6b164

  if (!to.item) {
    to = posToRelative(state, pos.to - 1)
    bias = 1
  }

  return {
    ...pos,
    from: Y.relativePositionToJSON(from),
    to: Y.relativePositionToJSON(to),
    bias,
  }
}

export function deserializeLinterPos(ydoc: Y.Doc, state: EditorState, pos: SerializedPos): SerializedPos | null {
  if (!pos.from?.item || !pos.to?.item) {
    return null
  }

  const from = relativeToPos(ydoc, state, pos.from)
  const to = relativeToPos(ydoc, state, pos.to)
  if (!from || !to) {
    return null
  }

  return {
    ...pos,
    from,
    to,
  }
}
