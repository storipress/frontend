import Authorized from './Authorized.vue'
import { render } from '~/test-helpers'

it('renders correctly', () => {
  const { getAllByRole } = render(Authorized, {
    props: {
      integrationImg: 'https://example.com/slack.png',
      integrationData: { stage: [], published: [] },
      channelsList: [],
    },
  })

  expect(getAllByRole('img')).toHaveLength(1)
  expect(getAllByRole('textbox')).toHaveLength(2)
  expect(getAllByRole('button')).toHaveLength(2)
})
