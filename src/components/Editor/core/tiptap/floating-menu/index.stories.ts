import { h } from 'vue'
import { action } from '@storybook/addon-actions'
import FloatingMenuCard from './floating-menu-card.vue'

export default {
  title: 'Editor/BlockMenu',
  component: FloatingMenuCard,
}

const onApplyOn = action('onApplyOn')
const onApplyCommand = action('onApplyCommand')

export function Default() {
  return {
    setup: () => {
      return () => h(FloatingMenuCard, { onApplyCommand, onApplyOn })
    },
  }
}
