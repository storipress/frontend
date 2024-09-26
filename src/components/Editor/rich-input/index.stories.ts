import { ref } from 'vue'
import RichInput from './rich-input.vue'

export default {
  title: 'EditorCore/RichInput',
  component: RichInput,
  argTypes: {
    RichInput: { control: { labels: { '': 'default' } } },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
    backgrounds: {
      values: [
        { name: 'light', value: '#fff' },
        { name: 'gray', value: '#f5f5f4' },
        { name: 'dark', value: '#000' },
      ],
    },
  },
}

function Template(args) {
  return {
    components: { RichInput },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: /* html */ `
    <div>
      <rich-input
        v-model="value"
        :placeholder="args.placeholder"
        class="mt-16"
      />
    </div>
  `,
  }
}

export const Default = Template.bind({})
Default.args = {
  placeholder: 'Type caption for image (optional)',
  modelValue: 'Type caption for image (optional)',
}
