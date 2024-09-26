import { computed, h } from 'vue'
import type { Story } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import { dayjs } from '../../../lib/dayjs'
import { useCommentAPI } from '../../../composables'
import CommentThread from './comment-thread.vue'
import { useThreads } from './helpers'
import type { Thread, User } from './definitions'

export default {
  title: 'Editor/Comment',
  component: CommentThread,
}

interface Props {
  thread: Thread
  profile: User
}

const profile = {
  id: '1',
  name: 'Grace Harvey',
  full_name: 'Grace Harvey',
  avatar: 'https://avatars.dicebear.com/api/initials/Grace Harvey.svg',
}

const onEdit = action('edit')
const onRemove = action('remove')
const onResolve = action('resolve')
const onSubmit = action('submit')

const Template: Story<Props> = (args, { argTypes }) => ({
  props: Object.keys(argTypes),

  setup() {
    const apiThreads = useThreads('1', { fetchPolicy: 'cache-first' })
    const thread = computed(() => apiThreads.value[0] ?? args.thread)
    const { replyThread, editNote } = useCommentAPI(profile)

    function handleEdit({ id, content }: { id: string; content: string }) {
      onEdit({ id, content })

      editNote(id, content)
    }

    function handleReply({ id, content }: { id?: string; content: string }) {
      onSubmit({ id, content })

      if (!id) {
        return
      }
      replyThread(id, content)
    }

    return () =>
      h(CommentThread, {
        ...args,
        thread: thread.value,
        onEdit: handleEdit,
        onRemove,
        onResolve,
        onSubmit: handleReply,
      })
  },
})

const thread: Thread = {
  id: '1',
  resolvedAt: null,
  resolved: false,
  notes: [
    {
      id: '1',
      content: 'I think this bit needs changing, what do you think?',
      author: profile,
      createdAt: dayjs('2022-01-01T00:00:00.000Z'),
    },
    {
      id: '2',
      content: 'Fixed!',
      author: {
        id: '2',
        name: 'Alex Gore',
        avatar: 'https://avatars.dicebear.com/api/initials/Alex Gore.svg',
      },
      createdAt: dayjs('2022-01-01T00:00:00.000Z'),
    },
  ],
}

export const Default: Story<Props> = Template.bind({})

Default.args = { thread, profile }
