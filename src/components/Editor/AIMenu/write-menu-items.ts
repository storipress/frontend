import { promptEnum, promptTypeEnum } from './setting'
import type { BlockItem } from './setting'

export enum Action {
  Done = 'done',
  Retry = 'retry',
  Close = 'close',
}

export interface PromptItem {
  type: 'prompt'
  icon: string
  title: string
  prompt: string
  promptType?: string
}

export interface ActionItem {
  type: 'action'
  icon: string
  title: string
  action: Action
  promptType?: string
}

export type Item = PromptItem | ActionItem

export const createMenu: BlockItem[] = [
  {
    title: 'Continue writing',
    type: 'continue-writing',
    promptType: promptTypeEnum.continueArticle,
    prompt: promptEnum.continueArticle,
  },
  {
    title: 'Brainstorm ideas',
    type: 'brainstorm',
    prompt: promptEnum.brainstorm,
    promptType: promptTypeEnum.brainstorm,
    shouldAskUser: true,
  },
  {
    title: 'Write article',
    type: 'blog-post',
    prompt: promptEnum.blog,
    promptType: promptTypeEnum.blog,
    shouldAskUser: true,
  },
  {
    title: 'Outline',
    type: 'outline',
    prompt: promptEnum.outline,
    promptType: promptTypeEnum.outline,
    shouldAskUser: true,
  },
  {
    title: 'Creative story',
    type: 'creative-story',
    prompt: promptEnum.creativeStory,
    promptType: promptTypeEnum.creativeStory,
    shouldAskUser: true,
  },
  {
    title: 'Pros and cons list',
    type: 'pros-and-cons-list',
    prompt: promptEnum.prosAndConsList,
    promptType: promptTypeEnum.prosAndConsList,
    shouldAskUser: true,
  },
]

export const items: Item[] = [
  {
    type: 'action',
    title: 'Done',
    action: Action.Done,
    icon: 'tick',
  },
  {
    type: 'prompt',
    title: 'Continue writing',
    prompt: promptEnum.continueArticle,
    icon: 'draft',
    promptType: promptTypeEnum.continueArticle,
  },
  {
    type: 'prompt',
    title: 'Make longer',
    prompt: promptEnum.longer,
    icon: 'format_align_left',
    promptType: promptTypeEnum.longer,
  },
]

export const actionItems: Item[] = [
  {
    type: 'action',
    title: 'Retry',
    action: Action.Retry,
    icon: 'refresh',
  },
  {
    type: 'action',
    title: 'Close',
    action: Action.Close,
    icon: 'cross_thin',
  },
]
