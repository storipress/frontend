import { expect, it } from 'vitest'
import LinkAction from '../link-action.vue'
import { render } from '~/test-helpers'

it('linkAction can render link', () => {
  const { getByRole } = render(LinkAction, { props: { href: 'https://example.com', icon: 'web' } })
  expect(getByRole('link')).toHaveAttribute('href', 'https://example.com')
})

it('linkAction should not render link if href is not provided', () => {
  const { queryByRole } = render(LinkAction, { props: { icon: 'web' } })
  expect(queryByRole('link')).toBeNull()
})
