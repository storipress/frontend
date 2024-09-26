import { Extension } from '@tiptap/core'
import { noop } from 'lodash'

interface User {
  clientId: number
  [key: string]: any
}

interface ReadUserOptions {
  onUpdate: (users: User[]) => void
}

export const ReadUser = Extension.create<ReadUserOptions>({
  addOptions() {
    return {
      onUpdate: noop,
    }
  },
  onTransaction() {
    this.options.onUpdate(this.editor.storage.collaborationCursor.users)
  },
})
