import FormView from './FormView.vue'
import { render } from '~/test-helpers'

it('renders correctly', async () => {
  const { getAllByRole, rerender } = render(FormView, {
    props: {
      isActivated: false,
      disableSubmit: false,
    },
  })

  expect(getAllByRole('button')).toHaveLength(1)

  await rerender({ isActivated: true })

  expect(getAllByRole('button')).toHaveLength(2)
})
