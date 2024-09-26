import { expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import type { InputItems } from '../update-table-of-content'
import { useUpdateTableOfContent } from '../update-table-of-content'

it('will initialized with exists value', async () => {
  const items = ref<InputItems>([
    {
      id: '1',
      level: 1,
      textContent: 'foo',
    },
  ])
  const updateItems = vi.fn()

  useUpdateTableOfContent({ items, updateItems })

  items.value = [
    {
      id: '1',
      level: 1,
      textContent: 'foo',
    },
  ]

  await flushPromises()

  expect(updateItems).not.toBeCalled()

  items.value = [
    {
      id: '1',
      level: 1,
      textContent: 'bar',
    },
  ]

  await flushPromises()

  expect(updateItems).toBeCalledWith([
    {
      id: '1',
      level: 1,
      textContent: 'bar',
    },
  ])
})

it('will updated if level changed', async () => {
  const items = ref<InputItems>([
    {
      id: '1',
      level: 1,
      textContent: 'foo',
    },
  ])
  const updateItems = vi.fn()

  useUpdateTableOfContent({ items, updateItems })

  items.value = [
    {
      id: '1',
      level: 2,
      textContent: 'foo',
    },
  ]

  await flushPromises()

  expect(updateItems).toBeCalledWith([
    {
      id: '1',
      level: 2,
      textContent: 'foo',
    },
  ])
})
