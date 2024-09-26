import { ref } from 'vue'
import AutoComplete from './index.vue'

export default {
  title: 'App Components/AutoComplete',
  component: AutoComplete,
  argTypes: {},
}

const desks = [
  'World',
  'Politics',
  'Business',
  'Opinion',
  'Tech',
  'Science',
  'Health',
  'Sports',
  'Arts',
  'Books',
  'Style',
  'Food',
]

const desksTest = [
  { name: 'World' },
  { name: 'Business' },
  { name: 'Opinion' },
  { name: 'Tech' },
  { name: 'Science' },
  { name: 'Health' },
  { name: 'Sports' },
  { name: 'Arts' },
  { name: 'Books' },
  { name: 'Style' },
  { name: 'Food' },
  { name: 'Video' },
]

const Template = (args: any) => ({
  components: { AutoComplete },
  setup() {
    const inputValue = ref('')
    return { args, inputValue, desks, desksTest }
  },
  template: 'inputValue: {{inputValue}}<AutoComplete v-bind="args" class="w-72"  v-model="inputValue" />',
})
Template.args = null as any

export const SelectWithLabelTypeahead = Template.bind({})
SelectWithLabelTypeahead.args = {
  label: 'Desk name',
  placeholder: 'World News',
  items: desks,
}

export const SelectWithoutLabelTypeahead = Template.bind({})
SelectWithoutLabelTypeahead.args = {
  placeholder: 'e.g. example.com',
  items: desksTest,
  optionLabelProp: 'name',
}
