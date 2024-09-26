import type { VueRenderer } from '@tiptap/vue-3'
import type * as Y from 'yjs'
export interface ITextSplit {
  from: number
  to: number
  id: string
}

export interface IPostBody {
  type: string
  content: string
  target: string
  client_id: string
}

export interface ILinterSetting {
  title: string
  description: string
  prompt: string
}

export interface ContentLinterOptions {
  className: string
  decorationTag: string
  document: Y.Doc
  linterMap: Y.Map<SerializedPos>
  spellCheckMap: Y.Map<SerializedPos>
  rowRecordMap: Y.Map<RowRecord>
}

export interface ContentLinterStorage {
  component: VueRenderer
  spellCheckComponent: VueRenderer
  lastAbort: Record<string, AbortController>
  linterSetting: ILinterSetting[]
}

export interface IBaseLinterPos {
  from: number
  to: number
}

export enum DecorationEnum {
  'linter' = 'linter',
  'spellCheck' = 'spellCheck',
}

export enum RecordEnum {
  'rowRecord' = 'rowRecord',
}

export enum FieldEnum {
  'linter' = 'linter',
  'linterDismissed' = 'linterDismissed',
}

export const decorationStyle = {
  [DecorationEnum.spellCheck]: 'border-b-2 pb-1 border-red-700',
  [DecorationEnum.linter]: 'bg-purple-800 bg-opacity-20 border-b-2 border-purple-700',
}

export enum decorationTrack {
  'linter' = 'linter',
  'spellCheck' = 'spell_check',
}

type RelativePositionJSON = ReturnType<typeof Y.relativePositionToJSON>
export interface SerializedPos {
  from: RelativePositionJSON
  to: RelativePositionJSON
  targetText: string
  type: DecorationEnum
  title: string
  description: string
  dismissed: boolean
  bias?: number
}

export interface RowRecord {
  content: string
  prompt?: string
}

export interface IHashMeta {
  from: RelativePositionJSON
  to: RelativePositionJSON
  targetText: string
  type: DecorationEnum
}
