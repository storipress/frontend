import { Popover } from './index'

export default {
  title: 'App Components/Popover',
  component: Popover,
  parameters: {
    backgrounds: {
      values: [
        { name: 'light', value: '#fff' },
        { name: 'gray', value: '#f5f5f4' },
        { name: 'dark', value: '#000' },
      ],
    },
  },
}

export const Template = (args?: any) => ({
  components: { Popover },
  setup() {
    return { args }
  },
  template: /* html */ `
    <div>
      <h1 class="my-4">Popover title</h1>
      <popover v-bind="$attrs" @click.stop>
        <slot>
          <button
            class="text-button rounded px-4 py-2.5 bg-teal-700 text-white"
          >
            {{ args.button }}
          </button>
        </slot>
        <template #content>
          <slot name="content">
            <div class="p-2.5">
              {{ args.content }}
            </div>
          </slot>
        </template>
      </popover>
    </div>
  `,
})
Template.args = null as any

export const Default = Template.bind({})
Default.args = {
  button: 'Popover Button',
  content: 'Popover Content',
}
