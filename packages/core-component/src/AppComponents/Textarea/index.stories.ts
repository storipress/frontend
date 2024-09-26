import { ref } from 'vue'
import Textarea from './index.vue'

export default {
  title: 'App Components/Textarea',
  component: Textarea,
  argTypes: {},
}

const Template = (args) => ({
  components: { Textarea },
  setup() {
    const textareaValue = ref('')
    return { args, textareaValue }
  },
  template: `
    <Textarea v-bind="args" v-model="textareaValue" />
  `,
})

export const Default = Template.bind({})
Default.args = {
  label: 'author-byline',
  placeholder:
    'A short paragraph that tells readers a little bit about you as an author, and how to contact the author or read additional content by the author.',
  textareaId: 'textarea-id',
  textareaHeight: 'h-52',
  resize: 'resize-none',
}

export const WithCharacterCounting = Template.bind({})
WithCharacterCounting.args = {
  placeholder: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
  htmlName: 'textarea-count',
  resize: 'resize-y',
  showCount: true,
}
