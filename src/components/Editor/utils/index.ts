import ky from 'ky'
import type { Editor } from '@tiptap/core'
import { env } from '~/env'
import { useAuthStore } from '~/stores/auth'

interface IEditItem {
  id: string
  start: number
  sentence_start: number
  end: number
  replacement: string
  sentence: string
}

interface ISpellCheckResult {
  edits: IEditItem[]
}

export const notPermittedType = ['embed', 'codeBlock']
export function hideSlashAndAIMenu(editor: Editor) {
  return notPermittedType.includes(editor.state.selection.$head.parent.type.name)
}

const AI_ENDPOINT = env.VITE_GPT

export function postAI<T>(content: T, signal?: AbortSignal) {
  const { token } = useAuthStore()
  return ky.post(AI_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    json: content,
    signal,
    timeout: false,
  })
}

export async function postSpellCheck(_text: string, _signal?: AbortSignal): Promise<ISpellCheckResult> {
  // Always return empty result as we don't wan't spellcheck anymore
  return { edits: [] }
}
