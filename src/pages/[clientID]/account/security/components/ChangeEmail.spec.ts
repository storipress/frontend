import { expect, it } from 'vitest'
import { fireEvent, waitFor, within } from '@testing-library/vue'
import ChangeEmail from './ChangeEmail.vue'
import { render } from '~/test-helpers'

describe('change user email', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('render user email info', async () => {
    const { getByText } = render(ChangeEmail)

    await waitFor(() => {
      expect(getByText('harvey@storipress.com')).toBeVisible()
    })
  })

  it('open change email modal', async () => {
    const { getByRole } = render(ChangeEmail)

    const changeEmailButton = getByRole('button', {
      name: /change email/i,
    })

    await fireEvent.click(changeEmailButton)
    expect(getByRole('dialog')).toBeVisible()
  })

  it('close change email modal', async () => {
    const { getByRole, getByLabelText, queryByRole } = render(ChangeEmail)

    const changeEmailButton = getByRole('button', {
      name: /change email/i,
    })

    await fireEvent.click(changeEmailButton)

    const newEmailInput = getByLabelText(/new email/i)
    const passwordInput = getByLabelText(/password/i)

    expect(getByRole('dialog')).toBeVisible()
    expect(newEmailInput).not.toHaveValue()
    expect(passwordInput).not.toHaveValue()

    await fireEvent.update(newEmailInput, 'foo@test.com')
    await fireEvent.update(passwordInput, '12345678')

    const closeModalButton = getByRole('button', { name: 'close' })

    await fireEvent.click(closeModalButton)
    await waitFor(() => {
      expect(queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(newEmailInput).not.toBeInTheDocument()

    await fireEvent.click(changeEmailButton)

    expect(newEmailInput).not.toHaveValue('foo@test.com')
    expect(passwordInput).not.toHaveValue('12345678')
  })

  it('invalid fill up', async () => {
    // use stubs to fix validation is not working in dialog
    const { getByLabelText, findByText } = render(ChangeEmail, {
      global: {
        stubs: {
          Modals: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    const newEmailInput = getByLabelText(/new email/i)
    const passwordInput = getByLabelText(/password/i)

    await fireEvent.update(newEmailInput, 'foo')
    await fireEvent.update(passwordInput, '123')

    await expect(findByText('Email must be a valid email')).resolves.toBeVisible()
    await expect(findByText('Password must be at least 8 characters')).resolves.toBeVisible()
  })

  it('invalid submit', async () => {
    const { getByRole, findByRole, findByText } = render(ChangeEmail)

    const openModalButton = getByRole('button', {
      name: /change email/i,
    })

    await fireEvent.click(openModalButton)

    const submitButton = await findByRole('button', {
      name: 'submit',
    })

    await fireEvent.click(submitButton)
    expect(await findByText('Email is a required field')).toBeVisible()
    expect(await findByText('Password is a required field')).toBeVisible()
  })

  it('change email', async () => {
    const { getByRole, getByText, getByLabelText } = render(ChangeEmail)

    await waitFor(() => {
      expect(getByText('harvey@storipress.com')).toBeVisible()
    })

    const openModalButton = getByRole('button', {
      name: /change email/i,
    })

    await fireEvent.click(openModalButton)

    const dialog = getByRole('dialog')
    const newEmailInput = getByLabelText(/new email/i)
    const passwordInput = getByLabelText(/password/i)
    const submitButton = within(dialog).getByRole('button', {
      name: 'submit',
    })
    await fireEvent.update(newEmailInput, 'foo@test.com')
    await fireEvent.update(passwordInput, '12345678')
    await fireEvent.click(submitButton)

    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument()
    })
  })
})
