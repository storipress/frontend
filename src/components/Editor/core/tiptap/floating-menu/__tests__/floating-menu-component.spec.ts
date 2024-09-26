import { Editor } from '@tiptap/vue-3'
import FloatingMenu from '../floating-menu.vue'
import { render } from '~/test-helpers'
import { extensions } from '~/components/Editor/core/tiptap/plugins/code-block/use-codemirror/__tests__/helper'

it('trigger mark should exist', () => {
  const editor = new Editor({
    extensions,
    content: {
      type: 'doc',
    },
  })
  const { container } = render(FloatingMenu, {
    props: {
      editor,
    },
  })

  // eslint-disable-next-line testing-library/no-container
  expect(container.querySelector('[data-floating-menu-trigger]')).toBeTruthy()
})
