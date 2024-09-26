import { fireEvent } from '@testing-library/vue'
import { it } from 'vitest'
import Reply from '../reply.vue'
import { render } from '~/test-helpers'

it('submit comment ok', async () => {
  const { getByPlaceholderText, emitted } = render(Reply, {
    props: {
      profile: {},
    },
  })

  expect(emitted()).not.toHaveProperty('submit')
  const input = getByPlaceholderText('Add a comment...')
  await fireEvent.keyDown(input, { key: 'Enter' })
  expect(emitted()).toHaveProperty('submit')
})

it('submit suggest ok', async () => {
  const { getByPlaceholderText, emitted } = render(Reply, {
    props: {
      profile: {},
    },
  })

  expect(emitted()).not.toHaveProperty('submit')
  const suggest = getByPlaceholderText('Suggest change...')
  await fireEvent.keyDown(suggest, { key: 'Enter' })
  expect(emitted()).toHaveProperty('submit')
})
