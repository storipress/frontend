import { expect, userEvent, waitFor, within } from '@storybook/test'
import type { StoryFn } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import { reactive } from 'vue'

import type { DeskSettingDataInterface, EventSubmitDataInterface } from './index'
import EditDeskSettingsSlideOver from './index'

export default {
  title: 'Pages/Articles/Components/desk settings',
  decorators: [
    (story) => ({
      components: { story },
      template: '<div style="width:100vw;height:100vh;margin:-16px;"><story /></div>',
    }),
  ],
}

const Template: StoryFn = () => ({
  components: { EditDeskSettingsSlideOver },
  template: `
    <div>
      <EditDeskSettingsSlideOver
        workspaceName="New-York-Times"
        v-bind="data"
        @close="closeSlideOver"
        @submit="submit"
        @delete="deleteDesk"
      />
      <button data-testid="trigger" @click="data.show = !data.show" class="bg-gray-300">
        Click me
      </button>
    </div>
  `,
  setup() {
    const data = reactive({
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
      } as DeskSettingDataInterface,
    })
    const actionClose = action('close')
    const actionSubmit = action('submit')
    const actionDelete = action('delete')
    return {
      data,
      closeSlideOver() {
        data.show = false
        actionClose()
      },
      submit(newData: EventSubmitDataInterface) {
        data.deskSetting = newData
        actionSubmit(newData)
        data.loading = true
        setTimeout(() => (data.loading = false), 1000)
      },
      deleteDesk() {
        actionDelete()
      },
    }
  },
})

export const Default = Template.bind({})
Default.args = {}
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByTestId('trigger')
  await userEvent.click(trigger)
}

export const Interaction = Template.bind({})
Interaction.args = {}
Interaction.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement.parentElement)
  const trigger = canvas.getByTestId('trigger')
  await userEvent.click(trigger)
  const deskNameInput = await canvas.findByLabelText('Desk name')
  await userEvent.type(deskNameInput, '-change', { delay: 100 })
  // const openAccessSelect = await canvas.findByLabelText('Open Access')
  // await userEvent.click(openAccessSelect)
  const checkboxes = await canvas.getAllByRole('checkbox')
  await userEvent.click(checkboxes[2])
  await userEvent.click(checkboxes[4])
  const menuTrigger = canvasElement.parentElement.querySelector(
    'tbody tr:last-child td:last-child button[id^=headlessui-menu-button]',
  )
  await userEvent.click(menuTrigger)
}

async function findBySelector(container: Element, selector: string): Promise<Element | undefined> {
  try {
    await waitFor(() => expect(container.querySelector(selector)).not.toBeNull())
  } catch (e) {}
  return container.querySelector(selector) || undefined
}

export const DeleteMember = Template.bind({})
DeleteMember.args = {}
DeleteMember.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement.parentElement)
  const trigger = canvas.getByTestId('trigger')
  await userEvent.click(trigger)
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 100))
  const menuTrigger = await findBySelector(
    canvasElement.parentElement,
    'tbody tr:last-child td:last-child button[id^=headlessui-menu-button]',
  )
  await userEvent.click(menuTrigger!)
  const deleteMenuItem = canvas.getByText('Remove from desk')
  await userEvent.click(deleteMenuItem)
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 100))
}

export const DeleteDesk = Template.bind({})
DeleteDesk.args = {}
DeleteDesk.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement.parentElement)
  const trigger = canvas.getByTestId('trigger')
  await userEvent.click(trigger)
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 100))
  const deleteButton = (await canvas.findByText('Delete desk')) as HTMLInputElement
  try {
    await waitFor(() => expect(deleteButton.disabled).toBeFalsy())
  } catch (e) {}
  await userEvent.click(deleteButton)
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 100))
}
