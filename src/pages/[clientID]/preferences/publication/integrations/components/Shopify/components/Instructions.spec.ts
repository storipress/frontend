import Instructions from './Instructions.vue'
import { render } from '~/test-helpers'

it('renders correctly', () => {
  const { getAllByRole } = render(Instructions, {
    props: {
      visible: true,
      img: 'https://www.example.com/image.png',
      activatedTime: true,
      integrationData: {},
      querySetup: null,
    },
  })

  expect(getAllByRole('button')).toHaveLength(2)
})
