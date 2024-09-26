import markdown from 'markdown-it'
import type { Editor } from '@tiptap/core'
import * as Sentry from '@sentry/vue'
import type { UpdateWritingMeta } from './writing-menu-plugin'
import { WriteMenuPluginKey } from './setting'

export function customInsertContent(start: number, editor: Editor, line: string) {
  editor
    .chain()
    .insertContentAt(start, line)
    .command(({ tr, dispatch }) => {
      const next = tr.setMeta(WriteMenuPluginKey, {
        type: 'update',
        added: line.length,
      } as UpdateWritingMeta)
      if (dispatch) dispatch(next)
      return true
    })
    .run()
}

export function transMarkdownContentToHtml(content: string) {
  const md = markdown()
  const markdownString = md.render(content)
  const filtNewLine = markdownString.replace(/\r\n|\r|\n/g, '')
  let filtEmptyTag = filtNewLine.replace(/<(\w+)><\/\1>/g, '')
  let preLength = filtNewLine.length

  // if have empty tag, replace it
  while (filtEmptyTag.length < preLength) {
    preLength = filtEmptyTag.length
    filtEmptyTag = filtEmptyTag.replace(/<(\w+)><\/\1>/g, '')
  }

  return filtEmptyTag
}

export function focusOrSubmit(
  focusCurrent: () => void,
  onKeyDown: ({ event }: { event: globalThis.KeyboardEvent }) => boolean,
  userPrompt: Ref<string>,
) {
  onKeyStroke(['ArrowUp', 'ArrowDown', 'Backspace', 'Enter'], (e) => {
    if (e.code === 'Backspace' && userPrompt.value === '') {
      focusCurrent()
    } else {
      onKeyDown({ event: e })
    }
  })
}

export function checkScrollY() {
  if (window.scrollY === 0) {
    Sentry.captureException(new Error('ScrollY is 0 after focusing input'))
  }
}
