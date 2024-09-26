import type { RichActionFormat } from '~/components/Editor/core/tiptap/menu/definitions'

export const formats: RichActionFormat[] = [
  {
    type: 'action',
    name: 'Bold',
    class: 'px-2 text-sm',
    key: 'bold',
    action: 'toggleBold',
    icon: 'format_bold',
  },
  {
    type: 'action',
    name: 'Italic',
    class: 'px-2 text-sm',
    key: 'italic',
    action: 'toggleItalic',
    icon: 'format_italics',
  },
  {
    type: 'action',
    name: 'Underline',
    class: 'px-2 text-sm',
    key: 'underline',
    action: 'toggleUnderline',
    icon: 'format_underline',
  },
]
