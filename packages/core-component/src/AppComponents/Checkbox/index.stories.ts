import MyCheckbox from './index.vue'

export default {
  title: 'App Components/Checkbox',
  component: MyCheckbox,
  argTypes: {},
}

const Template = (args) => ({
  components: { MyCheckbox },
  setup() {
    return { args }
  },
  template: '<my-checkbox v-bind="args" />',
})

export const Check = Template.bind({})
Check.args = {}
