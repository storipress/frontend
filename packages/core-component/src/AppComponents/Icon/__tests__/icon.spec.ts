import { expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import Icon from '../index.vue'

// this is just to verify the test is working
it('icon', () => {
  const { getByText } = render(Icon, { props: { iconName: 'check' } })

  const span = getByText('', { selector: 'span' })

  expect(span).toBeVisible()
  expect(span).toHaveClass('icon-check')
})
