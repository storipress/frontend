import { defineComponent, h } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import WebflowGroup from '@assets/group-webflow.webp'
import BasicDialog from '../BasicDialog/BasicDialog.vue'
import InfoDialog from './InfoDialog.vue'

const meta: Meta = {
  title: 'Settings/Integrations/InfoDialog',
  component: InfoDialog,
}

export default meta

type Story = StoryObj<typeof InfoDialog>

export const Content: Story = {
  render: (args, { argTypes }) =>
    defineComponent({
      props: Object.keys(argTypes),
      setup() {
        return () => h(InfoDialog, { ...args, onClickButton: action('onClickButton') })
      },
    }),
  args: {
    img: WebflowGroup,
    title: 'Title',
    content: 'Hello World',
    buttonText: 'Click',
  },
}

export const WithDialog: Story = {
  render: (args, { argTypes }) =>
    defineComponent({
      props: Object.keys(argTypes),
      setup() {
        return () =>
          h(
            BasicDialog,
            {
              modelValue: true,
              'onUpdate:modelValue': action('update:modelValue'),
              onClickButton: action('onClickButton'),
            },
            [h(InfoDialog, args)],
          )
      },
    }),
  args: {
    img: WebflowGroup,
    title: 'Title',
    content: 'Hello World',
    buttonText: 'Click',
  },
}
