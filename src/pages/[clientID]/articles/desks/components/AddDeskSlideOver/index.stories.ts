import type { Story } from '@storybook/vue3'
import { reactive } from 'vue'
import { userEvent, within } from '@storybook/test'
import { action } from '@storybook/addon-actions'

import type { EventSubmitDataInterface } from './index'
import AddDeskSlideOver from './index'

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
  components: { AddDeskSlideOver },
  template: `
    <div>
      <AddDeskSlideOver
        v-bind="data"
        @close="closeSlideOver"
        @submit="submit"
      />
      <button data-testid="trigger" @click="data.show = !data.show" class="bg-gray-300">
        Click me
      </button>
    </div>
  `,
  setup() {
    const data = reactive({ show: false, loading: false, ...args })
    const actionClose = action('close')
    const actionSubmit = action('submit')
    return {
      data,
      closeSlideOver() {
        data.show = false
        actionClose()
      },
      submit(newData: EventSubmitDataInterface) {
        actionSubmit(newData)
        data.loading = true
        setTimeout(() => (data.loading = false), 1000)
      },
    }
  },
})

export const CreateDesk = Template.bind({})
CreateDesk.args = {
  loading: false,
}
CreateDesk.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByTestId('trigger')
  await userEvent.click(trigger)
}
