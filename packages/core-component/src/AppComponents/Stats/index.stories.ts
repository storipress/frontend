import SpStats from './Stats.vue'

export default {
  title: 'App Components/Stats',
  component: SpStats,
  argTypes: {
    Stats: { control: { labels: { '': 'default' } } },
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

const Template = (args) => ({
  components: { SpStats },
  setup() {
    return { args }
  },
  template: /* html */ `
    <sp-stats
      v-bind="args"
      class="w-64"
    />
  `,
})

export const Default = Template.bind({})
Default.args = {
  title: 'Total subscribers',
  content: '24',
  percentageValue: 12,
  afterword: 'monthly',
}

export const ValueDecrease = Template.bind({})
ValueDecrease.args = {
  title: 'Email opens this month',
  content: '37',
  percentageValue: -12,
  afterword: 'monthly',
}

export const NotSetAfterword = Template.bind({})
NotSetAfterword.args = {
  title: 'Revenue this month',
  content: 'US$35.00',
  percentageValue: 104,
}

export const TextInfo = Template.bind({})
TextInfo.args = {
  title: 'Signup source',
  content: 'Twitter',
}
