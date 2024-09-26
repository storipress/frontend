import type { Story } from '@storybook/vue3'
import { h } from 'vue'
import HeroContextMenu from './hero-context-menu.vue'

export default {
  title: 'Manager/HeroContextMenu',
}

const Template: Story = (args) => ({
  setup() {
    return () => h(HeroContextMenu, args)
  },
})

export const Default = Template.bind({})

Default.args = {
  uploaded: false,
}

export const Uploaded = Template.bind({})

Uploaded.args = {
  uploaded: true,
}
