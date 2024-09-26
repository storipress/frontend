import type { Story } from '@storybook/vue3'
import { h } from 'vue'
import type { UnscheduledArticle } from '../definitions'
import { dayjs } from '../ArticleCard/dayjs'
import SchedulerNavigation from './scheduler-navigation.vue'

export default {
  title: 'Schedule/CalendarNavigation',
  component: SchedulerNavigation,
  parameters: {
    featureFlags: ['scheduler-navigation-switch'],
  },
}

const Template: Story = (args, { argTypes }) => ({
  props: Object.keys(argTypes),

  setup() {
    return () =>
      h(SchedulerNavigation, {
        ...args,
        class: 'max-w-[15rem] max-h-[47.75rem]',
      })
  },
})

const stages = [
  {
    id: '1',
    name: 'Ideas',
    color: 'rgb(234 179 8)',
    order: 1,
  },
  {
    id: '2',
    name: 'Review',
    color: 'rgb(3 105 161)',
    order: 2,
  },
  {
    id: '3',
    name: 'For Publication',
    color: 'rgb(22 163 74)',
    order: 3,
  },
]

const authors = [
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
]

const articles: Omit<UnscheduledArticle, 'editable' | 'desk' | 'updatedAt'>[] = [
  {
    id: '2',
    authors,
    title: 'The second article',
    scheduledAt: undefined,
    stage: stages[0],
  },
  {
    id: '1',
    authors,
    title: 'The first article',
    scheduledAt: undefined,
    stage: stages[0],
  },
  {
    id: '4',
    authors,
    title: 'The forth article',
    scheduledAt: undefined,
    stage: stages[0],
  },
  {
    id: '3',
    authors,
    title: 'The third article',
    scheduledAt: undefined,
    stage: stages[0],
  },
  {
    id: '5',
    authors,
    title: 'The fifth article',
    scheduledAt: undefined,
    stage: stages[0],
  },
  {
    id: '6',
    authors,
    title: 'When click on the expand of this cell',
    scheduledAt: undefined,
    stage: stages[0],
  },
  {
    id: '7',
    authors,
    title: 'It should go to week view',
    scheduledAt: undefined,
    stage: stages[0],
  },
  {
    id: '8',
    authors,
    title: 'But the week view is not implemented yet',
    scheduledAt: undefined,
    stage: stages[0],
  },
  {
    id: '9',
    authors,
    title: 'So it do nothing',
    scheduledAt: undefined,
    stage: stages[0],
  },
  {
    id: '10',
    authors,
    title: 'The fifth article',
    scheduledAt: undefined,
    stage: stages[0],
  },
  {
    id: '11',
    authors,
    title: 'The sixth article',
    scheduledAt: undefined,
    stage: stages[0],
  },
  {
    id: '12',
    authors,
    title: 'single article',
    scheduledAt: undefined,
    stage: stages[0],
  },
]

export const Default: Story = Template.bind({})

Default.args = {
  today: dayjs(new Date(2022, 1, 23)),
  articles,
}
