import Notifications from './Notifications.vue'
import { ref, watch } from 'vue'

export default {
  title: 'App Components/Notifications',
  component: Notifications,
  argTypes: {},
}

const Template = (args) => ({
  components: { Notifications },
  setup() {
    const show = ref(true)
    const closeNotification = () => {
      show.value = false
    }

    // To automatically reappear after closing in Chromatic
    watch(show, (val) => {
      if (!val) {
        setTimeout(() => {
          show.value = true
        }, 800)
      }
    })

    return { args, show, closeNotification }
  },
  template: `
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex flex-col justify-end gap-4 p-4"
  >
    <notifications v-bind="args" :show="show" :close-notification="closeNotification">
      {{ args.default }}
    </notifications>
  </div>
  `,
})

export const NotificationPrimary = Template.bind({})
NotificationPrimary.args = {
  title: 'Successfully saved!',
  type: 'primary',
  default: 'Lorem ipsum dolor sit amet consectetur adipisicing elit olumptatum tenetur',
}

export const NotificationInfo = Template.bind({})
NotificationInfo.args = {
  title: 'Successfully saved!',
  type: 'info',
  iconName: 'question-mark-inverse',
  okText: 'Undo',
  cancelText: 'Dismiss',
}

export const NotificationWarning = Template.bind({})
NotificationWarning.args = {
  title: 'Successfully saved!',
  type: 'warning',
  iconName: 'warning',
  default: 'Lorem ipsum dolor sit amet consectetur adipisicing elit olumptatum tenetur',
  okText: 'Undo',
  cancelText: 'Dismiss',
}
