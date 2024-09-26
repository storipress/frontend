import Workspaces from '../index.vue'
import { render } from '~/test-helpers'

it('can render workspaces page', () => {
  const { getAllByRole, getByRole } = render(Workspaces)

  const createPublicationButton = getByRole('button', { name: 'Create new site' })

  expect(getAllByRole('tablist')).toHaveLength(1)
  expect(getAllByRole('tab')).toHaveLength(4)
  expect(createPublicationButton).toBeVisible()
})
