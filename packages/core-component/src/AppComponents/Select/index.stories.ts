import { ref } from 'vue'
import { action } from '@storybook/addon-actions'
import MySelect from './Select.vue'
import SelectTypeahead from './SelectTypeahead.vue'
import LineInputTypeaheadNoImage from './LineInputTypeahead/WithoutImage.vue'
import LineInputTypeaheadImage from './LineInputTypeahead/WithImage.vue'

export default {
  title: 'App Components/Select',
  component: MySelect,
  argTypes: {},
}

const desks = [
  'All',
  'World',
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
  'Video',
]

const people = [
  {
    name: 'Madeline Miltons',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'a_user@test.com',
  },
  {
    name: 'Marc Benioff',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'b_user@test.com',
  },
  {
    name: 'Mark Banks',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'c_user@test.com',
  },
  {
    name: 'Macklemore Lewis',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'd_user@test.com',
  },
  {
    name: 'Maraja Buhton',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'e_user@test.com',
  },
  {
    name: 'James Miltons',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'f_user@test.com',
  },
  {
    name: 'Robert Victoria',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'g_user@test.com',
  },
  {
    name: 'Zoe Hill',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'h_user@test.com',
  },
  {
    name: 'John Ruth',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'i_user@test.com',
  },
  {
    name: 'Michael Joan',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'j_user@test.com',
  },
  {
    name: 'Simon Roger',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'k_user@test.com',
  },
  {
    name: 'William Keith',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'l_user@test.com',
  },
  {
    name: 'Abby Dylan',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'm_user@test.com',
  },
]

