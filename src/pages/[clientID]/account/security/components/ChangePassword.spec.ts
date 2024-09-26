import { expect, it } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/vue'
import ChangePassword from './ChangePassword.vue'
import { render } from '~/test-helpers'

describe('change user password', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('open change password modal', async () => {
    const { getByRole } = render(ChangePassword)

    const ChangePasswordButton = getByRole('button', {
      name: /change password/i,
    })

    await fireEvent.click(ChangePasswordButton)
    expect(getByRole('dialog')).toBeVisible()
  })

  it('close change password modal', async () => {
    const { getByRole, getByLabelText, queryByRole } = render(ChangePassword)

    const ChangePasswordButton = getByRole('button', {
      name: /change password/i,
    })

    await fireEvent.click(ChangePasswordButton)

    const currentPasswordInput = getByLabelText(/current password/i)
    const newPasswordInput = getByLabelText('New password')
    const confirmPasswordInput = getByLabelText(/confirm new password/i)

    expect(getByRole('dialog')).toBeVisible()
    expect(currentPasswordInput).not.toHaveValue()
    expect(newPasswordInput).not.toHaveValue()
    expect(confirmPasswordInput).not.toHaveValue()

    await fireEvent.update(currentPasswordInput, '12345678')
    await fireEvent.update(newPasswordInput, '123456789')
    await fireEvent.update(confirmPasswordInput, '123456789')

    const closeModalButton = getByRole('button', { name: 'close' })

    await fireEvent.click(closeModalButton)
    await waitFor(() => {
      expect(queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(currentPasswordInput).not.toBeInTheDocument()

    await fireEvent.click(ChangePasswordButton)

    expect(currentPasswordInput).not.toHaveValue('12345678')
    expect(newPasswordInput).not.toHaveValue('123456789')
    expect(confirmPasswordInput).not.toHaveValue('123456789')
  })

  it('invalid fill up', async () => {
    // use stubs to fix validation is not working in dialog
    const { queryByText, findByText, getByLabelText } = render(ChangePassword, {
      global: {
        stubs: {
          Modals: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    const currentPasswordInput = getByLabelText(/current password/i)
    const newPasswordInput = getByLabelText('New password')
    const confirmPasswordInput = getByLabelText(/confirm new password/i)

    await fireEvent.update(currentPasswordInput, '1')
    await fireEvent.update(newPasswordInput, '1')
    await fireEvent.update(confirmPasswordInput, '12')

    expect(await findByText('Passwords do not match')).toBeVisible()
    expect(queryByText('Current password must be at least 8 characters')).toBeVisible()
    expect(queryByText('New password must be at least 8 characters')).toBeVisible()
  })

  it('invalid submit', async () => {
    const { getByRole, findByRole, findByText } = render(ChangePassword)

    const openModalButton = getByRole('button', {
      name: /change password/i,
    })

    await fireEvent.click(openModalButton)

    const submitButton = await findByRole('button', {
      name: 'submit',
    })

    await fireEvent.click(submitButton)

    expect(await findByText('Current password is a required field')).toBeVisible()
    expect(await findByText('New password is a required field')).toBeVisible()
    expect(await findByText('Confirm new password is a required field')).toBeVisible()
  })
})
