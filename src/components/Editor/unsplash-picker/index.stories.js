import { h } from 'vue'
import { action } from '@storybook/addon-actions'
import Picker from './picker.vue'
import { createUnsplashClient } from '~/utils/editor/clients/unsplash'

export default {
  title: 'Editor/UnsplashPicker',
  component: Picker,
}

const onReply = action('onReply')

function Template(args, { argTypes }) {
  return {
    props: Object.keys(argTypes),

    setup() {
      const client = createUnsplashClient('')

      return () => h(Picker, { open: true, client, onReply })
    },
  }
}

export const Default = Template.bind({})
