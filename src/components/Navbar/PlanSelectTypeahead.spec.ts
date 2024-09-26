/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { fireEvent, waitFor, within } from '@testing-library/vue'
import { expect, it } from 'vitest'
import { html } from 'proper-tags'
import invariant from 'tiny-invariant'
import PlanSelectTypeahead from './PlanSelectTypeahead.vue'
import type { PlanItem } from './definition'
import { render } from '~/test-helpers'

it('options list can trigger', async () => {
  const { container, getByLabelText, getByText, queryByText } = render(PlanSelectTypeahead, {
    props: {
      modelValue: [],
      placeholder: 'Plans',
    },
  })
  const input = getByLabelText(/Plans/)

  await input.focus()
  await waitFor(() => {
    expect(container.querySelector('.simple-typeahead-list')).toBeVisible()
  })

  expect(getByText('Free access')).toBeVisible()
  expect(getByText('Members only')).toBeVisible()
  expect(getByText('Subscribers only')).toBeVisible()

  await input.blur()
  expect(queryByText('Free access')).not.toBeInTheDocument()
  expect(queryByText('Members only')).not.toBeInTheDocument()
  expect(queryByText('Subscribers only')).not.toBeInTheDocument()
})

/*
 * In core-component/SelectTypeahead components, `selected` is in the same `<ul />` as the `option list`.
 * So when the option list is enabled, at least one set of options will be rendered.
 */
it('item selected', async () => {
  const plansList = ref<PlanItem[]>([])
  const { container, getByLabelText, getByText, queryAllByText, getByRole, queryByText } = render({
    components: { PlanSelectTypeahead },
    setup: () => ({ plansList }),
    template: html`<plan-select-typeahead class="grow" placeholder="Plans" v-model="plansList" />`,
  })

  const input = getByLabelText(/Plans/)
  await input.focus()
  await waitFor(() => {
    expect(container.querySelector('.simple-typeahead-list')).toBeVisible()
  })

  expect(getByText('Free access')).toBeVisible()

  const optionsContainer: HTMLElement | null = container.querySelector('.simple-typeahead-list')

  expect(optionsContainer).toBeVisible()
  invariant(optionsContainer, 'no option container')

  const option = within(optionsContainer).getByText(/Free access/i)
  await fireEvent.click(option)
  await input.blur()

  expect(queryAllByText('Free access')).toHaveLength(1)
  expect(plansList.value).toHaveLength(1)
  expect(plansList.value[0].key).toBe('free')

  const crossButton = getByRole('button', { name: 'remove' })
  await fireEvent.click(crossButton)

  expect(queryByText('Free access')).not.toBeInTheDocument()
  expect(plansList.value).toHaveLength(0)
})
