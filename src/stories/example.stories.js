import MyButton from './Button.vue'

export default {
  title: 'Example/Button',
  component: MyButton,
}

function Template(args, argsType) {
  return {
    components: { MyButton },
    props: Object.keys(argsType),
    setup: () => ({ args }),
    template: '<my-button v-bind="args" />',
  }
}

export const Default = Template.bind({})

Default.args = {
  label: 'Hello',
}
