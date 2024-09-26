import { h } from 'vue'
import type { Story } from '@storybook/vue3'
import WordCountDialog from './word-count-dialog.vue'

export default {
  title: 'Editor/WordCountDialog',
  component: WordCountDialog,
}

const Template: Story = (args, { argTypes }) => ({
  props: Object.keys(argTypes),

  setup() {
    return () => h(WordCountDialog, args)
  },
})

export const Default: Story = Template.bind({})
