import { h } from 'vue'
import { dayjs } from '../ArticleCard/dayjs'
import ArticleLine from './article-line.vue'

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
  title: 'Schedule/ArticleLine',
  component: ArticleLine,
}

function Template(args, { argTypes }) {
  return {
    props: Object.keys(argTypes),
    components: { ArticleLine },
    setup: () => () => h(ArticleLine, { ...args, class: 'w-[12.688rem] mt-20' }),
  }
}

const article = {
  id: '1',
  title: '<p>I Pretended To Be An Influencer & All I Got Was Thousands Of Likes</p>',
  stage: stages[0],
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

export const Draft = Template.bind({})
Draft.args = {
  article: { ...article, stage: stages[0] },
  today: dayjs(new Date(2022, 1, 17, 10, 0, 0)),
}

export const ForReview = Template.bind({})
ForReview.args = {
  article: { ...article, stage: stages[1] },
  today: dayjs(new Date(2022, 1, 17, 10, 0, 0)),
}

export const EditorReviewed = Template.bind({})
EditorReviewed.args = {
  article: { ...article, stage: stages[2] },
  today: dayjs(new Date(2022, 1, 17, 10, 0, 0)),
}
