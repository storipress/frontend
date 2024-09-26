import type { Story } from '@storybook/vue3'
import { userEvent, within } from '@storybook/test'
import ManagerNavbar from './index'

export default {
  title: 'App Shell/Navbars/Open User Menu',
}

const Template: Story = () => ({
  components: { ManagerNavbar },
  template: `
    <ManagerNavbar
      :searchInputType="'Schedule'"
      :workspace="{ id: 'workspaceId', name: 'New York Times', domain: 'nytimes.com' }"
      :workspaceList="[
        { id: 'ID_1', name: 'New York Times', domain: 'nytimes.com' },
      ]"
      :userInfo="{ name: 'Jessica Simpson', avatarSrc: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png' }"
    />
  `,
})

export const Default = Template.bind({})
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByTestId('navbar-user-trigger')
  await userEvent.click(trigger)
}

export const HoverAnItem = Template.bind({})
HoverAnItem.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByTestId('navbar-user-trigger')
  await userEvent.click(trigger)
  const menuitems = await canvas.findAllByRole('menuitem', {}, {})
  await userEvent.hover(menuitems[0])
}
