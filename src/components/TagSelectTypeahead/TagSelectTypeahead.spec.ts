/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { fireEvent, waitFor, within } from '@testing-library/vue'
import { expect, it } from 'vitest'
import { html } from 'proper-tags'
import TagSelectTypeahead from './TagSelectTypeahead.vue'
import { render } from '~/test-helpers'

it('options list can trigger', async () => {
  const { container, getByLabelText, getByText, queryByText } = render(TagSelectTypeahead, {
    props: {
      modelValue: [],
      placeholder: 'Tags',
    },
  })
  const input = getByLabelText(/Tags/)

  await input.focus()
  await waitFor(() => {
    expect(container.querySelector('.simple-typeahead-list')).toBeVisible()
  })

  const listItems = Array.from(container.querySelectorAll('.simple-typeahead-list-item'))
  expect(getByText('World')).toBeVisible()
  expect(listItems.map((item) => item.textContent)).toMatchSnapshot()

  await input.blur()
  expect(queryByText('World')).not.toBeInTheDocument()
})

/*
 * In core-component/SelectTypeahead components, `selected` is in the same `<ul />` as the `option list`.
 * So when the option list is enabled, at least one set of options will be rendered.
 */
it('item selected', async () => {
  const { container, getByLabelText, getByText, queryAllByText, getByRole, queryByText } = render({
    components: { TagSelectTypeahead },
    setup: () => ({ tagsList: ref([]) }),
    template: html`<tag-select-typeahead class="grow" placeholder="Tags" v-model="tagsList" />`,
  })

  const input = getByLabelText(/Tags/)
  await input.focus()
  await waitFor(() => {
    expect(container.querySelector('.simple-typeahead-list')).toBeVisible()
  })

  expect(getByText('World')).toBeVisible()

  const optionsContainer: HTMLElement =
    container.querySelector('.simple-typeahead-list') || document.createElement('div')

  const option = within(optionsContainer).getByText(/World/i)
  await fireEvent.click(option)
  await input.blur()

  expect(queryAllByText('World')).toHaveLength(1)

  const crossButton = getByRole('button', { name: 'remove' })
  await fireEvent.click(crossButton)

  expect(queryByText('World')).not.toBeInTheDocument()
})

it('data filter', async () => {
  const { container, getByLabelText, queryByText } = render(TagSelectTypeahead, {
    props: {
      modelValue: [],
      placeholder: 'Tags',
      filterOption: ({ name }: { name: string }) => {
        if (/World/i.test(name)) return false
        return true
      },
    },
  })
  const input = getByLabelText(/Tags/)

  await input.focus()
  await waitFor(() => {
    expect(container.querySelector('.simple-typeahead-list')).toBeVisible()
  })

  expect(queryByText('World')).not.toBeInTheDocument()
})
