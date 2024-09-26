/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { expect, it } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import UserInvite from './UserInvite.vue'
import { render } from '~/test-helpers'

// FIXME: this test can't swap the order with the following test
it('invalid submit', async () => {
  const { getByRole, queryByText, getByPlaceholderText } = render(UserInvite)

  const submitButton = getByRole('button', {
    name: /invite user/i,
  })
  const emailInput = getByPlaceholderText('hello@storipress.com')

  expect(submitButton).toHaveAttribute('type', 'submit')
  expect(emailInput).not.toHaveValue()
  await fireEvent.click(submitButton)
  await waitFor(() => {
    expect(queryByText('email is a required field')).toBeVisible()
  })
})

it('render user invite form', async () => {
  const { getByRole, getAllByLabelText, getByPlaceholderText, getByText, container } = render(UserInvite)

  expect(getByText(/earn \$20 credit/i)).toBeVisible()
  expect(getByPlaceholderText('hello@storipress.com')).toBeVisible()
  expect(container.querySelector('.typeahead-label')).toBeVisible()
  expect(getByRole('button', { name: /invite user/i })).toBeVisible()
  expect(container.querySelector('.tooltip')).toHaveClass('invisible')
  await userEvent.hover(getAllByLabelText(/show-tooltip/i)[0])
  expect(container.querySelector('.tooltip')).toHaveClass('visible')
})

it('invalid Fill', async () => {
  const { getByPlaceholderText, queryByText } = render(UserInvite)

  const emailInput = getByPlaceholderText('hello@storipress.com')
  expect(queryByText('email must be a valid email')).not.toBeInTheDocument()
  expect(queryByText('email is a required field')).not.toBeInTheDocument()
  await fireEvent.update(emailInput, 'foo')
  await waitFor(() => {
    expect(queryByText('email must be a valid email')).toBeVisible()
  })
  await fireEvent.update(emailInput, '')
  await waitFor(() => {
    expect(queryByText('email is a required field')).toBeVisible()
  })
})
