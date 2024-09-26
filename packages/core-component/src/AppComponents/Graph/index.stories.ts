import { within } from '@storybook/test'
import SpGraph from './Graph.vue'
import { generateRevenue, generateSubscribers } from './fakeData'

export default {
  title: 'App Components/Graph',
  component: SpGraph,
  argTypes: {
    Graph: { control: { labels: { '': 'default' } } },
  },
  parameters: {
    backgrounds: {
      values: [
        { name: 'light', value: '#fff' },
        { name: 'gray', value: '#f5f5f4' },
        { name: 'dark', value: '#000' },
      ],
    },
  },
}

function Template(args) {
  return {
    components: { SpGraph },
    setup() {
      return { args }
    },
    template: /* html */ `
    <sp-graph
      v-bind="args"
      class="max-w-[54rem]"
      :animation="false"
    />
  `,
  }
}

export const Default = Template.bind({})
Default.args = {
  subscribers: generateSubscribers(100, '2020-08-01'),
  revenue: generateRevenue(8, '2020-08-01'),
}
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await canvas.findByRole(
    'img',
    {
      name: /animation end/i,
    },
    { timeout: 15000 },
  )
}

export const FillingData = Template.bind({})
FillingData.args = {
  subscribers: generateSubscribers(10, '2020-08-01'),
  revenue: generateRevenue(10, '2020-08-01'),
}

export const NoData = Template.bind({})
NoData.args = {
  subscribers: [],
  revenue: [],
  today: '2020-08-01',
}

export const BigData = Template.bind({})
BigData.args = {
  subscribers: generateSubscribers(505, '2017-08-01'),
  revenue: generateRevenue(505, '2017-08-01'),
}
