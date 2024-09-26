import ShopifyNotify from './ShopifyNotify.vue'
import { render } from '~/test-helpers'

it('renders correctly', () => {
  const { getAllByRole } = render(ShopifyNotify, {
    props: {
      shopifyBuildDone: true,
    },
  })

  expect(getAllByRole('button')).toHaveLength(1)
})
