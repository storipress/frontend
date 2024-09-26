import type { Node } from '@tiptap/pm/model'

import type { EditorState } from '@tiptap/pm/state'
import type * as Y from 'yjs'
// @ts-expect-error no type definition
import { absolutePositionToRelativePosition, relativePositionToAbsolutePosition, ySyncPluginKey } from 'y-prosemirror'
import { captureException } from '@sentry/vue'

export type RelativePositionJSON = ReturnType<typeof Y.relativePositionToJSON>
type ProseMirrorMapping = Map<Y.AbstractType<unknown>, Node | Array<Node>>

interface ProseMirrorBinding {
  type: Y.XmlFragment
  mapping: ProseMirrorMapping
}

export interface SyncPluginState {
  type: Y.XmlFragment
  binding: ProseMirrorBinding
}

export function getSyncPluginState(state: EditorState): SyncPluginState | null {
  return ySyncPluginKey.getState(state)
}

/**
 * Convert ProseMirror pos to yjs relative position
 * @param state editor state
 * @param pos position
 * @returns Converted position, null if failed
 */
export function posToRelative(state: EditorState, pos: number): Y.RelativePosition | null {
  const syncPluginState = getSyncPluginState(state)
  if (!syncPluginState) {
    return null
  }
  const { type, binding } = syncPluginState
  return absolutePositionToRelativePosition(pos, type, binding.mapping)
}

/**
 * Convert yjs relative position to ProseMirror position
 * @param ydoc Current ydoc
 * @param state editor state
 * @param relativePos yjs relative position
 * @returns ProseMirror pos, null if failed
 */
export function relativeToPos(ydoc: Y.Doc, state: EditorState, relativePos: RelativePositionJSON): number | null {
  const syncPluginState = getSyncPluginState(state)
  if (!syncPluginState) {
    return null
  }
  try {
    const { type, binding } = syncPluginState
    return relativePositionToAbsolutePosition(ydoc, type, relativePos, binding.mapping)
  } catch (error) {
    captureException(error)
    return null
  }
}
