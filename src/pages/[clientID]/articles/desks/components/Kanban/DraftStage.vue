<script lang="ts" setup>
import { ref } from 'vue'
import { mergeTailwind } from '@storipress/core-component'
import type { UpdateStageInputData } from './definition'
import StageHeaderFrom from './StageHeaderFrom.vue'
import { useKanbanMutation } from './definition'
import LoadingCard from '~/components/LoadingCard.vue'

const props = defineProps<{
  draftId: string
  name: string
  color: string
  icon: string
}>()

const mutation = useKanbanMutation()
const saving = ref<boolean>(false)
async function save(data: UpdateStageInputData) {
  saving.value = true
  await mutation?.addStage({ ...data, draftId: props.draftId })
}
function cancel() {
  mutation?.removeDraftStage(props.draftId)
}
</script>

<template>
  <div :class="mergeTailwind(['flex h-full min-w-[17rem] flex-col rounded bg-[#989898]/5', $attrs.class])">
    <StageHeaderFrom :name="name" :color="color" :icon="icon" @save="save" @cancel="cancel" />
    <div class="space-y-[0.375rem] overflow-y-auto overflow-x-hidden px-2 pb-[0.875rem]">
      <LoadingCard
        v-for="index in 5"
        :key="index"
        :width="18 * 16"
        :height="6.25 * 16"
        v-bind="saving ? {} : { animate: false, secondaryColor: 'white', secondaryOpacity: 0.25 }"
      />
    </div>
  </div>
</template>

<style scoped></style>
