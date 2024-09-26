import { expect, it } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import SelectTypeahead from './SelectTypeahead.vue'

const props = {
  defaultValue: [{ id: 1, name: 'Item 1' }],
  modelValue: [{ id: 1, name: 'Item 1' }],
  items: [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ],
  label: 'input',
}

it('render default value', () => {
  const { getAllByRole } = render(SelectTypeahead, {
    props: {
      ...props,
      optionLabelProp: 'name',
    },
  })

  expect(getAllByRole('listitem').map((item) => item.textContent)).toEqual([
    'Item 1',
    // input field
    '',
  ])
})

it('trim spaces in input and reject empty value', async () => {
  const { getAllByRole, getByRole } = render(SelectTypeahead, {
    props: {
      ...props,
      type: 'inputTag',
      optionLabelProp: 'name',
    },
  })

  const input = getByRole('textbox')
  await fireEvent.update(input, '  ')
  await fireEvent.keyUp(input, { key: 'Enter' })

  // reject to add as new tag
  expect(input).toHaveValue('')
  // nothing change as the empty value got rejected
  expect(getAllByRole('listitem').map((item) => item.textContent)).toEqual([
    'Item 1',
    // input field
    '',
  ])
})

it('can add new tag', async () => {
  const { getByRole, getAllByRole } = render(SelectTypeahead, {
    props: {
      ...props,
      type: 'inputTag',
      optionLabelProp: 'name',
    },
  })

  const input = getByRole('textbox')

  await fireEvent.update(input, 'new tag')
  await fireEvent.keyUp(input, { key: 'Enter' })

  expect(input).toHaveValue('')
  expect(getAllByRole('listitem').map((item) => item.textContent)).toEqual([
    'Item 1',
    'new tag',
    // input field
    '',
  ])
})

it.each([
  ['basic, example', ['basic', 'example']] as const,
  ['new tag 1,new tag 2,new tag 3, ', ['new tag 1', 'new tag 2', 'new tag 3'] as const],
])('split tags for paste event for `%s`', async (text, tags) => {
  const { getByRole, getAllByRole } = render(SelectTypeahead, {
    props: {
      ...props,
      type: 'inputTag',
      optionLabelProp: 'name',
    },
  })

  const input = getByRole('textbox')

  await fireEvent.paste(input, {
    clipboardData: { getData: () => text },
  })

  expect(input).toHaveValue('')
  expect(getAllByRole('listitem').map((item) => item.textContent)).toEqual([
    'Item 1',
    ...tags,
    // input field
    '',
  ])
})
