import { describe, expect, it } from 'vitest'
import EditDeskSettingsSlideOver from './index'
import { render } from '~/test-helpers'

describe('editDeskSettingsSlideOver.vue', () => {
  it('props features', async () => {
    const { rerender, baseElement } = render(EditDeskSettingsSlideOver, {
      props: {
        workspaceName: 'New-York-Times',
        show: false,
        loading: false,
        deskSetting: {
          name: 'Business',
          openAccess: false,
          members: [
            {
              id: 'XXX0',
              avatar:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
              name: 'Bob Bradley',
              status: 'Active',
              role: 'owner',
              desks: [
                {
                  id: '1',
                  name: 'Test 2',
                },
                {
                  id: '2',
                  name: 'Tester',
                },
                {
                  id: '3',
                  name: 'TEST: One Article',
                },
                {
                  id: '56',
                  name: 'TEST: ALL 10 ARTICLE',
                },
                {
                  id: '57',
                  name: 'TEST: ALL 15 ARTICLE',
                },
                {
                  id: '58',
                  name: 'TEST: Infinite Scroll',
                },
                {
                  id: '59',
                  name: 'TEST: SAME ORDER',
                },
              ],
            },
            {
              id: 'XXX1',
              avatar:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
              name: 'Jessica Nacci',
              status: 'Active',
              role: 'editor',
              desks: [
                {
                  id: '1',
                  name: 'Test 2',
                },
                {
                  id: '2',
                  name: 'Tester',
                },
                {
                  id: '3',
                  name: 'TEST: One Article',
                },
                {
                  id: '56',
                  name: 'TEST: ALL 10 ARTICLE',
                },
                {
                  id: '57',
                  name: 'TEST: ALL 15 ARTICLE',
                },
                {
                  id: '58',
                  name: 'TEST: Infinite Scroll',
                },
                {
                  id: '59',
                  name: 'TEST: SAME ORDER',
                },
              ],
            },
            {
              id: 'XXX2',
              avatar:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
              name: 'Alex Cheng',
              status: 'Active',
              role: 'author',
              desks: [
                {
                  id: '58',
                  name: 'TEST: Infinite Scroll',
                },
                {
                  id: '59',
                  name: 'TEST: SAME ORDER',
                },
              ],
            },
            {
              id: 'XXX3',
              avatar:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
              name: 'Amanda Pharmacy',
              status: 'Invited',
              role: 'author',
              desks: [
                {
                  id: '1',
                  name: 'Test 2',
                },
                {
                  id: '2',
                  name: 'Tester',
                },
              ],
            },
            {
              id: 'XXX4',
              avatar:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
              name: 'Chris Dartmouth',
              status: 'Suspended',
              role: 'contributor',
              desks: [
                {
                  id: '3',
                  name: 'TEST: One Article',
                },
              ],
            },
          ],
        },
      },
    })
    expect(baseElement).toMatchSnapshot('hide')
    await rerender({ show: true })
    expect(baseElement).toMatchSnapshot('show')
    await rerender({ loading: true })
    expect(baseElement).toMatchSnapshot('loading')
  })
})
