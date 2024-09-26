import { linkTo } from '@storybook/addon-links'
import { action } from '@storybook/addon-actions'
import ArticleCard from './article-card.vue'
import { dayjs } from './dayjs'

/**
 * @type {import('../definitions').Stage[]}
 */
const stages = [
  {
    id: '1',
    name: 'Ideas',
    color: 'rgb(234 179 8)',
  },
  {
    id: '2',
    name: 'Review',
    color: 'rgb(3 105 161)',
  },
  {
    id: '3',
    name: 'For Publication',
    color: 'rgb(22 163 74)',
  },
]

export default {
  title: 'Schedule/ArticleCard',
  component: ArticleCard,
  argTypes: {
    stage: {
      control: {
        type: 'select',
        labels: {
          '1': 'Idea',
          '2': 'For review',
          '3': 'Editor reviewed',
        },
      },
      options: ['1', '2', '3'],
    },
  },
}

const logSchedule = action('schedule')
const toSchedule = linkTo('Schedule/ArticleCard', 'Scheduled')

function Template(args, { argTypes }) {
  return {
    props: Object.keys(argTypes),
    components: { ArticleCard },
    setup: () => ({
      args,
      onSchedule: (...args) => {
        logSchedule(...args)
        toSchedule(...args)
      },
      onUnscheduled: linkTo('Schedule/ArticleCard', 'Unschedule'),
      onDelete: action('delete'),
    }),
    template: '<ArticleCard v-bind="args" @schedule="onSchedule" @unschedule="onUnscheduled" @delete="onDelete" />',
  }
}

const article = {
  title: '<p>I Pretended To Be An Influencer & All I Got Was Thousands Of Likes</p>',
  stage: stages[0],
  editable: true,
  authors: [
    {
      id: '1',
      name: 'Fred Fredster',
      avatar: 'https://i.pravatar.cc/300?u=d',
    },
    {
      id: '2',
      name: 'Jerome Touffle-Blin',
      avatar: 'https://i.pravatar.cc/300?u=e',
    },
    {
      id: '3',
      name: 'Jeremy Renner',
      avatar: 'https://i.pravatar.cc/300?u=c',
    },
  ],
}

export const Unscheduled = Template.bind({})

Unscheduled.storyName = 'Unscheduled Article Card'
Unscheduled.args = {
  article,
  stages,
  stage: '1',
  today: dayjs(new Date(2022, 1, 17, 10, 0, 0)),
}

export const Scheduled = Template.bind({})

Scheduled.storyName = 'Scheduled Article Card'
Scheduled.args = {
  article: {
    ...article,
    // give a fixed time so it won't change
    scheduledAt: new Date(2022, 1, 1, 12, 0, 0),
  },
  stages,
  stage: '1',
}
