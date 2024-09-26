<script lang="ts" setup>
import { until } from '@vueuse/core'
import { logicNot } from '@vueuse/math'
import type { CreateNewArticle, Desk, NewArticleInput } from './definitions'
import { NEW_ARTICLE_KEY } from './definitions'
import { resolveInput } from './helper'
import NewArticle from './new-article-container.vue'

const route = useRoute()
const open = ref(false)
const initialDesk = ref<string | Desk | undefined>()
const openEditor = ref(true)
const options = ref({})

const createArticle: CreateNewArticle = (x?: Desk | string | NewArticleInput) => {
  const { desk, openEditor: editor, ...opts } = resolveInput(x)
  initialDesk.value = desk
  openEditor.value = editor
  options.value = opts
  open.value = true
  return until(open).toBe(false)
}

provide(NEW_ARTICLE_KEY, createArticle)

whenever(
  logicNot(open),
  (open) => {
    initialDesk.value = undefined
  },
  { flush: 'sync' },
)
</script>

<template>
  <slot />
  <NewArticle
    v-if="route.params.clientID"
    v-model="open"
    :maybe-desk-id="initialDesk"
    :open-editor="openEditor"
    :options="options"
  />
</template>
