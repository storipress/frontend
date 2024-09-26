import { ref } from 'vue'
import Pagination from './Pagination.vue'

export default {
  title: 'App Components/Pagination',
  component: Pagination,
  argTypes: {
    Pagination: { control: { labels: { '': 'default' } } },
  },
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

const Template = (args) => ({
  components: { Pagination },
  setup() {
    const modelValue = ref(args.modelValue)
    return { modelValue, args }
  },
  template: /* html */ `
    <div class="flex justify-end">
      <Pagination
        v-model="modelValue"
        :pageLength="args.pageLength"
      />
    </div>
  `,
})

export const Default = Template.bind({})
Default.args = {
  pageLength: 10,
  modelValue: 1,
}
export const NoPagination = Template.bind({})
NoPagination.args = {
  pageLength: 0,
  modelValue: 0,
}
export const UnnecessaryEllipsisIcon = Template.bind({})
UnnecessaryEllipsisIcon.args = {
  pageLength: 5,
  modelValue: 1,
}
