import type { Editor, Range } from '@tiptap/core'
import { identity } from 'lodash'
import invariant from 'tiny-invariant'
import * as Sentry from '@sentry/vue'
import { RingBuffer } from 'ring-buffer-ts'
import { useAIMenuStore } from './store'
import { promptEnum, promptTypeEnum } from './setting'
import { useEditorNotificationStore } from '~/stores/editor-notification'
import { useAuthStore } from '~/stores/auth'
import { postAI } from '~/components/Editor/utils'
interface AskAIInput {
  editor: Editor
  prompt: string
  promptType: string | undefined
  range: Range
  clearRange?: boolean
  isRangedContent?: boolean
  requestSource?: string
}

interface modifyAIInput {
  prompt: string
  promptType: string | undefined
  content: string
  requestSource?: string
}

interface IAIResponse {
  ok: boolean
  type: string
  data: string
  code: number
}

const decoder = new TextDecoder()
const continuePrompts = [promptTypeEnum.continueArticle, promptTypeEnum.continue, promptTypeEnum.longer]

export function removeDefaultPrompt(userPrompt: string, promptType: keyof typeof promptEnum) {
  if (promptEnum[promptType] && userPrompt.search(promptEnum[promptType]) === 0) {
    return userPrompt.slice(promptEnum[promptType].length)
  }
  return userPrompt
}

export async function askAI({
  editor,
  prompt,
  promptType,
  range,
  clearRange = true,
  requestSource = 'create',
}: AskAIInput) {
  sendTrackUnchecked('ai_requested', {
    type: requestSource,
  })

  const { clientID } = useAuthStore()
  const AIstore = useAIMenuStore()
  const { isRangedContent } = AIstore
  const { signal } = AIstore.abortAI
  const getContent = () => {
    if (continuePrompts.includes(promptType as promptTypeEnum)) {
      // TODO: only use last 2 paragraph for continue writing
      return (isRangedContent ? editor.getText().slice(range.from) : editor.getText()) || ''
    }
    return ''
  }

  let chatId = ''

  if (requestSource !== 'next-step') {
    AIstore.editFrom = range.from
  } else {
    if (continuePrompts.includes(promptType as promptTypeEnum)) {
      chatId = AIstore.chatId
    }
  }

  const postBody = {
    type: promptType,
    content: chatId
      ? undefined
      : `${removeDefaultPrompt(prompt, promptType as keyof typeof promptEnum)} ${getContent()}`,
    chat_uuid: chatId || undefined,
    client_id: clientID,
  }

  const postAsk = await postAI(postBody, signal)

  const parseResponse = postAsk.body
  const reader = parseResponse?.getReader()
  if (!reader) return
  AIstore.chatId = postAsk.headers.get('sp-assistant-uuid') || ''

  // ! editor operation must be sync, or it will cause mismatched transaction error
  // see: https://storipress-media.atlassian.net/browse/SPMVP-3949
  const commands = editor.chain()

  if (clearRange) {
    commands.deleteRange({ from: range.from, to: range.to })
  }

  if (parseResponse) {
    commands
      .startWriting({
        prompt,
        response: streamAsyncIterator(reader, postAsk.status, (data) => data),
      })
      .run()
  }
}

export async function storeAIResponse({ prompt, promptType, content, requestSource = 'modify' }: modifyAIInput) {
  sendTrackUnchecked('ai_requested', {
    type: requestSource,
  })
  const { clientID } = useAuthStore()
  const AIstore = useAIMenuStore()
  const { signal } = AIstore.abortAI
  const nowContent = computed(() => {
    if (continuePrompts.includes(promptType as promptTypeEnum)) return AIstore.response || content
    return content
  })

  let chatId = ''

  if (continuePrompts.includes(promptType as promptTypeEnum)) {
    chatId = AIstore.selectChatId
  }

  const postBody = {
    type: promptType,
    content: chatId
      ? undefined
      : `${removeDefaultPrompt(prompt, promptType as keyof typeof promptEnum)} ${nowContent.value}`,

    chat_uuid: chatId || undefined,
    client_id: clientID,
  }

  const postAsk = await postAI(postBody, signal)
  const parseResponse = postAsk.body
  const reader = parseResponse?.getReader()
  if (!reader) return
  invariant(parseResponse, 'Response is null')
  AIstore.selectChatId = postAsk.headers.get('sp-assistant-uuid') ?? ''

  const response = streamAsyncIterator(reader, postAsk.status, (data) => data)
  let next = await response.next()
  AIstore.responseEnd = false

  if (continuePrompts.includes(promptType as promptTypeEnum)) {
    AIstore.response += ' '
  } else {
    AIstore.response = ''
  }

  try {
    while (true) {
      if (next.done) {
        AIstore.responseEnd = true
        break
      }
      AIstore.response += next.value
      next = await response.next()
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      AIstore.selectChatId = ''
    } else {
      Sentry.captureException(error)
    }
  }
}

export async function* streamAsyncIterator<T, U = T>(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  status: number,
  convert: (input: string) => U = identity,
): AsyncIterableIterator<U> {
  // Get a lock on the stream
  let partialLine = ''
  const editorNotification = useEditorNotificationStore()

  const decodedTextRingBuffer = new RingBuffer<string>(5)
  const newLinesRingBuffer = new RingBuffer<string>(5)
  try {
    while (true) {
      const { done, value } = await reader.read()
      // Exit if we're done
      if (done) {
        try {
          for (const item of parseMultipleLineJson(partialLine)) {
            if (item.type === 'error') {
              editorNotification.SET_ERROR_CODE(item.code)
              editorNotification.SET_ERROR_CONTENT(item.data)
            } else {
              yield convert(item.data)
            }
          }
        } catch {
          const AIstore = useAIMenuStore()
          Sentry.captureException(new Error('Error parsing chatGPT response as JSON'), (scope) => {
            scope.setContext('response', {
              partialLine,
              text: partialLine,
              chat_uuid: AIstore.chatId,
              decodedText: decodedTextRingBuffer.toArray(),
              newLines: newLinesRingBuffer.toArray(),
            })
            return scope
          })
        }
        return
      }

      const decodedText = decoder.decode(value, { stream: true })
      decodedTextRingBuffer.add(decodedText)

      if (status !== 200) {
        const json = JSON.parse(decodedText)
        const content = json.error.message ?? decodedText
        throw new Error(content)
      }

      const chunk = partialLine + decodedText
      const _newLines = chunk.split(/\r?\n/).reduce((acc, item) => {
        const lastItem = acc.at(-1) ?? ''
        if (!isJson(item) && !isJson(lastItem)) {
          const _lastItem = acc.pop() ?? ''
          return [...acc, _lastItem + item]
        }
        return [...acc, `${item}\n`]
      }, [] as string[])

      partialLine = _newLines.pop() ?? ''
      partialLine = partialLine && `${partialLine}\n`
      const newLines = _newLines.filter(isJson)

      newLinesRingBuffer.add(...newLines)

      for (const line of newLines) {
        const content = JSON.parse(line).data // start with "data: "
        yield convert(content)
      }
    }
  } finally {
    reader.releaseLock()
    await nextTick()
    editorNotification.SET_ERROR_CODE(0)
  }
}

export function* parseMultipleLineJson(input: string) {
  const splitResult = input.split(/\r?\n/).filter((item) => item)
  for (const line of splitResult) {
    const json: IAIResponse = JSON.parse(line)
    yield json
  }
}

function isJson(data: string) {
  try {
    return Boolean(JSON.parse(data))
  } catch {
    return false
  }
}
