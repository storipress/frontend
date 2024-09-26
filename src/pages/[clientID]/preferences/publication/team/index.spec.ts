import { expect, it } from 'vitest'
import { fireEvent, waitFor, within } from '@testing-library/vue'
import Team from './index.vue'
import { render } from '~/test-helpers'

it('render settings team', async () => {
  const { getByText, getAllByTestId } = render(Team)

  await waitFor(() => {
    expect(getByText('harvey contributor')).toBeVisible()
  })
  expect(getByText('ariel+01@storipress.com')).toBeVisible()

  expect(getAllByTestId('team-table-name-column')).not.toEqual([])
  expect(getAllByTestId('team-table-name-column')).toMatchSnapshot()
})

describe('sort settings team', () => {
  it('sort by name', async () => {
    const { getByText, getAllByTestId, getByRole } = render(Team)

    await waitFor(() => {
      expect(getByText('harvey contributor')).toBeVisible()
    })

    const sortNameButton = getByRole('columnheader', {
      name: /name/i,
    })
    await fireEvent.click(sortNameButton)
    expect(getAllByTestId('team-table-name-column')).toMatchSnapshot()
  })

  it('sort by status', async () => {
    const { getByText, getAllByTestId, getByRole } = render(Team)

    await waitFor(() => {
      expect(getByText('harvey contributor')).toBeVisible()
    })

    const sortNameButton = getByRole('columnheader', {
      name: /status/i,
    })
    await fireEvent.click(sortNameButton)
    expect(getAllByTestId('team-table-name-column')).toMatchSnapshot()
  })

  it('sort by role', async () => {
    const { getByText, getAllByTestId, getByRole } = render(Team)

    await waitFor(() => {
      expect(getByText('harvey contributor')).toBeVisible()
    })

    const sortNameButton = getByRole('columnheader', {
      name: /role/i,
    })
    await fireEvent.click(sortNameButton)
    expect(getAllByTestId('team-table-name-column')).toMatchSnapshot()
  })

  it('sort by desks', async () => {
    const { getByText, getAllByTestId, getByRole } = render(Team)

    await waitFor(() => {
      expect(getByText('harvey contributor')).toBeVisible()
    })

    const sortNameButton = getByRole('columnheader', {
      name: /desks/i,
    })
    await fireEvent.click(sortNameButton)
    expect(getAllByTestId('team-table-name-column')).toMatchSnapshot()
  })
})

describe('open dropdown', () => {
  it("user's status is active", async () => {
    const { getByText, getByRole } = render(Team)

    await waitFor(() => {
      expect(getByText('harvey contributor')).toBeVisible()
    })

    const row = getByRole('row', {
      name: /test testerson/i,
    })

    const dropdownButton = within(row).getByRole('button', {
      name: /open-dropdown/i,
    })

    await fireEvent.click(dropdownButton)
    expect(within(row).getAllByRole('menu')[0]).toBeVisible()
    expect(within(row).getByTestId('dropdown-menu')).not.toHaveTextContent('Unsuspend user')
    expect(within(row).getByTestId('dropdown-menu')).toHaveTextContent('Suspend user')
  })

  it("user's status is suspended", async () => {
    const { getByText, getByRole } = render(Team)

    await waitFor(() => {
      expect(getByText('harvey contributor')).toBeVisible()
    })

    const row = getByRole('row', {
      name: /storipress helper/i,
    })
    const dropdownButton = within(row).getByRole('button', {
      name: /open-dropdown/i,
    })

    await fireEvent.click(dropdownButton)
    expect(within(row).getAllByRole('menu')[0]).toBeVisible()
    expect(within(row).getByTestId('dropdown-menu')).not.toHaveTextContent('Suspend user')
    expect(within(row).getByTestId('dropdown-menu')).toHaveTextContent('Unsuspend user')
  })

  it("user's status is invited", async () => {
    const { getByText, getByRole } = render(Team)

    await waitFor(() => {
      expect(getByText('harvey contributor')).toBeVisible()
    })

    const row = getByRole('row', {
      name: /ariel\+01@storipress\.com/i,
    })

    const dropdownButton = within(row).getByRole('button', {
      name: /open-dropdown/i,
    })

    await fireEvent.click(dropdownButton)
    expect(within(row).getByRole('menu')).toBeVisible()
    expect(within(row).getByRole('menu')).toHaveTextContent('Revoke invitation')
    expect(within(row).getByRole('menu')).toHaveTextContent('Resend invitation')
  })
})

it('multiple select', async () => {
  const { getByText, getByRole } = render(Team)

  await waitFor(() => {
    expect(getByText('harvey contributor')).toBeVisible()
  })

  const ownerRow = getByRole('row', {
    name: /owner/i,
  })
  const invitedRow = getByRole('row', {
    name: /ariel\+01@storipress\.com/i,
  })
  const theadRow = getByRole('row', {
    name: /name status role desks/i,
  })

  expect(ownerRow).not.toContainHTML('checkbox')
  expect(invitedRow).not.toContainHTML('checkbox')

  await fireEvent.change(within(theadRow).getByRole('checkbox'), {
    target: { checked: true },
  })
  expect(getByText(/selected/i)).toHaveTextContent('9')
  expect(
    getByRole('button', {
      name: /suspend/i,
    }),
  ).toBeVisible()
  expect(
    getByRole('button', {
      name: /remove user/i,
    }),
  ).toBeVisible()
})
