/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { fireEvent, waitFor, within } from '@testing-library/vue'
import { expect, it } from 'vitest'
import { html } from 'proper-tags'
import UserSelectTypeahead from './UserSelectTypeahead.vue'
import { render } from '~/test-helpers'

it('options list can trigger', async () => {
  const { container, getByLabelText, getByText, queryByText } = render(UserSelectTypeahead, {
    props: {
      modelValue: [],
      placeholder: 'People',
    },
  })
  const input = getByLabelText(/People/)

  await input.focus()
  await waitFor(() => {
    expect(container.querySelector('.simple-typeahead-list')).toBeVisible()
  })

  const listItems = Array.from(container.querySelectorAll('.simple-typeahead-list-item'))
  expect(getByText('Storipress Helper')).toBeVisible()
  expect(listItems.map((item) => item.textContent)).toMatchSnapshot()

  await input.blur()
  expect(queryByText('Storipress Helper')).not.toBeInTheDocument()
})

/*
 * In core-component/SelectTypeahead components, `selected` is in the same `<ul />` as the `option list`.
 * So when the option list is enabled, at least one set of options will be rendered.
 */
it('item selected', async () => {
  const { container, getByLabelText, getByText, queryAllByText, getByRole, queryByText } = render({
    components: { UserSelectTypeahead },
    setup: () => ({ UserTypeList: ref([]) }),
    template: html`<user-select-typeahead class="grow" placeholder="People" v-model="UserTypeList" />`,
  })

  const input = getByLabelText(/People/)
  await input.focus()
  await waitFor(() => {
    expect(container.querySelector('.simple-typeahead-list')).toBeVisible()
  })

  expect(getByText('Storipress Helper')).toBeVisible()

  const optionsContainer: HTMLElement =
    container.querySelector('.simple-typeahead-list') || document.createElement('div')

  const option = within(optionsContainer).getByText(/storipress helper/i)
  await fireEvent.click(option)
  await input.blur()

  expect(queryAllByText('Storipress Helper')).toHaveLength(1)

  const crossButton = getByRole('button', { name: 'remove' })
  await fireEvent.click(crossButton)

  expect(queryByText('Storipress Helper')).not.toBeInTheDocument()
})

it('data filter', async () => {
  const { container, getByLabelText, queryByText } = render(UserSelectTypeahead, {
    props: {
      modelValue: [],
      placeholder: 'People',
      filterOption: ({ full_name }: { full_name: string }) => {
        if (/Storipress Helper/i.test(full_name)) return false
        return true
      },
    },
  })
  const input = getByLabelText(/People/)

  await input.focus()
  await waitFor(() => {
    expect(container.querySelector('.simple-typeahead-list')).toBeVisible()
  })

  expect(queryByText('Storipress Helper')).not.toBeInTheDocument()
})