function Template(args) {
  return {
    components: { MySelect },
    setup() {
      const desks = [
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

      const selected = ref()
      return {
        args,
        desks,
        selected,
        onUpdateInputValue: action('update:inputValue'),
      }
    },
    template:
      '<my-select v-bind="args" :items="desks" v-model="selected" :default-value="desks[0]" class="w-72" option-label-prop="name" @update:input-value="onUpdateInputValue" />',
  }
}

export const SelectWithLabel = Template.bind({})
SelectWithLabel.args = {
  label: 'Desk name',
}

export const SelectWithoutLabel = Template.bind({})
SelectWithoutLabel.args = {}

export function MultiselectWithLabel(args) {
  return {
    components: { SelectTypeahead },
    setup() {
      const selected = ref([])
      return {
        args,
        desks,
        selected,
        onUpdateInputValue: action('update:inputValue'),
      }
    },
    template:
      '<SelectTypeahead v-bind="args" label="Desk name" :items="desks" placeholder="Tags" v-model="selected" @update:input-value="onUpdateInputValue" />',
  }
}

export function MultiselectWithoutLabelWithImage(args) {
  return {
    components: { SelectTypeahead },
    setup() {
      const selected = ref([])
      return { args, people, selected }
    },
    template: `
  <SelectTypeahead v-bind="args" :items="people" placeholder="People" option-label-prop="name" v-model="selected">
    <template #default="{ item, boldMatchText, itemProjection }">
      <img class="rounded-xl mr-2.5 w-6 h-6" :src="item.image" alt="" />
      <span v-html="boldMatchText(itemProjection(item))"></span>
    </template>
  </SelectTypeahead>
  `,
  }
}

export function AllowSearchByOtherFilter(args) {
  return {
    components: { SelectTypeahead },
    setup() {
      const selected = ref([])
      return { args, people, selected }
    },
    template: `
  <SelectTypeahead v-bind="args" :items="people" placeholder="People" option-label-prop="name" additional-filters="email" v-model="selected" />
  `,
  }
}

export function MultiselectLine(args) {
  return {
    components: { LineInputTypeaheadNoImage },
    setup() {
      return { args }
    },
    template: '<LineInputTypeaheadNoImage v-bind="args" />',
  }
}

export function MultiselectWithImageLine(args) {
  return {
    components: { LineInputTypeaheadImage },
    setup() {
      return { args }
    },
    template: `
  <LineInputTypeaheadImage v-bind="args" />
  `,
  }
}

export function MultiselectAddTag(args) {
  return {
    components: { SelectTypeahead },
    setup() {
      const selected = ref([])
      return {
        args,
        desks,
        selected,
        onUpdateInputValue: action('update:inputValue'),
        onBlur: action('blur'),
      }
    },
    template:
      '<SelectTypeahead v-bind="args" label="Desk name" :items="desks" placeholder="Tags" v-model="selected" type="inputTag" @update:input-value="onUpdateInputValue" @blur="onBlur" />',
  }
}

export function MultiselectAddTagWithDefaultValue(args) {
  return {
    components: { SelectTypeahead },
    setup() {
      const selected = ref()
      const defaultValue = ref(['Opinion', 'Tech', 'Science', 'Health'])

      return {
        args,
        desks,
        selected,
        defaultValue,
        onUpdateInputValue: action('update:inputValue'),
        onBlur: action('blur'),
      }
    },
    template:
      '<SelectTypeahead v-bind="args" label="Desk name" :items="desks" placeholder="Tags" v-model="selected" :default-value="defaultValue" type="inputTag" @update:input-value="onUpdateInputValue" @blur="onBlur" />',
  }
}

export function MultiselectWithAllOption(args) {
  return {
    components: { SelectTypeahead },
    setup() {
      const selected = ref([])
      return {
        args,
        desks,
        selected,
        onUpdateInputValue: action('update:inputValue'),
      }
    },
    template: `
    selected: {{ selected }}
    <SelectTypeahead
      v-model="selected" 
      v-bind="args"
      label="Desk name"
      :items="desks"
      placeholder="Tags"
      allOption
      checkbox
      placementLeft
      class="w-[20rem]"
      @update:input-value="onUpdateInputValue"
    />
  `,
  }
}

export function MultiselectObjectWithAllOption(args) {
  return {
    components: { SelectTypeahead },
    setup() {
      const desks = [
        { name: 'All' },
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
      const selected = ref([])
      return {
        args,
        desks,
        selected,
        onUpdateInputValue: action('update:inputValue'),
      }
    },
    template: `
    selected: {{ selected }}
    <SelectTypeahead
      v-model="selected" 
      v-bind="args"
      label="Desk name"
      :items="desks"
      option-label-prop="name"
      placeholder="Tags"
      allOption
      checkbox
      placementLeft
      class="w-[20rem]"
      @update:input-value="onUpdateInputValue"
    />
  `,
  }
}

export function MultiselectObjectWithSameValue(args) {
  return {
    components: { SelectTypeahead },
    setup() {
      const desks = [
        { name: 'All', id: 0 },
        { name: 'World', id: 1 },
        { name: 'World', id: 2 },
        { name: 'World', id: 3 },
        { name: 'World', id: 4 },
        { name: 'Business', id: 5 },
        { name: 'Opinion', id: 6 },
        { name: 'Tech', id: 7 },
        { name: 'Science', id: 8 },
        { name: 'Health', id: 9 },
        { name: 'Sports', id: 10 },
        { name: 'Arts', id: 11 },
        { name: 'Books', id: 12 },
        { name: 'Style', id: 13 },
        { name: 'Food', id: 14 },
        { name: 'Video', id: 15 },
      ]
      const selected = ref([])
      const defaultValue = ref([
        { name: 'World', id: 2 },
        { name: 'World', id: 3 },
        { name: 'World', id: 4 },
        { name: 'Business', id: 5 },
      ])

      return {
        args,
        desks,
        selected,
        defaultValue,
        onUpdateInputValue: action('update:inputValue'),
      }
    },
    template: `
    selected: {{ selected }}
    <SelectTypeahead
      v-model="selected" 
      v-bind="args"
      label="Desk name"
      :items="desks"
      :defaultValue="defaultValue"
      unique-key="id"
      option-label-prop="name"
      placeholder="Tags"
      allOption
      checkbox
      placementLeft
      class="w-[20rem]"
      @update:input-value="onUpdateInputValue"
    />
  `,
  }
}
