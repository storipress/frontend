import MyChip from './index.vue'

export default {
  title: 'App Components/Chips',
  component: MyChip,
  argTypes: {
    color: {
      control: {
        type: 'select',
        // labels: {
        //   '': 'default',
        //   primary: 'primary',
        //   info: 'info',
        //   warning: 'warning',
        // },
      },
      options: ['', 'primary', 'info', 'warning'],
    },
  },
}

const Template = (args) => ({
  components: { MyChip },
  setup() {
    return { args }
  },
  template: '<my-chip v-bind="args" />',
})

export const Default = Template.bind({})
Default.args = {
  label: 'Connected',
  color: null,
}

export const Primary = Template.bind({})
Primary.args = {
  label: 'Connected',
  color: 'primary',
}

export const Info = Template.bind({})
Info.args = {
  label: 'Connected',
  color: 'info',
}

export const Warning = Template.bind({})
Warning.args = {
  label: 'Connected',
  color: 'warning',
}
