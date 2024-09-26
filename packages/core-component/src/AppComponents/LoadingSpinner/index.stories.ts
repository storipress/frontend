import LoadingSpinner from './index.vue'

export default {
  title: 'App Components/LoadingSpinner',
  component: LoadingSpinner,
}

const TemplateSpinner = (args) => ({
  components: { LoadingSpinner },

  setup() {
    return { args }
  },
  template: `
  <div class="w-fit">
    <LoadingSpinner v-bind="args" show />
  </div>
  `,
})

export const Basic = TemplateSpinner.bind({})
Basic.args = {}

export const CustomizedDescription = TemplateSpinner.bind({})
CustomizedDescription.args = {
  tip: 'Uploading photo...',
  tipColor: 'text-black',
}

export const CustomizedSize = TemplateSpinner.bind({})
CustomizedSize.args = {
  spinWidth: 'w-5',
}
