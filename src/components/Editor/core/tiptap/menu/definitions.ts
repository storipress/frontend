import type { Component } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import type { ValueOf } from 'type-fest'
import { BlockType, StyleType } from '../../utils'
import LinkMenu from './link-menu.vue'
import FormatLinkIcon from './format-link.vue'
import FormatComment from './format-comment.vue'
import AskAIComponent from './ask-ai.vue'

const isMac = typeof window !== 'undefined' && /Mac/.test(window.navigator.platform)
export interface BaseFormat {
  type: string
  name: string
  class?: string
  icon?: string
  component?: Component
}

export const menuCommandsList = [
  'clearNodes',
  'toggleAI',
  'toggleComment',
  'delete',
  'toggleBold',
  'toggleItalic',
  'toggleUnderline',
  'toggleBlockquote',
  'toggleBulletList',
  'toggleOrderedList',
  'toggleHeading',
  'toggleLink',
  'setLink',
  'unsetLink',
] as const
export type MenuCommands = ValueOf<typeof menuCommandsList>
export type RichMenuCommands = 'toggleBold' | 'toggleItalic' | 'toggleUnderline'
type ActionType = 'normal' | 'block'

export interface KeyedFormat extends BaseFormat {
  /// Either state key for the action, or block type for the block action
  key: string
}

export interface ActionFormat extends KeyedFormat {
  type: 'action'
  actionType?: ActionType
  action: MenuCommands
  formatName?: string
  options?: Record<string, unknown>
}

export interface RichActionFormat extends KeyedFormat {
  type: 'action'
  actionType?: ActionType
  action: RichMenuCommands
  formatName?: string
  options?: Record<string, unknown>
}

/// StateFormat means that the format has more input, e.g. link
/// We will switch to correct view to handle this
export interface StateFormat extends KeyedFormat {
  type: 'state'
  actionType?: ActionType
  action: MenuCommands
  state: string
  formatName?: string
}

export interface DropdownFormat extends BaseFormat {
  type: 'dropdown'
  options: ActionFormat[]
}

export type ActionableFormat =
  | Pick<ActionFormat, 'type' | 'key' | 'action' | 'actionType' | 'formatName' | 'options'>
  | Pick<StateFormat, 'type' | 'state'>

export type Format = ActionFormat | StateFormat | DropdownFormat

export const linkFormat: StateFormat = {
  type: 'state',
  name: 'Link',
  key: BlockType.link,
  component: FormatLinkIcon,
  action: 'toggleLink',
  state: 'link',
}

export const blockFormats: ActionFormat[] = [
  {
    type: 'action',
    key: BlockType.text,
    name: 'Text',
    actionType: 'block',
    action: 'clearNodes',
    formatName: 'paragraph',
    icon: 'text',
  },
  {
    type: 'action',
    key: BlockType.h2,
    name: 'Heading 2',
    actionType: 'block',
    action: 'toggleHeading',
    icon: 'H2',
    formatName: 'heading',
    options: {
      level: 2,
    },
  },
  {
    type: 'action',
    key: BlockType.h3,
    name: 'Heading 3',
    actionType: 'block',
    action: 'toggleHeading',
    icon: 'H3',
    formatName: 'heading',
    options: {
      level: 3,
    },
  },
  {
    type: 'action',
    key: BlockType.bullet,
    name: 'Bulleted List',
    actionType: 'block',
    action: 'toggleBulletList',
    formatName: 'bulletList',
    icon: 'list_bullet',
  },
  {
    type: 'action',
    key: BlockType.numbered,
    name: 'Numbered List',
    actionType: 'block',
    action: 'toggleOrderedList',
    formatName: 'orderedList',
    icon: 'list_number',
  },
  {
    type: 'action',
    key: BlockType.quote,
    name: 'Quote',
    actionType: 'block',
    action: 'toggleBlockquote',
    formatName: 'blockquote',
    icon: 'quote',
  },
]

export const textItems: Format[][] = [
  [
    {
      type: 'action',
      name: 'Comment',
      key: 'comment',
      action: 'toggleAI',
      component: AskAIComponent,
    },
  ],
  [
    {
      type: 'dropdown',
      name: 'Text Format',
      options: blockFormats,
    },
  ],
  [linkFormat],
  [
    {
      type: 'action',
      name: 'Bold',
      class: 'px-2',
      key: StyleType.bold,
      action: 'toggleBold',
      icon: 'format_bold',
    },
    {
      type: 'action',
      name: 'Italic',
      class: 'px-2',
      key: StyleType.italic,
      action: 'toggleItalic',
      icon: 'format_italics',
    },
    {
      type: 'action',
      name: 'Underline',
      class: 'px-2',
      key: StyleType.underline,
      action: 'toggleUnderline',
      icon: 'format_underline',
    },
  ],
  [
    {
      type: 'action',
      name: 'Comment',
      key: BlockType.comment,
      action: 'toggleComment',
      component: FormatComment,
    },
  ],
]

export const NODE_STATE_KEYS = ['bold', 'italic', 'underline', 'link', 'comment'] as const
export const nodeIsActives: Record<string, (editor: Editor) => boolean> = {
  comment: (editor: Editor) => editor.can().removeSelectComment(),
}

export const STATE_DIALOG: Record<string, Component> = {
  link: LinkMenu,
}

const MODIFIER_KEYS = {
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  shiftKey: false,
} as const

export const MODIFIER = Object.keys(MODIFIER_KEYS) as (keyof typeof MODIFIER_KEYS)[]

export const LINK_MODIFIER = isMac
  ? {
      ...MODIFIER_KEYS,
      metaKey: true,
    }
  : {
      ...MODIFIER_KEYS,
      ctrlKey: true,
    }
