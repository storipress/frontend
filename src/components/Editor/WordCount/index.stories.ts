import { h } from 'vue'
import type { Story } from '@storybook/vue3'
import WordCount from './word-count.vue'

export default {
  title: 'Editor/WordCount',
  component: WordCount,
}

const Template: Story = (args, { argTypes }) => ({
  props: Object.keys(argTypes),

  setup() {
    return () => h(WordCount, args)
  },
})

export const Default: Story = Template.bind({})
