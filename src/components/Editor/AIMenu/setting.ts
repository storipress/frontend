import { PluginKey } from '@tiptap/pm/state'

export const WriteMenuPluginKey = new PluginKey('writeMenuPlugin')

export interface BlockItem {
  title: string
  // TODO: add backend type
  type: string
  prompt: promptEnum
  promptType: string
  shouldAskUser?: boolean
}

export interface GroupItem {
  title: string
  blocks: BlockItem[]
}

export const clickableTag = ['INPUT', 'SPAN', 'BUTTON', 'TEXTAREA']

/* eslint-disable ts/no-duplicate-enum-values */
export enum promptEnum {
  // AI: Create
  continueArticle = 'Continue writing this article: ',
  'continue-article' = 'Continue writing this article: ',
  brainstorm = 'Brainstorm ideas on',
  blog = 'Write an article on',
  outline = 'Write an bullet point outline about',
  creativeStory = 'Write a creative story about',
  'creative-story' = 'Write a creative story about',
  prosAndConsList = 'Write a pros and cons list about',
  'pros-and-cons-list' = 'Write a pros and cons list about',
  // Ask AI: Edit
  improve = 'Rephrase the following sentence to be more concise and engrossing: ',
  fix = 'Proofread the below for spelling and grammar, without changing the wording at all:',
  simplify = 'Make the phrasing of this more simple in the same language: ',
  shorter = 'Make this more concise in the same language: ',
  longer = 'Rewrite this to include more context and detail in the same language: ',
  // Ask AI: Utilities
  continue = 'Continue writing this paragraph: ',
  translate = 'Translate this to ',
  summarize = 'Create a dot point summary for this text: ',
}
/* eslint-enable ts/no-duplicate-enum-values */

export enum promptTypeEnum {
  continueArticle = 'continue-article',
  brainstorm = 'brainstorm',
  blog = 'blog',
  outline = 'outline',
  creativeStory = 'creative-story',
  prosAndConsList = 'pros-and-cons-list',
  improve = 'improve',
  fix = 'fix',
  simplify = 'simplify',
  shorter = 'shorter',
  longer = 'longer',
  continue = 'continue',
  translate = 'translate',
  summarize = 'summarize',
}

export const menuPlaceholder = 'Ask Storipress AI to edit or generate...'
