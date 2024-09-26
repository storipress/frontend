import { fireEvent, waitFor } from '@testing-library/vue'
import { expect, it } from 'vitest'
import SearchInput from './SearchInput.vue'
import { SearchInputType } from './definition'
import { render } from '~/test-helpers'
import type { SearchDataInterface } from '~/components/Navbar'

const initialSearchValue: SearchDataInterface = {}

it('trigger search filter popover', async () => {
  const { getByRole, getByTestId, getByPlaceholderText, queryByRole } = render(SearchInput, {
    props: {
      modelValue: initialSearchValue,
      placeholder: 'Search articles…',
      type: SearchInputType.Article,
    },
  })

  const filterTriggerButton = getByTestId('navbar-search-filter-trigger')
  await fireEvent.click(filterTriggerButton)

  const searchFilterPanel = getByRole('dialog', { name: 'Search filter' })
  expect(searchFilterPanel).toBeVisible()

  const searchInput = getByPlaceholderText('Search articles…')
  await searchInput.focus()
  expect(queryByRole('dialog', { name: 'Search filter' })).not.toBeInTheDocument()
})

it('enter search string', async () => {
  const { getByPlaceholderText, emitted } = render(SearchInput, {
    props: {
      modelValue: initialSearchValue,
      placeholder: 'Search articles…',
      type: SearchInputType.Article,
    },
  })

  const searchInput = getByPlaceholderText('Search articles…')
  await searchInput.focus()
  await fireEvent.update(searchInput, 'storipress')
  await waitFor(() => {
    expect(emitted()['update:modelValue'][0]).toEqual([{ text: 'storipress' }])
  })
})
