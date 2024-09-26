import type { Story } from '@storybook/vue3'
import type { Component } from 'vue'
import { computed, h, ref } from 'vue'
import { action } from '@storybook/addon-actions'
import MenuCard from './menu-card.vue'
import { STATE_DIALOG } from './definitions'
import type { ActionableFormat } from './definitions'

export default {
  title: 'Editor',
  component: MenuCard,
}

interface Props {
  activeBlock: string
  nodeState: Record<string, boolean>
  dialog: Component | null
}

const onApplyFormat = action('onApplyFormat')
const onApplyBlockFormat = action('onApplyBlockFormat')
const onComplete = action('onComplete')

const Template: Story<Props> = (args, { argTypes }) => ({
  props: Object.keys(argTypes),

  setup() {
    const nodeState = ref<Record<string, boolean>>({
      bold: false,
      italic: false,
      underline: false,
      comment: false,
      link: false,
    })
    const activeBlock = ref('text')
    const state = ref(null)
    const dialog = computed(() => (state.value ? STATE_DIALOG[state.value] : null))
    function applyFormat(format: ActionableFormat) {
      onApplyFormat(format)

      if (format.type === 'state') {
        state.value = format.state
        return
      }
      state.value = null
      if (format.type === 'action') {
        if (format.actionType === 'block') {
          activeBlock.value = format.key
        } else {
          // special handle for link to align with the real behavior
          if (format.action === 'setLink') {
            nodeState.value.link = true
            return
          } else if (format.action === 'unsetLink') {
            nodeState.value.link = false
            return
          }
          nodeState.value[format.key] = !nodeState.value[format.key]
        }
      }
    }
    return () =>
      h(MenuCard, {
        ...args,
        dialog: dialog.value,
        state: state.value,
        activeBlock: activeBlock.value,
        nodeState: nodeState.value,
        onApplyBlockFormat,
        onApplyFormat: applyFormat,
        onComplete,
      })
  },
})

export const TextMenu: Story<Props> = Template.bind({})
TextMenu.args = {
  activeBlock: 'text',
  nodeState: {
    bold: false,
    italic: false,
    underline: false,
    comment: false,
    link: false,
  },
  dialog: null,
}
