import type { Story } from '@storybook/vue3'
import { ref } from 'vue'
import { userEvent, within } from '@storybook/test'
import PageLoadingMask from './index'

export default {
  title: 'App Shell/PageLoadingMask',
  decorators: [
    (story) => ({
      components: { story },
      template: '<div style="width:100vw;height:100vh;margin:-16px;"><story /></div>',
    }),
  ],
  component: PageLoadingMask,
  argTypes: {
    show: {
      name: 'show',
      type: { required: false },
      defaultValue: false,
      control: { type: 'boolean' },
    },
  },
}

const Template: Story = (args, { argTypes }: { argTypes: object }) => ({
  props: Object.keys(argTypes),
  components: { PageLoadingMask },
  setup: () => {
    const argsRef = ref(args)
    return {
      argsRef,
      onToggle() {
        argsRef.value.show = !argsRef.value.show
        setTimeout(() => {
          argsRef.value.show = !argsRef.value.show
        }, 3000)
      },
    }
  },
  template: `
    <div>
      <button data-testid="trigger" @click="onToggle">Click</button>
      <PageLoadingMask v-bind="argsRef">
        <template #loading-icon>Loading, close after 3 seconds</template>
      </PageLoadingMask>
    </div>
  `,
})

export const Default = Template.bind({})
Default.args = {
  show: false,
  visible: true,
}
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByTestId('trigger')
  await userEvent.click(trigger)
}

export const NonVisibleMask = Template.bind({})
NonVisibleMask.args = {
  show: false,
  visible: false,
}
NonVisibleMask.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByTestId('trigger')
  await userEvent.click(trigger)
}
