import type { Story } from '@storybook/vue3'
import { userEvent, within } from '@storybook/test'
import ManagerNavbar from './index'

export default {
  title: 'App Shell/Navbars/Open Workspace Menu',
}

const Template: Story = () => ({
  components: { ManagerNavbar },
  template: `
    <ManagerNavbar
      :searchInputType="'Schedule'"
      :workspace="{ id: 'workspaceId', name: 'New York Times', domain: 'nytimes.com' }"
      :workspaceList="[
        { id: 'ID_1', name: 'New York Times', domain: 'nytimes.com' },
        { id: 'ID_2', name: 'test publication', domain: 'testpublication.storipress.app' },
        { id: 'ID_3', name: 'test publication 2', domain: 'testpublication2.storipress.app' },
        { id: 'ID_4', name: 'test publication 3', domain: 'testpublication3.storipress.app' },
        { id: 'ID_5', name: 'test publication 4', domain: 'testpublication4.storipress.app' },
      ]"
      :userInfo="{ name: 'Jessica Simpson', avatarSrc: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png' }"
    />
  `,
})

export const Default = Template.bind({})
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByTestId('navbar-workspace-trigger')
  await userEvent.click(trigger)
}
export const HoverAnItem = Template.bind({})
HoverAnItem.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByTestId('navbar-workspace-trigger')
  await userEvent.click(trigger)
  const menuitems = await canvas.findAllByRole('menuitem', {}, {})
  await userEvent.hover(menuitems[0])
}
