import AutoSizeInput from './auto-size-input.vue'

export default {
  title: 'Common/AutoSizeInput',
  component: AutoSizeInput,
}

function Template(args, { argTypes }) {
  return {
    props: Object.keys(argTypes),
    components: { AutoSizeInput },
    template: '<auto-size-input class="w-full" :type="type" />',
  }
}

export const Default = Template.bind({})
Default.args = { type: 'input' }

export const TextArea = Template.bind({})
TextArea.args = { type: 'textarea' }
