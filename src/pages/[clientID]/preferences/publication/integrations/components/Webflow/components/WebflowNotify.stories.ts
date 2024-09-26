import { defineComponent, h } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import WebflowNotify from './WebflowNotify.vue'

const meta: Meta = {
  title: 'Webflow/WebflowNotify',
  component: WebflowNotify,
}

export default meta

type Story = StoryObj<typeof WebflowNotify>

export const Content: Story = {
  render: (args, { argTypes }) =>
    defineComponent({
      props: Object.keys(argTypes),
      setup() {
        return () => h(WebflowNotify, { ...args, onClickNotify: action('onClickNotify') })
      },
    }),
  args: {},
}
