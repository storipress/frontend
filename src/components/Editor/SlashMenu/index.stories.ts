import type { Story } from '@storybook/vue3'
import { UnsplashPicker } from '../unsplash-picker'
import { createUnsplashClient } from './unsplash'
import SlashMenu, { CommandsList, Suggestion } from './index'

export default {
  title: 'Editor/SlashMenu',
  layout: 'fullscreen',
}

const Template: Story = (args) => ({
  components: { SlashMenu, UnsplashPicker },
  template: `
    <div>
      <SlashMenu />
      <UnsplashPicker :client="client" />
    </div>
  `,
  setup() {
    const client = createUnsplashClient('')
    return {
      args,
      client,
    }
  },
})

const Init: Story = (args) => ({
  components: { CommandsList },
  template: `
    <div>
      <CommandsList v-bind="args" />
    </div>
  `,
  setup() {
    return {
      args,
    }
  },
})

const NoResult: Story = (args) => ({
  components: { CommandsList },
  template: `
    <div>
      <CommandsList v-bind="args" />
    </div>
  `,
  setup() {
    return {
      args,
    }
  },
})
export const Default = Template.bind({})
export const InitMenu = Init.bind({})
InitMenu.args = {
  items: Suggestion.items({ query: '' }),
  render: Suggestion.render,
}

export const NoResultMenu = NoResult.bind({})
NoResultMenu.args = {
  items: Suggestion.items({ query: 'NoResult' }),
  render: Suggestion.render,
}
