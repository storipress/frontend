<script lang="ts" setup>
import { defineProps } from 'vue'
import { CardStatus, useKanbanMutation } from './definition'
import PublishedCard from './PublishedCard.vue'
import UnpublishedCard from './UnpublishedCard.vue'
import { useConfirmFunction } from '~/components/ConfirmModalProvider'
import { filterHTMLTag } from '~/utils'
import { ListDesksDocument } from '~/graphql-operations'

const props = defineProps<{
  id: string
  title: string
  desk: string
  status: CardStatus
  featured: boolean
  editedAt: Date
  publishedAt?: Date
  order: number
  avatars: {
    name: string
    src: string
  }[]
  disabled: boolean
}>()

const [confirmDelete] = useConfirmFunction([
  {
    type: 'warning',
    title: 'Delete selected article',
    description: 'This data will be permanently erased — it cannot be restored.',
    okText: 'Delete',
  },
])

const isPublished = computed<boolean>(() => props.status === CardStatus.Published)
const titleFilter = computed<string>(() => {
  return filterHTMLTag(props.title)
})
const mutation = useKanbanMutation()

function onPublish() {
  nextTick(() => mutation?.publishArticle(props.id))
}
function onUnpublish() {
  nextTick(() => {
    if (isPublished.value) mutation?.unpublishArticle(props.id)
    else mutation?.unscheduleArticle(props.id)
  })
}
function onUpdateFeature($event: { id: string; value: boolean }) {
  nextTick(() => mutation?.changeFeatureArticle(props.id, $event.value))
}
async function onDelete() {
  if (await confirmDelete()) {
    mutation?.deleteArticle(props.id)
  }
}
function onDuplicate() {
  nextTick(() => mutation?.duplicateArticle(props.id))
}

const router = useRouter()
function onClick() {
  const { clientID } = router.currentRoute.value.params
  if (!props.disabled) router.push(`/${clientID}/articles/${props.id}/edit`)
}

const { result: desksQueryResult } = useQuery(ListDesksDocument)
function onChangeDesk({ deskId }: { deskId: string }) {
  mutation?.moveArticleToDifferentDesk(props.id, deskId)
}
</script>

<template>
  <div :id="`card-${id}`">
    <UnpublishedCard
      v-if="!isPublished"
      :id="id"
      :title="titleFilter"
      :desk="desk"
      :status="status"
      :featured="featured"
      :edited-at="editedAt"
      :published-at="publishedAt"
      :avatars="avatars"
      :disabled="disabled"
      :desks="desksQueryResult?.desks || []"
      @publish-now="onPublish"
      @unpublish="onUnpublish"
      @update-feature="onUpdateFeature"
      @delete="onDelete"
      @duplicate="onDuplicate"
      @click="onClick"
      @change-desk="onChangeDesk"
    />
    <!-- @click="onClick" -->
    <PublishedCard
      v-else
      :id="id"
      :title="titleFilter"
      :desk="desk"
      :featured="featured"
      :published-at="publishedAt ?? new Date()"
      :avatars="avatars"
      :disabled="disabled"
      :desks="desksQueryResult?.desks || []"
      @unpublish="onUnpublish"
      @update-feature="onUpdateFeature"
      @delete="onDelete"
      @duplicate="onDuplicate"
      @click="onClick"
      @change-desk="onChangeDesk"
    />
    <!-- @click="onClick" -->
  </div>
</template>

<style lang="scss" scoped></style>
