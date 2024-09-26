import type { Story } from '@storybook/vue3'
import { h } from 'vue'
import { action } from '@storybook/addon-actions'
import NewArticle from './new-article.vue'

export default {
  title: 'Global/NewArticle',
  component: NewArticle,
}

const submitAction = action('submit')

const Template: Story = (args, { argTypes }) => ({
  props: Object.keys(argTypes),

  setup() {
    return () => h(NewArticle, { modelValue: true, publication: 'New York Times', ...args, onSubmit: submitAction })
  },
})

export const Default: Story = Template.bind({})
Default.args = {
  initialTitle: 'What’s at Stake for the Global Economy as Conflict Looms in Ukraine',
  initialBlurb:
    'Countries that depend on the region’s rich supply of energy, wheat, nickel and other staples could feel the pain of price spikes.',
}

export const WithDesk: Story = Template.bind({})
WithDesk.args = {
  initialTitle: 'What’s at Stake for the Global Economy as Conflict Looms in Ukraine',
  initialDesk: {
    id: '1',
    name: 'Test 2',
    slug: 'tutorial',
    __typename: 'Desk',
  },
}
WithDesk.parameters = {
  chromatic: { disableSnapshot: true },
}

export const Empty: Story = Template.bind({})
Empty.args = {}
Empty.parameters = {
  chromatic: { disableSnapshot: true },
}
