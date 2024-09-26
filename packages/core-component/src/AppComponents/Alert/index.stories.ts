import Alert from './index.vue'

export default {
  title: 'App Components/Alert',
  component: Alert,
  argTypes: {},
}

const TemplateAlert = (args) => ({
  components: { Alert },
  setup() {
    return { args }
  },
  template: '<Alert v-bind="args" class="w-[29rem]" />',
})

export const AlertInfo = TemplateAlert.bind({})
AlertInfo.args = {
  message: 'We won’t charge you until your free trial ends on 28 March.',
  description: 'It’s all part of our fair billing policy ❤️',
}

export const AlertWarning = TemplateAlert.bind({})
AlertWarning.args = {
  type: 'warning',
  message: 'You’ve reached the maximum amount of publications on your plan.',
  description: 'Delete a publication or upgrade to add more.',
}

export const AlertDanger = TemplateAlert.bind({})
AlertDanger.args = {
  type: 'danger',
  message: 'There was an error adding your card',
  description: 'We could not verify your credit card. Transaction declined.',
}
