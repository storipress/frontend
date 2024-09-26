import { flushPromises } from '@vue/test-utils'
import { fireEvent } from '@testing-library/vue'
import { describe, it } from 'vitest'
import Comment from '../comment.vue'
import { render } from '~/test-helpers'

const comment = {
  id: '1300',
  author: {
    __typename: 'User',
    id: '411',
    full_name: 'test name',
    avatar: 'https://api.dicebear.com/7.x/initials/png?seed=hung lin chang&size=256',
    name: 'test name',
  },
  content: 'my comment#@#@#@#@#@#@#@#@my suggest',
  created_at: '2023-12-27T05:44:44+00:00',
  createdAt: '2023-12-27T05:44:44.000Z',
}

describe('test comment and suggest', () => {
  it('render comment and suggest success', async () => {
    const { getByText } = render(Comment, {
      props: {
        comment,
        profile: {
          id: 1,
        },
        threadId: '1',
      },
    })

    await flushPromises()
    expect(getByText('my comment')).toBeTruthy()
    expect(getByText('my suggest')).toBeTruthy()
  })

  it('resolve ok', async () => {
    const { getAllByRole, emitted } = render(Comment, {
      props: {
        comment,
        profile: {
          id: 1,
        },
        threadId: '1',
      },
    })
    const buttons = getAllByRole('button')
    expect(emitted()).not.toHaveProperty('resolve')
    await fireEvent.click(buttons[0])
    expect(emitted()).toHaveProperty('resolve')
  })

  it('edit ok', async () => {
    const { getByText, getAllByRole, emitted } = render(Comment, {
      props: {
        comment,
        profile: {
          id: 1,
        },
        threadId: '1',
      },
    })

    const buttons = getAllByRole('button')
    expect(emitted()).not.toHaveProperty('edit')
    await fireEvent.click(buttons[1])
    const editButton = getByText('Edit')
    await fireEvent.click(editButton)
    const suggestArea = getByText('my suggest')
    await fireEvent.keyDown(suggestArea, { key: 'Enter' })
    expect(emitted()).toHaveProperty('edit')
  })

  it('suggest ok', async () => {
    const { getByText, emitted } = render(Comment, {
      props: {
        comment,
        profile: {
          id: 1,
        },
        threadId: '1',
      },
    })
    await flushPromises()
    expect(emitted()).not.toHaveProperty('suggest')
    const applyChangeButton = getByText('Apply change')
    await fireEvent.click(applyChangeButton)
    expect(emitted()).toHaveProperty('suggest')
  })
})
