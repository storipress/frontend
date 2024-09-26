import type { Story } from '@storybook/vue3'
import { ref } from 'vue'
import { userEvent, within } from '@storybook/test'
import { action } from '@storybook/addon-actions'
import SlideOver from './index'

export default {
  title: 'App Shell/SlideOver',
  decorators: [
    (story) => ({
      components: { story },
      template: '<div style="width:100vw;height:100vh;margin:-16px;"><story /></div>',
    }),
  ],
  component: SlideOver,
  argTypes: {
    show: {
      name: 'show',
      type: { required: false },
      defaultValue: false,
      description: 'demo description',
      control: { type: 'boolean' },
    },
    clickOutsideToClose: {
      name: 'clickOutsideToClose',
      type: { required: false },
      defaultValue: true,
      description: 'demo description',
      control: { type: 'boolean' },
    },
  },
}

const Template: Story = (args, { argTypes }: { argTypes: object }) => ({
  props: Object.keys(argTypes),
  components: { SlideOver },
  setup: () => {
    const argsRef = ref(args)
    return {
      argsRef,
      onToggle() {
        argsRef.value.show = !argsRef.value.show
      },
      onClose: () => {
        action('close')()
        argsRef.value.show = false
      },
    }
  },
  template: `
    <div>
      <button data-testid="trigger" @click="onToggle">Click</button>
      <SlideOver v-bind="argsRef" @close="onClose">
        <template #footer>
          footer
        </template>
      </SlideOver>
    </div>
  `,
})

export const Default = Template.bind({})
Default.args = {
  title: 'title',
  show: false,
  clickOutsideToClose: true,
}
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByTestId('trigger')
  await userEvent.click(trigger)
}
