<!-- not used in storybook -->

<script lang="ts" setup>
import { whenever } from '@vueuse/core'
import { logicNot } from '@vueuse/math'
import invariant from 'tiny-invariant'
import Comment from './comment.vue'
import CommentBox from './comment-box.vue'
import CommentHeader from './comment-header.vue'
import Reply from './reply.vue'
import type { Note, User } from './definitions'
import { dayjs } from '~/lib/dayjs'
import { useCommentAPI } from '~/composables'

const props = defineProps<{
  pendingComment?: Record<string, any>
  profile: User
}>()
const previewComment = ref<null | Note>(null)

const { createThread } = useCommentAPI(computed(() => ({ ...props.profile, full_name: props.profile.name })))

function handleSubmitComment({ content }: { content: string }) {
  resolveComment(content)
  invariant(props.pendingComment, 'pendingComment is not defined')
  createThread({ content, position: props.pendingComment.position })
}

function handleCancelComment() {
  if (previewComment.value) {
    return
  }
  resolveComment(null)
}

function resolveComment(result: string | null) {
  if (result) {
    const now = new Date()
    previewComment.value = {
      id: 'temp-id',
      author: { ...props.profile },
      content: result,
      created_at: now.toISOString(),
      createdAt: dayjs(now),
    }
  }
}

whenever(logicNot(toRef(props, 'pendingComment')), () => {
  previewComment.value = null
})
</script>

<template>
  <CommentBox v-if="pendingComment" class="absolute" :top="pendingComment.top">
    <Comment v-if="previewComment" :comment="previewComment" :show-resolve="false" :profile="profile" loading />
    <CommentHeader v-else class="pb-2" :profile="profile" :display-time="pendingComment.displayTime" />
    <Reply
      v-if="!previewComment"
      :profile="profile"
      auto-focus
      @submit="handleSubmitComment"
      @cancel="handleCancelComment"
    />
  </CommentBox>
</template>
