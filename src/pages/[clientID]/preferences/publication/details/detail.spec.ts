/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { expect, it } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/vue'
import Detail from './index.vue'
import timezones from './timezones'
import { render } from '~/test-helpers'
import { useSiteStore } from '~/stores/site'

it('render the form', async () => {
  const { getByRole, getAllByRole, getByPlaceholderText } = render(Detail, { stubActions: false })

  const siteStore = useSiteStore()
  await siteStore.fetchSite()
  expect(siteStore.fetchSite).toHaveBeenCalledTimes(1)

  await waitFor(() => {
    expect(
      getByRole('textbox', {
        name: /publication name/i,
      }),
    ).toHaveValue("Jack's Blog")
  })

  expect(getAllByRole('textbox')[2]).toHaveValue('English (United States)')
  expect(getAllByRole('textbox')[4]).toHaveValue('(GMT -10:00) Hawaii')
  expect(getByPlaceholderText('hello@storipress.com')).toHaveValue('test@storipress.com')
  expect(getByPlaceholderText('facebook.com/storipress')).toHaveValue('www.facebook.com/Storipress')
})

it('fill up form', async () => {
  const { getByRole, getAllByRole, getByPlaceholderText, queryByText, getByText, container } = render(Detail, {
    stubActions: false,
  })

  const siteStore = useSiteStore()
  await siteStore.fetchSite()
  expect(siteStore.fetchSite).toHaveBeenCalledTimes(1)

  const publicationNameInput = getByRole('textbox', {
    name: /publication name/i,
  })
  expect(queryByText('Unsaved changes')).not.toBeInTheDocument()

  await fireEvent.update(publicationNameInput, 'New publication name')
  expect(getByText('Unsaved changes')).toBeInTheDocument()
  expect(publicationNameInput).toHaveValue('New publication name')
  expect(getByText('Unsaved changes')).toBeInTheDocument()

  const timezonesListLength = timezones.length
  const expectSelectedValue = timezones[0].text
  const timezoneInput = getAllByRole('textbox')[4]
  await timezoneInput.focus()
  expect(container.querySelectorAll('.simple-typeahead-list-item')).toHaveLength(timezonesListLength)
  const expectItem = getByText(expectSelectedValue)
  await fireEvent.click(expectItem)
  await timezoneInput.blur()
  expect(timezoneInput).toHaveValue('(GMT -11:00) Midway Island, Samoa')

  const publicationEmailInput = getByPlaceholderText('hello@storipress.com')
  await fireEvent.update(publicationEmailInput, 'new-email@storipress.com')
  expect(publicationEmailInput).toHaveValue('new-email@storipress.com')

  const currentSocialLink = getByPlaceholderText('facebook.com/storipress')
  await fireEvent.update(currentSocialLink, 'facebook.com/new')
  expect(currentSocialLink).toHaveValue('facebook.com/new')

  const addSocialLinkButton = getByRole('button', { name: /add another social link/i })
  await fireEvent.click(addSocialLinkButton)
  const newSocialLinkSelectButton = screen.getByRole('button', { name: /social network select \.\.\./i })
  expect(newSocialLinkSelectButton).toBeInTheDocument()
})

describe('invalid social link', () => {
  it('current social link', async () => {
    const { findByPlaceholderText, findByText } = render(Detail, { stubActions: false })

    const siteStore = useSiteStore()
    await siteStore.fetchSite()
    expect(siteStore.fetchSite).toHaveBeenCalledTimes(1)

    const currentSocialLink = await findByPlaceholderText('facebook.com/storipress')
    await fireEvent.update(currentSocialLink, 'https://facebook.com/new')
    await expect(findByText('Add your URL without the https:// prefix')).resolves.toBeVisible()
    await fireEvent.update(currentSocialLink, '')
    await expect(findByText('Social link is a required field')).resolves.toBeVisible()
  })

  it('new social link', async () => {
    const { getByRole, getByText } = render(Detail, { stubActions: false })

    const siteStore = useSiteStore()
    await siteStore.fetchSite()
    expect(siteStore.fetchSite).toHaveBeenCalledTimes(1)

    const addSocialLinkButton = getByRole('button', { name: /add another social link/i })
    await fireEvent.click(addSocialLinkButton)
    expect(getByText('Unsaved changes')).toBeInTheDocument()
  })
})

it('discard the form', async () => {
  const { getByRole, getAllByRole, getByPlaceholderText, queryByText, getByText } = render(Detail, {
    stubActions: false,
  })

  const siteStore = useSiteStore()
  await siteStore.fetchSite()
  expect(siteStore.fetchSite).toHaveBeenCalledTimes(1)

  const publicationNameInput = getByRole('textbox', {
    name: /publication name/i,
  })
  await fireEvent.update(publicationNameInput, 'New publication name')

  const expectSelectedValue = timezones[0].text
  const timezoneInput = getAllByRole('textbox')[4]
  await timezoneInput.focus()

  const expectItem = getByText(expectSelectedValue)
  await fireEvent.click(expectItem)
  await timezoneInput.blur()

  const publicationEmailInput = getByPlaceholderText('hello@storipress.com')
  await fireEvent.update(publicationEmailInput, 'new-email@storipress.com')

  const currentSocialLink = getByPlaceholderText('facebook.com/storipress')
  await fireEvent.update(currentSocialLink, 'new-link.com')

  expect(getByText('Unsaved changes')).toBeInTheDocument()

  const discardButton = getByRole('button', { name: /discard/i })
  await fireEvent.click(discardButton)
  expect(queryByText('Unsaved changes')).not.toBeInTheDocument()

  expect(
    getByRole('textbox', {
      name: /publication name/i,
    }),
  ).toHaveValue("Jack's Blog")
  expect(getAllByRole('textbox')[4]).toHaveValue('(GMT -10:00) Hawaii')
  expect(getByPlaceholderText('hello@storipress.com')).toHaveValue('test@storipress.com')
  expect(getByPlaceholderText('facebook.com/storipress')).toHaveValue('www.facebook.com/Storipress')
})
