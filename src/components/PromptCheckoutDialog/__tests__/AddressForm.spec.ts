import AddressForm from '../AddressForm.vue'
import { render } from '~/test-helpers'

it('can render correctly', () => {
  const { getAllByRole } = render(AddressForm)

  expect(getAllByRole('textbox')).toHaveLength(8)
  expect(getAllByRole('button')).toHaveLength(1)
})
