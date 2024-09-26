import type { Editor } from '@tiptap/core'

import { nextTick } from '~/components/Editor/core'
import type { API as FullAPI, Pos, RemoveCommentParam } from '~/components/Editor/core/api'
import { getAPI } from '~/components/Editor/core/api'
import { formatDisplayTime, getRelativeTop } from '~/utils/editor'
import { useComment } from '~/stores/comment'

export interface CommentPosition extends Pos {
  id: string
  draft: boolean
}

type API = Pick<
  FullAPI,
  'createComment' | 'removeComment' | 'resolveComment' | 'createPendingComment' | 'removePendingComment'
>

function createAPI(): API {
  const api = getAPI()

  const { createComment, removeComment, resolveComment, createPendingComment, removePendingComment } = api
  return { createComment, removeComment, resolveComment, createPendingComment, removePendingComment }
}

export class CommentTracker {
  private _editor: Editor

  private _api: API = createAPI()

  constructor(editor: Editor) {
    this._editor = editor
  }

  resolveComment(id: string) {
    this._api.resolveComment(id)
  }

  removeComment(param: RemoveCommentParam) {
    this._api.removeComment(param)
  }

  resolveCommentAt({ id }: CommentPosition) {
    if (id.startsWith('temp-')) {
      this._api.removePendingComment()
    } else {
      this.resolveComment(id)
    }
    this._editor.commands.deleteAnnotation(id)
  }

  async createComment({ id, from, to }: { id: string; from: number; to: number }) {
    await nextTick()
    const { view, commands } = this._editor
    const commentStore = useComment()
    const date = new Date()
    const position = { id, from, to }

    if (commentStore.pendingThread) {
      this._editor.commands.deleteAnnotation(commentStore.pendingThread.id)
      this._api.removePendingComment()
    }

    commands.addAnnotation(id, { draft: true })
    const displayTime = formatDisplayTime(date)
    this._api.createPendingComment({
      id,
      top: getRelativeTop(view, from, from, view.dom.getBoundingClientRect()),
      position,
      displayTime,
    })
  }
}
