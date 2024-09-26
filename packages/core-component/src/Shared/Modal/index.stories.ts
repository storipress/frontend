import { ref } from 'vue'
import MyModal from './index.vue'

export default {
  title: 'App Components/Modals',
  component: MyModal,
  argTypes: {
    onClick: {},
  },
}

const Template = (args) => ({
  components: { MyModal },
  setup() {
    const visible = ref(true)
    function onModalClose() {
      visible.value = false
    }
    return { args, visible, onModalClose }
  },
  template: '<my-modal v-bind="args" :visible="visible" @onModalClose="onModalClose">{{ args.default }}</my-modal>',
})

export const Info = Template.bind({})
Info.args = {
  okText: 'Suspend',
  cancelText: 'Cancel',
  title: 'Suspend user(s)',
  default:
    'Are you sure you want to delete this desk and all the articles in it? All article data will be permanently removed from our servers forever. This action cannot be undone.',
  type: 'info',
}

export const Warning = Template.bind({})
Warning.args = {
  okText: 'Delete',
  cancelText: 'Cancel',
  title: 'Delete user(s)',
  default:
    'Are you sure you want to delete this desk and all the articles in it? All article data will be permanently removed from our servers forever. This action cannot be undone.',
  type: 'warning',
}
