import HoverHint from './HoverHint.vue'

export default {
  title: 'App Components/HoverHint',
  component: HoverHint,
  argTypes: {},
}

const Template = (args) => ({
  components: { HoverHint },
  setup() {
    return { args }
  },
  template: `
  <div class="m-10">
    <hover-hint v-bind="args">
      <img class="w-10 h-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
      <template #content>
        <span class="text-body text-white">Margaret Atwood</span>
      </template>
    </hover-hint>
  </div>
  `,
})

export const Default = Template.bind({})
Default.args = {}
