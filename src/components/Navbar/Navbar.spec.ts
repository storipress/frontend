import { expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/vue'
import Navbar from './Navbar.vue'
import { enableFeatures, render } from '~/test-helpers'
import type { SearchDataInterface } from '~/components/Navbar'

vi.mock('~/composables/permission/publication', () => ({
  usePublicationPermission: () => ({
    canAccessTutorial: ref(true),
  }),
}))

const currentWorkspace = {
  domain: 'joesblog.cdn.storipress.dev',
  id: 'D6RX98VXN',
  name: "Jack's Blog",
}

const userInfo = {
  avatarSrc: 'https://avatars.dicebear.com/api/croodles-neutral/Michael Jackson.svg?b=%23F0F0F0',
  name: 'Michael Jackson',
}

const defaultProps = {
  highlightLink: 'Articles',
  searchValue: {} as SearchDataInterface,
  class: 'fixed z-20 flex-shrink-0 flex-grow-0',
  showMember: true,
  placeholder: 'Search articles…',
  workspace: currentWorkspace,
  workspaceList: [currentWorkspace],
  searchInputType: 'Article',
  guideProgress: [true],
  userInfo,
  shopifyIntegration: {},
}

it('navbar displays normally', async () => {
  enableFeatures(['members'])
  const { getByRole, getByTestId, getByPlaceholderText } = render(Navbar, {
    props: defaultProps,
  })
  expect(getByRole('img', { name: /logo/i })).toBeVisible()
  expect(getByRole('link', { name: /manage/i })).toBeVisible()
  expect(getByRole('link', { name: /schedule/i })).toBeVisible()
  expect(getByRole('link', { name: /subscribers/i })).toBeVisible()
  expect(getByPlaceholderText('Search articles…')).toBeVisible()
  expect(getByTestId('navbar-search-filter-trigger')).toBeVisible()
  await waitFor(() => expect(getByTestId('guide-progress')).toBeVisible())
  expect(getByTestId('workspace-menu')).toBeVisible()
  expect(getByTestId('user-menu')).toBeVisible()
})
