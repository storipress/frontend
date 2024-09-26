import type { Story } from '@storybook/vue3'
import { ref } from 'vue'
import PromptCheckoutDialog from './index'

export default {
  title: 'Settings/PromptCheckoutDialog',
  decorators: [
    (story) => ({
      components: { story },
      template: '<div style="width:100vw;height:100vh;margin:-16px;"><story /></div>',
    }),
  ],
  component: PromptCheckoutDialog,
  argTypes: {
    show: {
      name: 'show',
      type: { required: false },
      defaultValue: false,
      description: 'demo description',
      control: { type: 'boolean' },
    },
    clickOutsideToClose: {
      name: 'clickOutsideToClose',
      type: { required: false },
      defaultValue: true,
      description: 'demo description',
      control: { type: 'boolean' },
    },
  },
}

const Template: Story = () => ({
  components: { PromptCheckoutDialog },
  setup: () => {
    const opened = ref(true)
    return {
      opened,
    }
  },
  template: /* html */ `
    <div>
      <button @click="opened = true">Open</button>
      <prompt-checkout-dialog :open="opened" @done="opened = false" @close="opened = false" />
    </div>
  `,
})

export const Default = Template.bind({})
