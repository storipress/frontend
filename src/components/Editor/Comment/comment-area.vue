<!-- not used in storybook, container of comments, manage pending comment and comment threads -->

<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import type * as Y from 'yjs'
import CommentThreads from './comment-threads.vue'
import PendingComment from './pending-comment.vue'
import type { User } from './definitions'
import { GetMeDocument } from '~/graphql-operations'
import { useComment } from '~/stores/comment'
import { getAvatarURL } from '~/lib/avatar'

defineProps<{ id: string; editor: Editor; ydoc: Y.Doc }>()

const { result } = useQuery(GetMeDocument)

const store = useComment()

const pendingComment = toRef(store, 'pendingThread')
const profile = computed<User>(() => {
  return {
    ...result.value?.me,
    id: result.value?.me.id || '',
    name: result.value?.me.full_name || 'Loading...',
    avatar: result.value?.me.avatar || getAvatarURL(result.value?.me.full_name),
  }
})
</script>

<template>
  <!-- The container is just for vertical position, should not occupy any horizontal space -->
  <div class="h-full w-0">
    <div class="relative">
      <CommentThreads :id="id" :editor="editor" :profile="profile" :ydoc="ydoc" />
      <PendingComment v-if="pendingComment" :pending-comment="pendingComment" :profile="profile" />
    </div>
  </div>
</template>
