/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { expect, it } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { SelectWithLabelTypeahead, SelectWithoutLabelTypeahead } from './index.stories'
import { AutoComplete } from './index'

it('expand the autoComplete list and select item', async () => {
  const { container, getAllByRole, getByText, emitted } = render(AutoComplete, {
    props: SelectWithLabelTypeahead.args,
  })
  const itemLength = SelectWithLabelTypeahead.args.items.length
  const expectSelectedValue = SelectWithLabelTypeahead.args.items[3]

  const input = getAllByRole('textbox')[1]
  await input.focus()

  expect(container.querySelectorAll('.simple-typeahead-list-item')).toHaveLength(itemLength)

  await input.blur()

  expect(container.querySelector('.simple-typeahead-list-item')).not.toBeInTheDocument()

  await input.focus()
  const expectItem = getByText(expectSelectedValue)
  await fireEvent.click(expectItem)

  expect(emitted()['update:modelValue']).toEqual([[expectSelectedValue]])
  expect(container.querySelector('.simple-typeahead-list-item')).not.toBeInTheDocument()

  await input.blur()
  await input.focus()
  expect(container.querySelector('.icon-check')).toBeVisible()
})

it('enter a partial string to filter items', async () => {
  const { container, getByDisplayValue, getAllByRole, getByText, emitted, rerender } = render(AutoComplete, {
    props: SelectWithoutLabelTypeahead.args,
  })
  const itemLength = SelectWithoutLabelTypeahead.args.items.length
  const expectSelectedValue = SelectWithoutLabelTypeahead.args.items[3]
  const itemsKey = SelectWithoutLabelTypeahead.args.optionLabelProp
  const inputString = SelectWithoutLabelTypeahead.args.items[3][itemsKey].substring(0, 2)

  const input = getAllByRole('textbox')[1]
  await input.focus()

  expect(container.querySelectorAll('.simple-typeahead-list-item')).toHaveLength(itemLength)

  await fireEvent.update(input, inputString)
  const expectItem = getByText(new RegExp(inputString, 'i'))
  await fireEvent.click(expectItem)

  expect(emitted()['update:modelValue']).toEqual([[expectSelectedValue]])
  expect(container.querySelector('.simple-typeahead-list-item')).not.toBeInTheDocument()
  rerender({ modelValue: SelectWithoutLabelTypeahead.args.items[3] })
  expect(getByDisplayValue(expectSelectedValue[itemsKey])).toBeVisible()
})
