import type { Story } from '@storybook/vue3'
import MenuLink from './index'

export default {
  title: 'Manager/Editor/context-menus/link',
  layout: 'fullscreen',
}

const Template: Story = (args) => ({
  components: { MenuLink },
  template: `
    <div>
      <MenuLink v-bind="args" />
    </div>
  `,
  setup() {
    return {
      args,
    }
  },
})
export const Default = Template.bind({})
Default.args = {}
