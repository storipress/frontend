import { promptEnum, promptTypeEnum } from '../setting'

export enum Action {
  Replace = 'replace',
  Insert = 'insert',
  Retry = 'retry',
  Discard = 'discard',
}

export interface PromptItem {
  type: 'prompt'
  icon: string
  title: string
  prompt: string
  promptType?: string
  shouldAskUser?: boolean
}

export interface ActionItem {
  type: 'action'
  icon: string
  title: string
  action: Action
  prompt?: string
  promptType?: string
  shouldAskUser?: boolean
}

export type Item = PromptItem | ActionItem

export const editItems: Item[] = [
  {
    type: 'prompt',
    title: 'Improve writing',
    prompt: promptEnum.improve,
    promptType: promptTypeEnum.improve,
    icon: 'magic',
  },
  {
    type: 'prompt',
    title: 'Fix spelling & grammar',
    prompt: promptEnum.fix,
    promptType: promptTypeEnum.fix,
    icon: 'magic',
  },
  {
    type: 'prompt',
    title: 'Simplify language',
    prompt: promptEnum.simplify,
    promptType: promptTypeEnum.simplify,
    icon: 'magic',
  },
  {
    type: 'prompt',
    title: 'Make shorter',
    prompt: promptEnum.shorter,
    promptType: promptTypeEnum.shorter,
    icon: 'magic',
  },
  {
    type: 'prompt',
    title: 'Make longer',
    prompt: promptEnum.longer,
    promptType: promptTypeEnum.longer,
    icon: 'magic',
  },
]

export const utilitiesItems: Item[] = [
  {
    type: 'prompt',
    title: 'Continue writing',
    prompt: promptEnum.continue,
    promptType: promptTypeEnum.continue,
    icon: 'magic',
  },
  {
    type: 'prompt',
    title: 'Translate',
    prompt: promptEnum.translate,
    promptType: promptTypeEnum.translate,
    icon: 'magic',
    shouldAskUser: true,
  },
  {
    type: 'prompt',
    title: 'Summarise',
    prompt: promptEnum.summarize,
    promptType: promptTypeEnum.summarize,
    icon: 'magic',
  },
]

export const improveItems: Item[] = [
  {
    type: 'action',
    title: 'Replace selection',
    action: Action.Replace,
    icon: 'tick',
  },
  {
    type: 'action',
    title: 'Insert below',
    action: Action.Insert,
    icon: 'plus_circle',
  },
  {
    type: 'prompt',
    title: 'Continue writing',
    prompt: promptEnum.continue,
    promptType: promptTypeEnum.continue,
    icon: 'fountain_pen_tip',
  },
  {
    type: 'prompt',
    title: 'Make longer',
    prompt: promptEnum.longer,
    promptType: promptTypeEnum.longer,
    icon: 'format_align_left',
  },
]

export const improveItemsBottom: Item[] = [
  {
    type: 'action',
    title: 'Try again',
    action: Action.Retry,
    icon: 'refresh',
  },
  {
    type: 'action',
    title: 'Discard',
    action: Action.Discard,
    icon: 'delete',
  },
]
