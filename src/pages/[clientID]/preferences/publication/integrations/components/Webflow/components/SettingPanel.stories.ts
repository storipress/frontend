import { ref } from 'vue'
import BasicDialog from './BasicDialog.vue'
import SettingPanel from './SettingPanel.vue'

export default {
  title: 'Webflow/Panel',
  component: BasicDialog,
}

function Template(args) {
  return {
    components: { BasicDialog, SettingPanel },
    setup() {
      const enabled = ref(true)
      const closeModel = () => (enabled.value = !enabled.value)
      return { args, enabled, closeModel }
    },
    template: /* html */ `
      <BasicDialog v-model="enabled" @closeModel="closeModel" >
        <SettingPanel />
      </BasicDialog>
    `,
  }
}

export const Setting = Template.bind({})
