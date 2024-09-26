import type { Story } from '@storybook/vue3'
import { reactive } from 'vue'
import { action } from '@storybook/addon-actions'

import LeftHandNavPanel, { DEFAULT_ITEM } from './index'
import type { EventClickAddSubdeskDataInterface, EventClickDeskDataInterface } from './index'

export default {
  title: 'Pages/Articles/Components/nav flow',
}

const Template: Story = (args) => ({
  components: { LeftHandNavPanel },
  template: `
    <LeftHandNavPanel
      :desks="[
        { id: '0', name: 'Opinion' },
        {
          id: '1',
          name: 'Business',
          desks: [
            { id: '1-0', name: 'Capital Markets' },
            { id: '1-1', name: 'Currency' },
            { id: '1-2', name: 'Derivatives' },
            { id: '1-3', name: 'Equities' },
          ]
        },
        {
          id: '2',
          name: 'Politics',
          desks: [
            { id: '2-0', name: 'Capital Markets' },
            { id: '2-1', name: 'Currency' },
            { id: '2-2', name: 'Derivatives' },
            { id: '2-3', name: 'Equities' },
          ]
        },
        { id: '3', name: 'Environment' },
      ]"
      :activeId="data.activeId"
      @clickAll="handleClickAll"
      @clickFeatured="handleClickFeatured"
      @clickMyArticles="handleClickMyArticles"
      @clickAddDesk="handleClickAddDesk"
      @clickAddSubdesk="handleClickAddSubdesk"
      @clickDesk="handleClickDesk"
      @clickDeskSetting="handleClickDeskSetting"
    />
  `,
  setup() {
    const data = reactive(args)
    return {
      data,
      handleClickAll() {
        action('clickAll')()
        data.activeId = DEFAULT_ITEM.ALL.id
      },
      handleClickFeatured() {
        action('clickFeatured')()
        data.activeId = DEFAULT_ITEM.FEATURED.id
      },
      handleClickMyArticles() {
        action('clickMyArticles')()
        data.activeId = DEFAULT_ITEM.MY_ARTICLES.id
      },
      handleClickAddDesk() {
        action('clickAddDesk')()
      },
      handleClickAddSubdesk(parentDesk: EventClickAddSubdeskDataInterface) {
        action('clickAddSubdesk')(parentDesk)
      },
      handleClickDesk(clickedDesk: EventClickDeskDataInterface) {
        action('clickDesk')(clickedDesk)
        data.activeId = clickedDesk.id
      },
      handleClickDeskSetting() {
        action('clickDeskSetting')()
      },
    }
  },
})

export const Default = Template.bind({})
Default.args = {
  activeId: DEFAULT_ITEM.ALL.id,
}

export const SelectADesk = Template.bind({})
SelectADesk.args = {
  activeId: '0',
}

export const SelectADeskHasChildren = Template.bind({})
SelectADeskHasChildren.args = {
  activeId: '1',
}

export const SelectASubDesk = Template.bind({})
SelectASubDesk.args = {
  activeId: '1-0',
}
