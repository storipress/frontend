import { expect, it } from 'vitest'
import LinkMenu from '../link-menu.vue'
import { render } from '~/test-helpers'

it('linkMenu should render', () => {
  const { getByRole } = render(LinkMenu)
  expect(getByRole('textbox')).toBeVisible()
})

it('linkMenu should show more action if have input', async () => {
  const { getByRole, queryByRole, rerender, getAllByRole } = render(LinkMenu)
  expect(getByRole('textbox')).toBeVisible()
  expect(queryByRole('link')).toBeNull()
  expect(queryByRole('button')).toBeNull()

  await rerender({
    modelValue: 'example.com',
  })

  expect(getByRole('textbox')).toHaveValue('example.com')
  expect(getByRole('link')).toHaveAttribute('href', 'https://example.com')
  expect(getAllByRole('button')).toHaveLength(2)
})

it('linkMenu always show more action if have alwaysShowMenu', async () => {
  const { getByRole, getAllByRole } = render(LinkMenu, { props: { alwaysShowMenu: true } })
  expect(getByRole('textbox')).toBeVisible()
  expect(getAllByRole('button')).toHaveLength(3)
})
