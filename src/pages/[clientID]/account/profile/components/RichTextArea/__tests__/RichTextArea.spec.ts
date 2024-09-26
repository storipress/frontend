import { expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import { noop } from 'lodash'
import RichTextArea from '../index.vue'
import { render } from '~/test-helpers'

const updateState = vi.fn()

vi.mock('@tiptap/vue-3', async () => {
  const { defineComponent } = await vi.importActual<typeof import('vue')>('vue')
  const tiptapModule = await vi.importActual<typeof import('@tiptap/vue-3')>('@tiptap/vue-3')

  return {
    ...tiptapModule,
    BubbleMenu: defineComponent(() => {
      const slots = useSlots()
      return () => {
        return h('div', slots.default?.())
      }
    }),
  }
})

vi.mock('~/components/Editor/rich-input', async () => {
  const richInputModule = await vi.importActual<typeof import('~/components/Editor/rich-input')>(
    '~/components/Editor/rich-input',
  )
  return {
    ...richInputModule,
    useNodeState: () => ({
      nodeState: reactive({
        bold: false,
        italic: false,
        underline: false,
        link: false,
      }),
      updateState,
    }),
  }
})

vi.mock('tippy.js', () => ({
  default: () => ({
    destroy: noop,
  }),
}))

it('updateNodeState is called after format click', async () => {
  const { getByLabelText } = render(RichTextArea)
  const toggleBold = getByLabelText('Toggle Bold')

  await fireEvent.click(toggleBold)

  expect(updateState).toHaveBeenCalled()
})
