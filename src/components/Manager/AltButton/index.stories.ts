import type { Story } from '@storybook/vue3'
import AltButton from './index'

export default {
  title: 'Manager/Editor/components/AltButton',
  layout: 'fullscreen',
}

const Template: Story = (args) => ({
  components: { AltButton },
  template: `
    <div>
      <AltButton v-bind="args" />
    </div>
  `,
  setup() {
    return {
      args,
    }
  },
})
export const Clicked = Template.bind({})
Clicked.args = {
  disabled: true,
  clicked: true,
}

export const NotClicked = Template.bind({})
NotClicked.args = {
  disabled: true,
  clicked: false,
}
