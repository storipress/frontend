import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/vue'
import { setActivePinia } from 'pinia'
import CustomDomain from './index.vue'
import { enableFeatures, mockResponseOnce, render, setupTestPinia } from '~/test-helpers'
import { Flags } from '~/lib/feature-flag'
import { useApolloClient } from '~/lib/apollo'
import GetBilling from '~/mocks/graphql/GetBilling'
import GetSite from '~/mocks/graphql/GetSite'
import GetWordpressAuthorized from '~/mocks/graphql/GetWordpressAuthorized'

describe('setup publication domain', () => {
  beforeEach(() => {
    enableFeatures([Flags.PaidCustomDomain])
    setActivePinia(setupTestPinia(false))
    const { client } = useApolloClient()
    client.cache.reset()

    // disable wordpress integration
    mockResponseOnce(GetWordpressAuthorized, {
      wordPressAuthorized: false,
    })
  })

  it('render custom domain and email', async () => {
    mockResponseOnce(GetSite, {
      site: {
        plan: 'free',
      },
    })
    mockResponseOnce(GetBilling, {
      billing: {
        on_trial: false,
        plan: 'free',
        subscribed: false,
      },
    })
    const { getByRole, getAllByRole, getByLabelText } = render(CustomDomain)

    await waitFor(() => {
      expect(getByLabelText(/enter your domain name/i)).toBeVisible()
    })

    const domainInput = getByLabelText(/enter your domain name/i)

    await waitFor(() => {
      expect(domainInput).toHaveValue('www.joesblog.storipress.dev')
    })

    const activateButton = getByRole('button', {
      name: /verify DNS Settings/i,
    })

    expect(activateButton).not.toBeDisabled()
    expect(getAllByRole('listitem')).toMatchSnapshot()
  })

  it('invalid domain', async () => {
    const { getByLabelText, getByText } = render(CustomDomain)

    await waitFor(() => {
      expect(getByLabelText(/enter your domain name/i)).toBeVisible()
    })

    const domainInput = getByLabelText(/enter your domain name/i)

    await waitFor(() => {
      expect(domainInput).toHaveValue('www.joesblog.storipress.dev')
    })

    await fireEvent.update(domainInput, 'https://www.joesblog.storipress.dev')
    await waitFor(() => {
      expect(getByText('Please remove the https:// from your domain')).toBeVisible()
    })
  })

  it('invalid submit', async () => {
    const { getByLabelText, queryByText } = render(CustomDomain)

    await waitFor(() => {
      expect(getByLabelText(/enter your domain name/i)).toBeVisible()
    })

    const domainInput = getByLabelText(/enter your domain name/i)

    await waitFor(() => {
      expect(domainInput).toHaveValue('www.joesblog.storipress.dev')
    })

    await fireEvent.update(domainInput, 'https://joesblog.storipress.dev')
    // expect(await findByText('Please remove the https:// from your domain')).toBeVisible()
    expect(queryByText('Domain activation requested')).not.toBeInTheDocument()
  })

  it('has get custom domain configuration but not yet activate', async () => {
    mockResponseOnce(GetSite, {
      site: {
        plan: 'free',
      },
    })
    mockResponseOnce(GetBilling, {
      billing: {
        on_trial: false,
        plan: 'free',
        subscribed: false,
      },
    })

    const { getByRole, getByLabelText } = render(CustomDomain)

    await waitFor(() => {
      expect(getByLabelText(/enter your domain name/i)).toBeVisible()
    })

    const domainInput = getByLabelText(/enter your domain name/i)

    await waitFor(() => {
      expect(domainInput).toHaveValue('www.joesblog.storipress.dev')
    })

    const activateButton = getByRole('button', {
      name: /verify DNS Settings/i,
    })
    expect(activateButton).not.toBeDisabled()
  })
})
