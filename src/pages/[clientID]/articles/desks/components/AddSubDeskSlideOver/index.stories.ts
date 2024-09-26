import type { Story } from '@storybook/vue3'
import { reactive } from 'vue'
import { userEvent, within } from '@storybook/test'
import { action } from '@storybook/addon-actions'
import type { EventSubmitDataInterface } from './index'
import AddSubDeskSlideOver from './index'

export default {
  title: 'Pages/Articles/Components/desk settings',
  decorators: [
    (story) => ({
      components: { story },
      template: '<div style="width:100vw;height:100vh;margin:-16px;"><story /></div>',
    }),
  ],
}

const Template: Story = (args) => ({
  components: { AddSubDeskSlideOver },
  template: `
    <div>
      <AddSubDeskSlideOver
        v-bind="data"
        @close="closeSlideOver"
        @submit="submit"
      />
      <button data-testid="trigger" @click="data.show = !data.show" class="bg-gray-300">
        Click me
      </button>
      <pre>
        name: {{data.name}}
      </pre>
    </div>
  `,
  setup() {
    const data = reactive(args)
    return {
      data,
      closeSlideOver() {
        action('close')()
        data.show = false
      },
      submit(eventData: EventSubmitDataInterface) {
        action('submit')(eventData)
        data.name = eventData.name
        data.loading = true
        setTimeout(() => (data.loading = false), 1000)
      },
    }
  },
})

export const CreateSubDesk = Template.bind({})
CreateSubDesk.args = {
  show: false,
  loading: false,
  parent: { id: '0', name: 'Business' },
}
CreateSubDesk.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByTestId('trigger')
  await userEvent.click(trigger)
}
