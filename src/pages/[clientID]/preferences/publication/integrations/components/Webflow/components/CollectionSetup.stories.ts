import { defineComponent, h } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import CollectionSetup from './CollectionSetup.vue'
import BasicDialog from './BasicDialog.vue'

const meta: Meta = {
  title: 'Webflow/CollectionSetup',
  component: CollectionSetup,
}

export default meta

type Story = StoryObj<typeof CollectionSetup>

export const Content: Story = {
  render: (args, { argTypes }) =>
    defineComponent({
      props: Object.keys(argTypes),
      setup() {
        return () => h(CollectionSetup, { ...args, onClickNext: action('onClickNext') })
      },
    }),
  args: {
    collectionType: 'blog',
    collectionList: [
      { id: '1', name: 'collection 1' },
      { id: '2', name: 'collection 2' },
    ],
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
            [h(CollectionSetup, args)],
          )
      },
    }),
  args: {
    collectionType: 'blog',
    collectionList: [
      { id: '1', name: 'collection 1' },
      { id: '2', name: 'collection 2' },
    ],
  },
}
