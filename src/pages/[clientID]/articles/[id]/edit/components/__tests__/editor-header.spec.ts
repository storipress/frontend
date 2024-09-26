import { noop } from 'lodash-es'
import { expect, it, vi } from 'vitest'
import EditorHeader from '../editor-header.vue'
import { render } from '~/test-helpers'

vi.mock('../utils/watch', () => ({
  useWatch: () => ({
    watchAll: noop,
    initLoading: ref(true),
    previewData: ref(undefined),
  }),
}))

vi.mock('~/components/Editor/rich-input', async () => {
  const { h, defineComponent } = await vi.importActual<typeof import('vue')>('vue')

  return {
    RichInput: defineComponent(() => () => h('input')),
  }
})

it('title and blurb should have different font size', async () => {
  const { getByPlaceholderText } = await render(EditorHeader, {
    props: {
      hasProseInit: { title: true, blurb: true },
      formModel: { title: '', blurb: '' },
      changeArticle: noop,
    },
    css: true,
  })

  const title = getByPlaceholderText('Enter your headline')
  const blurb = getByPlaceholderText('Enter your article subheading')

  const titleFontSize = window.getComputedStyle(title).fontSize
  const blurbFontSize = window.getComputedStyle(blurb).fontSize

  expect(title).toHaveStyle({ fontSize: '2.25rem' })
  expect(blurb).toHaveStyle({ fontSize: '1.25rem' })
  expect(titleFontSize).not.toBe(blurbFontSize)
})
