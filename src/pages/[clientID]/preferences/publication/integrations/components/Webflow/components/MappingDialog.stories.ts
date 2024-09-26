import { defineComponent, h } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import MappingDialog from './MappingDialog.vue'
import BasicDialog from './BasicDialog.vue'

const meta: Meta = {
  title: 'Webflow/MappingDialog',
  component: MappingDialog,
}

export default meta

type Story = StoryObj<typeof MappingDialog>

const candidates = [
  { name: 'Storipress field 1', value: 'body' },
  { name: 'Storipress field 2', value: 'blurb' },
  { name: 'Storipress field 3', value: 'cover' },
  { name: 'Storipress field 4', value: 'headline' },
]
const collectionFields = [
  {
    id: '0',
    displayName: 'Field 1',
    isRequired: false,
    type: '',
    candidates,
  },
  {
    id: '1',
    displayName: 'Field 2',
    isRequired: false,
    type: 'reference',
    candidates,
  },
  {
    id: '2',
    displayName: 'Field 3',
    isRequired: false,
    type: '',
    candidates,
  },
  {
    id: '3',
    displayName: 'Field 4',
    isRequired: true,
    type: '',
    candidates,
  },
]

export const Content: Story = {
  render: (args, { argTypes }) =>
    defineComponent({
      props: Object.keys(argTypes),
      setup() {
        return () => h(MappingDialog, { ...args, onClickNext: action('onClickNext') })
      },
    }),
  args: {
    collectionType: 'blog',
    collectionName: 'blog collection',
    collectionFields,
    collectionMapping: '{"0":null,"1":"body","2":null}',
  },
}

export const WithDialog: Story = {
  render: (args, { argTypes }) =>
    defineComponent({
      props: Object.keys(argTypes),
      setup() {
        return () =>
          h(
            BasicDialog,
            {
              modelValue: true,
              'onUpdate:modelValue': action('update:modelValue'),
              onClickNext: action('onClickNext'),
            },
            [h(MappingDialog, args)],
          )
      },
    }),
  args: {
    collectionType: 'blog',
    collectionName: 'blog collection',
    collectionFields,
    collectionMapping: '{"0":null,"1":"body","2":null}',
  },
}
