import type { Story } from '@storybook/vue3'
import { fireEvent, userEvent, within } from '@storybook/test'
import ManagerNavbar from './index'

export default {
  title: 'App Shell/Navbars/Open Filter Popup',
  decorators: [
    (story) => ({
      components: { story },
      template: '<div style="width:100%;height:100vh;"><story /></div>',
    }),
  ],
}

const Template: Story = (args) => ({
  components: { ManagerNavbar },
  template: `
    <ManagerNavbar
      :searchInputType="args.searchInputType"
      :workspace="{ id: 'workspaceId', name: 'New York Times', domain: 'nytimes.com' }"
      :workspaceList="[
        { id: 'workspaceId', name: 'New York Times', domain: 'nytimes.com' },
      ]"
      :userInfo="{ name: 'Jessica Simpson', avatarSrc: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png' }"
      :searchValue="{
        range: [
          new Date(1642485950740),
          new Date(1642658745238)
        ]
      }"
    />
  `,
  setup() {
    return { args }
  },
})

export const InArticlePage = Template.bind({})
InArticlePage.args = {}
InArticlePage.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByTestId('navbar-search-filter-trigger')
  await userEvent.click(trigger)
}

export const InSchedulePage = Template.bind({})
InSchedulePage.args = { searchInputType: 'Schedule' }
InSchedulePage.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByTestId('navbar-search-filter-trigger')
  await userEvent.click(trigger)
}

export const OpenPeopleTypeahead = Template.bind({})
OpenPeopleTypeahead.args = {}
OpenPeopleTypeahead.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByTestId('navbar-search-filter-trigger')
  await userEvent.click(trigger)
  const input = await canvas.findByLabelText('People')
  fireEvent.focus(input)
}

export const OpenTagsTypeahead = Template.bind({})
OpenTagsTypeahead.args = {}
OpenTagsTypeahead.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByTestId('navbar-search-filter-trigger')
  await userEvent.click(trigger)
  const input = await canvas.findByLabelText('Tags')
  fireEvent.focus(input)
}

export const OpenCalendarHint = Template.bind({})
OpenCalendarHint.args = {}
OpenCalendarHint.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByTestId('navbar-search-filter-trigger')
  await userEvent.click(trigger)
  const hint = await canvas.findByTestId('navbar-search-hint-trigger')
  await userEvent.hover(hint)
}
