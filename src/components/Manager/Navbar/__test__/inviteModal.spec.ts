import { fireEvent } from '@testing-library/vue'
import InviteModal from '../InviteModal.vue'
import { render } from '~/test-helpers'

vi.mock('~/components/Manager/Meta/utils/ydoc', () => ({
  defineYdocMapList: () => ({
    showValue: {
      value: [],
    },
  }),
}))

it('selectTypeahead render user list ok', async () => {
  const { getAllByRole, getAllByText } = render(InviteModal, {
    props: {
      id: '1',
      open: true,
      ydoc: {
        getMap: () => {
          return {
            observe: () => {
              return {}
            },
          }
        },
      },
      userList: {
        users: [
          {
            id: '1',
            full_name: 'TestUser',
            avatar: 'https://assets.stori.press/storipress/storipress-helper-user-avatar.webp',
            email: 'hello@storipress.com',
          },
          {
            id: '3228',
            full_name: 'TestUser',
            avatar: 'https://api.dicebear.com/7.x/initials/png?seed=Test First&size=256',
            email: 'nick+3@storipress.com',
          },
          {
            id: '3760',
            full_name: 'TestUser',
            avatar: 'https://api.dicebear.com/7.x/initials/png?seed=test test2&size=256',
            email: 'nick+4@storipress.com',
          },
        ],
      },
    },
  })

  await nextTick()
  const selectUserList = getAllByRole('textbox')[1]
  await fireEvent.click(selectUserList)
  expect(getAllByText('TestUser')).toHaveLength(3)
})
