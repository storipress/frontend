import { ref } from 'vue'
import MyToggle from './index.vue'

export default {
  title: 'App Components/Toggles',
  component: MyToggle,
  argTypes: {
    onClick: {},
  },
}

const Template = (args) => ({
  components: { MyToggle },
  setup() {
    const enabled = ref(false)
    return { args, enabled }
  },
  template: '<my-toggle v-bind="args" v-model="enabled" />',
})

export const Simple = Template.bind({})
Simple.args = {
  type: 'simple',
}

export const Short = Template.bind({})
Short.args = {
  type: 'short',
  color: 'bg-emerald-700',
}

export const SimpleDisabled = Template.bind({})
SimpleDisabled.args = {
  type: 'simple',
  disabled: true,
}

export const ShortDisabled = Template.bind({})
ShortDisabled.args = {
  type: 'short',
  color: 'bg-emerald-700',
  disabled: true,
}
