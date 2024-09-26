<script lang="ts" setup>
import { Modals as Modal } from './Modals'
import type { Article } from '~/components/Scheduler/definitions'
import { ScheduleCalendar } from '~/components/Scheduler'

defineProps<{ visible: boolean; newArticle: Article }>()

const emits = defineEmits(['modalClose', 'changePublishedArticle'])
function handleUpdateArticle(article: Article | undefined) {
  emits('modalClose')

  if (article) {
    emits('changePublishedArticle', article.isPublished)
  }
}
</script>

<template>
  <Modal :open="visible" @modal-close="handleUpdateArticle">
    <ScheduleCalendar
      class="h-[92vh] w-[85vw] overflow-hidden rounded-lg border-0 shadow-transparent"
      :new-article="newArticle"
      @update:new-article="handleUpdateArticle"
    />
  </Modal>
</template>

<style lang="scss" scoped></style>
