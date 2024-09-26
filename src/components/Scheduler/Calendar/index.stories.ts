import type { Story } from '@storybook/vue3'
import { userEvent, waitFor, within } from '@storybook/test'
import { action } from '@storybook/addon-actions'
import { h, onBeforeUnmount, ref } from 'vue'
import { useEventBus } from '@vueuse/core'
import { useSchedulerStore } from '../store'
import type { ScheduledArticle } from '../definitions'
import { ViewTypes } from '../definitions'
import { dayjs } from '../ArticleCard/dayjs'
import { ScheduleEventBus } from '../story-helper'
import Calendar from './calendar.vue'

const store = useSchedulerStore(globalThis.pinia)
store.timezone = 'Asia/Taipei'

export default {
  title: 'Schedule/Calendar',
  component: Calendar,
}

const Template: Story = (args, { argTypes }) => ({
  props: Object.keys(argTypes),

  setup() {
    const viewType = ref(args.viewType)
    const scheduleAction = action('schedule')
    const bus = useEventBus(ScheduleEventBus)
    store.scheduledAt = undefined

    bus.on((value) => {
      scheduleAction(dayjs(value).toString())
    })

    if (args.timezone) {
      store.timezone = args.timezone
    }

    onBeforeUnmount(() => {
      store.timezone = 'Asia/Taipei'
    })

    return () =>
      h(Calendar, {
        ...args,
        articles: args.articles.map((article) => ({
          ...article,
          // convert to specific timezone with same time
          scheduledAt: dayjs.tz(article.scheduledAt, store.timezone).toISOString(),
        })),
        viewType: viewType.value,
        class: 'max-w-[74.125rem] h-[800px] max-h-[46.75rem]',
        'onUpdate:viewType': (value) => (viewType.value = value),
      })
  },
})

const stages = [
  {
    id: '1',
    name: 'Ideas',
    color: 'rgb(234 179 8)',
    order: 0,
    icon: '',
  },
  {
    id: '2',
    name: 'Review',
    color: 'rgb(3 105 161)',
    order: 1,
    icon: '',
  },
  {
    id: '3',
    name: 'For Publication',
    color: 'rgb(22 163 74)',
    order: 2,
    icon: '',
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

const articles: ScheduledArticle[] = [
  {
    id: '2',
    authors,
    title: 'The second article',
    scheduledAt: '2022-02-23T08:00:00.000Z',
    stage: stages[0],
    editable: true,
    desk: { id: '1' },
    updatedAt: 0,
  },
  {
    id: '1',
    authors,
    title: 'The first article',
    scheduledAt: '2022-02-23T07:00:00.000Z',
    stage: stages[0],
    editable: true,
    desk: { id: '1' },
    updatedAt: 0,
  },
  {
    id: '4',
    authors,
    title: 'The forth article',
    scheduledAt: '2022-02-23T10:00:00.000Z',
    stage: stages[0],
    editable: true,
    desk: { id: '1' },
    updatedAt: 0,
  },
  {
    id: '3',
    authors,
    title: 'The third article',
    scheduledAt: '2022-02-23T09:00:00.000Z',
    stage: stages[0],
    editable: true,
    desk: { id: '1' },
    updatedAt: 0,
  },
  {
    id: '5',
    authors,
    title: 'The fifth article',
    scheduledAt: '2022-02-23T11:00:00.000Z',
    stage: stages[0],
    editable: true,
    desk: { id: '1' },
    updatedAt: 0,
  },
  {
    id: '6',
    authors,
    title: 'When click on the expand of this cell',
    scheduledAt: '2022-02-24T08:00:00.000Z',
    stage: stages[0],
    editable: true,
    desk: { id: '1' },
    updatedAt: 0,
  },
  {
    id: '7',
    authors,
    title: 'It should go to week view',
    scheduledAt: '2022-02-24T08:00:00.000Z',
    stage: stages[0],
    editable: true,
    desk: { id: '1' },
    updatedAt: 0,
  },
  {
    id: '8',
    authors,
    title: 'But the week view is not implemented yet',
    scheduledAt: '2022-02-24T08:00:00.000Z',
    stage: stages[0],
    editable: true,
    desk: { id: '1' },
    updatedAt: 0,
  },
  {
    id: '9',
    authors,
    title: 'So it do nothing',
    scheduledAt: '2022-02-24T08:00:00.000Z',
    stage: stages[0],
    editable: true,
    desk: { id: '1' },
    updatedAt: 0,
  },
  {
    id: '10',
    authors,
    title: 'The fifth article',
    scheduledAt: '2022-02-24T08:00:00.000Z',
    stage: stages[0],
    editable: true,
    desk: { id: '1' },
    updatedAt: 0,
  },
  {
    id: '11',
    authors,
    title: 'The sixth article',
    scheduledAt: '2022-02-24T08:00:00.000Z',
    stage: stages[0],
    editable: true,
    desk: { id: '1' },
    updatedAt: 0,
  },
  {
    id: '12',
    authors,
    title: 'single article',
    scheduledAt: '2022-02-25T08:00:00.000Z',
    stage: stages[0],
    editable: true,
    desk: { id: '1' },
    updatedAt: 0,
  },
]

export const MonthView = Template.bind({})

MonthView.args = {
  today: dayjs(new Date(2022, 1, 23)),
  articles,
}

export const OpenArticleLine = Template.bind({})

OpenArticleLine.args = {
  today: dayjs(new Date(2022, 1, 23)),
  articles,
}

OpenArticleLine.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await waitFor(
    async () => {
      const expandButton = await canvas.findByRole<HTMLButtonElement>('button', { name: 'The first article' })
      if (expandButton.disabled) {
        throw new Error('The button is disabled')
      }
    },
    { timeout: 10_000 },
  )

  const expandButton = await canvas.findByRole<HTMLButtonElement>('button', { name: 'The first article' })
  await userEvent.click(expandButton)
  await canvas.findByRole('button', { name: /unschedule/i })
}

// export const OpenExpandedCell = Template.bind({})

// OpenExpandedCell.args = {
//   today: dayjs(new Date(2022, 1, 23)),
//   articles,
// }

// OpenExpandedCell.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement)
//   const expandButton = await canvas.findByRole('button', { name: /\+2 more articles/ }, { timeout: 3000 })
//   await userEvent.click(expandButton)
// }

export const WeekView = Template.bind({})

WeekView.args = {
  today: dayjs(new Date(2022, 1, 23, 0, 20)),
  articles,
  viewType: ViewTypes.FiveDay,
}

export const TokyoTImeZone = Template.bind({})

TokyoTImeZone.args = {
  today: dayjs(new Date(2022, 1, 23, 0, 0)),
  articles,
  timezone: 'Asia/Tokyo',
}

export const ScheduleMode: Story = Template.bind({})

ScheduleMode.args = {
  today: dayjs(new Date(2022, 1, 23, 0, 0)),
  articles,
  newArticle: {
    id: '1',
    title: 'New Article',
    authors,
    editable: true,
    stage: stages[0],
    desk: { id: '1' },
    scheduledAt: undefined,
    updatedAt: 0,
  },
}

ScheduleMode.parameters = {
  chromatic: { disableSnapshot: true },
}

ScheduleMode.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const cell = await canvas.findByRole('cell', { name: '2022-02-16' })
  await userEvent.click(cell)
}
