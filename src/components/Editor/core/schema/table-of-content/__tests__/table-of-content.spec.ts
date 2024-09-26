import { fireEvent, render } from '@testing-library/vue'
import { expect, it, vi } from 'vitest'

import TableOfContent from '../view.vue'

let mockTocItems = []
const headings = [
  { id: '1', textContent: 'first', level: '1' },
  { id: '2', textContent: 'second', level: '2' },
]

vi.mock('~/stores/editor', () => ({
  useEditorStore: () => {
    return {
      tocItems: mockTocItems,
    }
  },
}))

const deleteNode = vi.fn()

it('table content show hint when no headings', () => {
  mockTocItems = []
  const { getByText } = render(TableOfContent)

  const hint = getByText('Add headings to create a table of contents.')
  expect(hint).toBeInTheDocument()
})

it('table content show headings', () => {
  mockTocItems = headings

  const { getByText } = render(TableOfContent)
  const first = getByText('first')
  const second = getByText('second')

  expect(first).toBeInTheDocument()
  expect(second).toBeInTheDocument()
})

it('can delete table content', async () => {
  mockTocItems = headings
  const { getByText, getByRole } = render(TableOfContent, {
    props: {
      deleteNode,
    },
  })

  const first = getByText('first')
  await fireEvent.mouseOver(first)
  const menu = getByRole('button')
  await fireEvent.click(menu)
  const selectDelete = getByText('Delete')
  await fireEvent.click(selectDelete)
  expect(deleteNode).toBeCalledTimes(1)
})
