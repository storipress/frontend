import Snackbar from './index.vue'
import { action } from '@storybook/addon-actions'

export default {
  title: 'App Components/Snackbar',
  component: Snackbar,
  argTypes: {},
}

const TemplateSnackbar = (args) => ({
  components: { Snackbar },
  setup() {
    return {
      args,
      onClick: action('click'),
      onSnackbarAction: action('snackbar-action'),
    }
  },
  template: `
  <div>
    <button class="border p-2" @click="onClick">Button Can Click</button>
    <button class="fixed border p-2 left-0 bottom-0 mb-2 ml-2" @click="onClick">Button Can Click</button>
    <Snackbar v-bind="args" @button-click="onSnackbarAction" />  
  </div>
  `,
})

export const SnackbarSuccess = TemplateSnackbar.bind({})
SnackbarSuccess.args = {
  title: 'Snackbar Text',
  type: 'primary',
  buttonText: 'Action',
}

export const SnackbarInfo = TemplateSnackbar.bind({})
SnackbarInfo.args = {
  title: 'Snackbar Text',
  type: 'info',
  buttonText: 'Action',
}

export const SnackbarWarning = TemplateSnackbar.bind({})
SnackbarWarning.args = {
  title: 'Snackbar Text',
  type: 'warning',
  buttonText: 'Action',
}
