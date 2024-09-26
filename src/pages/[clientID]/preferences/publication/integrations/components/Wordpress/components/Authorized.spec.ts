import Authorized from './Authorized.vue'
import { render } from '~/test-helpers'

it('renders correctly', () => {
  const { getAllByRole } = render(Authorized, {
    props: {
      img: 'https://example.com/wordpress.png',
    },
  })

  expect(getAllByRole('button')).toHaveLength(1)
})
