import { Extension } from '@tiptap/core'

// shortcuts list: https://tiptap.dev/api/keyboard-shortcuts
export const CustomShortcuts = Extension.create({
  addKeyboardShortcuts() {
    // Mod is `Cmd` on macOS and `Ctrl` on other platforms.
    // ref: https://prosemirror.net/docs/ref/#keymap
    return {
      'Mod-Alt-1': () => this.editor.commands.toggleHeading({ level: 2 }),
      'Mod-Alt-2': () => this.editor.commands.toggleHeading({ level: 3 }),
      'Mod-Alt-3': () => this.editor.commands.toggleBulletList(),
      'Mod-Alt-4': () => this.editor.commands.toggleOrderedList(),
    }
  },
})
