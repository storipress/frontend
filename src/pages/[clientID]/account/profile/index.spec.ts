import { expect, it } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/vue'
import Profile from './index.vue'
import { render } from '~/test-helpers'

vi.mock('@tiptap/vue-3', async () => {
  const rest: typeof import('@tiptap/vue-3') = await vi.importActual('@tiptap/vue-3')

  return { ...rest, BubbleMenu: vi.fn() }
})

describe('update personal info', () => {
  it('render the form', async () => {
    const { getByLabelText, queryAllByLabelText, getByTestId } = render(Profile)

    await waitFor(() => {
      expect(getByLabelText(/first name/i)).toHaveValue()
    })

    expect(getByLabelText(/first name/i)).toHaveValue('Harvey')
    expect(getByLabelText(/last name/i)).toHaveValue('Liu')
    expect(getByLabelText(/location/i)).toHaveValue('test')
    expect(getByLabelText(/job title/i)).toHaveValue('Developer')
    expect(getByLabelText(/public email/i)).toHaveValue('hello@storipress.com')
    expect(getByTestId(/Author byline/i)).toHaveTextContent('test')
    expect(getByLabelText(/personal website/i)).not.toHaveValue()
    expect(queryAllByLabelText(/personal profile/i)).toEqual([])
  })

  it('fill up form', async () => {
    const { getByText, queryByText, getByLabelText, getByRole } = render(Profile)

    const firstNameInput = getByLabelText(/first name/i)

    await waitFor(() => {
      expect(firstNameInput).toHaveValue()
    })

    await fireEvent.touch(firstNameInput)
    expect(queryByText('Unsaved changes')).not.toBeInTheDocument()

    await fireEvent.update(firstNameInput, 'Ariel')
    expect(firstNameInput).toHaveValue('Ariel')
    expect(getByText('Unsaved changes')).toBeInTheDocument()

    const discardButton = getByRole('button', { name: /discard/i })
    await fireEvent.click(discardButton)
    expect(firstNameInput).toHaveValue('Harvey')
    expect(queryByText('Unsaved changes')).not.toBeInTheDocument()

    const addSocialLinkButton = getByRole('button', { name: /add another social link/i })
    await fireEvent.click(addSocialLinkButton)
    expect(getByText('Unsaved changes')).toBeInTheDocument()
  })

  it('add social link', async () => {
    const { getByRole, getByLabelText } = render(Profile)

    await waitFor(() => {
      expect(getByLabelText(/first name/i)).toHaveValue()
    })

    const addSocialLinkButton = getByRole('button', { name: /add another social link/i })

    await fireEvent.click(addSocialLinkButton)

    const socialNetworkSelect = getByRole('button', {
      name: /social network select/i,
    })
    const socialLinkInput = getByRole('textbox', {
      name: /link/i,
    })
    expect(socialNetworkSelect).toBeInTheDocument()
    expect(socialLinkInput).toBeInTheDocument()
  })

  it('invalid social link', async () => {
    const { getByRole, getAllByRole, findByText, getByLabelText, queryByText } = render(Profile)

    await waitFor(() => {
      expect(getByLabelText(/first name/i)).toHaveValue()
    })

    const addSocialLinkButton = getByRole('button', { name: /add another social link/i })

    await fireEvent.click(addSocialLinkButton)

    const socialNetworkSelect = getByRole('button', {
      name: /social network select/i,
    })
    const socialLinkInput = getByRole('textbox', {
      name: /link/i,
    })

    await fireEvent.click(socialNetworkSelect)

    const socialNetworkList = getByRole('listbox', {
      name: /social network/i,
    })
    expect(socialNetworkList).toBeVisible()

    await fireEvent.click(getAllByRole('option')[0])
    await socialNetworkSelect.blur()
    expect(socialNetworkList).not.toBeVisible()
    expect(queryByText('This is a required field')).not.toBeInTheDocument()

    await fireEvent.update(socialLinkInput, 'http://foo.com')
    await expect(findByText('Add your URL without the https:// prefix')).resolves.toBeVisible()
    await fireEvent.update(socialLinkInput, '')
    await expect(findByText('Social link is a required field')).resolves.toBeVisible()
  })

  it('delete social link', async () => {
    const { getByRole, getByLabelText } = render(Profile)

    await waitFor(() => {
      expect(getByLabelText(/first name/i)).toHaveValue()
    })

    const addSocialLinkButton = getByRole('button', { name: /add another social link/i })

    await fireEvent.click(addSocialLinkButton)

    const socialNetworkSelect = getByRole('button', {
      name: /social network select/i,
    })
    const socialLinkInput = getByRole('textbox', {
      name: /link/i,
    })
    const deleteSocialLinkButton = getByRole('button', { name: 'delete-new-social-link' })

    expect(socialNetworkSelect).toBeVisible()
    expect(socialLinkInput).toBeVisible()
    expect(deleteSocialLinkButton).toBeVisible()

    await fireEvent.click(deleteSocialLinkButton)

    expect(socialNetworkSelect).not.toBeVisible()
    expect(socialLinkInput).not.toBeVisible()
    expect(deleteSocialLinkButton).not.toBeVisible()
  })

  it('discard the form', async () => {
    const { getByRole, getByLabelText, queryAllByLabelText, getByText, queryByText, getByTestId } = render(Profile)

    await waitFor(() => {
      expect(getByLabelText(/first name/i)).toHaveValue()
    })

    const firstNameInput = getByLabelText(/first name/i)
    const lastNameInput = getByLabelText(/last name/i)
    const locationInput = getByLabelText(/location/i)
    const bioInput = getByTestId(/Author byline/i)
    const websiteInput = getByLabelText(/personal website/i)
    const addSocialLinkButton = getByRole('button', { name: /add another social link/i })

    await fireEvent.update(firstNameInput, 'Ariel')
    await fireEvent.update(lastNameInput, 'Lin')
    await fireEvent.update(locationInput, 'Taipei')
    await fireEvent.update(bioInput, 'Hello world')
    await fireEvent.update(websiteInput, 'www.foo.com')
    await fireEvent.click(addSocialLinkButton)

    const socialNetworkSelect = getByRole('button', {
      name: /social network select/i,
    })
    const socialLinkInput = getByRole('textbox', {
      name: /link/i,
    })
    const deleteSocialLinkButton = getByRole('button', { name: 'delete-new-social-link' })

    await fireEvent.update(socialLinkInput, 'www.foo.com')

    expect(getByText('Unsaved changes')).toBeInTheDocument()

    const discardButton = getByRole('button', { name: /discard/i })
    await fireEvent.click(discardButton)
    expect(queryByText('Unsaved changes')).not.toBeInTheDocument()

    expect(firstNameInput).toHaveValue('Harvey')
    expect(lastNameInput).toHaveValue('Liu')
    expect(locationInput).toHaveValue('test')
    expect(bioInput).toHaveTextContent('test')
    expect(websiteInput).not.toHaveValue()
    expect(queryAllByLabelText(/personal profile/i)).toEqual([])
    expect(socialNetworkSelect).not.toBeVisible()
    expect(socialLinkInput).not.toBeVisible()
    expect(deleteSocialLinkButton).not.toBeVisible()
  })
})
