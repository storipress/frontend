<script lang="ts" setup>
import { Tiptap } from '~/components/Editor/core'

// TODO: refactor this in comment PR
import { useEditor } from '~/pages/[clientID]/articles/[id]/edit/components/use-editor'
import { useInjectYDoc } from '~/composables/context'

const props = withDefaults(defineProps<{ client: string; id: string; comment?: boolean }>(), { comment: true })
const ydoc = useInjectYDoc()
const { editor } = useEditor(props.client, props.id, props.comment, ydoc, true)
</script>

<template>
  <Tiptap v-if="editor" :editor="editor" collaborative />
</template>
