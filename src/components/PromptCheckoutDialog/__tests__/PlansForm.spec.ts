import PlansForm from '../PlansForm.vue'
import { render } from '~/test-helpers'

it('can render correctly', () => {
  const { getAllByRole } = render(PlansForm)

  expect(getAllByRole('button')).toHaveLength(1)
})
