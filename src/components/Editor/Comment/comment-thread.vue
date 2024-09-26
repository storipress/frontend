<!--- this is the divider line --->
<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import type { Note, Thread, User } from './definitions'
import CommentBox from './comment-box.vue'
import Comment from './comment.vue'
import Reply from './reply.vue'
import { useComment } from '~/stores/comment'
import { getAPI } from '~/components/Editor/core/api'

const props = defineProps<{
  thread: Thread
  profile: User
  notes: Note[]
  editor: Editor
}>()
const emit = defineEmits<{
  resolve: [payload: Thread]
  suggest: [content: string, thread: Thread]
  remove: [payload: { id: string }, thread: Thread]
  edit: [payload: { id: string; content: string }, thread: Thread]
  submit: [payload: { id?: string; content: string }, thread: Thread]
  positionComments: []
}>()

const store = useComment()
const { removePendingComment } = getAPI()
function handleClick() {
  store.SET_SELECTED(props.thread.id)
  emit('positionComments')
  props.editor.commands.refreshAnnotation()
  props.editor.commands.deleteAnnotation(store.pendingThread?.id || '')
  removePendingComment()
}
</script>

<template>
  <CommentBox :id="thread.id" :key="thread.id" @click="handleClick">
    <template v-for="(note, index) of notes" :key="note.id">
      <hr v-if="index !== 0" class="mx-3 my-4 border-stone-200 dark:border-stone-800" />
      <Comment
        :comment="note"
        :show-resolve="index === 0"
        :profile="profile"
        :thread-id="thread.id"
        @resolve="$emit('resolve', thread)"
        @edit="$emit('edit', $event, thread)"
        @remove="$emit('remove', $event, thread)"
        @suggest="$emit('suggest', $event.content, thread)"
      />
    </template>

    <Reply :id="thread.id" :profile="profile" @submit="$emit('submit', $event, thread)" />
  </CommentBox>
</template>
