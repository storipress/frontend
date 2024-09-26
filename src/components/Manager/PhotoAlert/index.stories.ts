import type { Story } from '@storybook/vue3'
import PhotoAlert from './index'

export default {
  title: 'Manager/Editor/components/PhotoAlert',
  layout: 'fullscreen',
}

const Template: Story = (args) => ({
  components: { PhotoAlert },
  template: `
    <div>
      <PhotoAlert v-bind="args" />
    </div>
  `,
  setup() {
    return {
      args,
    }
  },
})
export const Default = Template.bind({})
Default.args = {
  alertText: 'Missing alt text',
}
