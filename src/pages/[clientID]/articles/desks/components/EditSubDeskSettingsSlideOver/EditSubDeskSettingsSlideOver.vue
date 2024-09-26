<script lang="ts" setup>
import type { PropType } from 'vue'
import { Buttons, Destructive, Inputs } from '@storipress/core-component'
import { useForm } from 'vee-validate'
import { Destructive as SelectDestructive } from './Destructive'
import type { DeskInterface, EventSubmitDataInterface } from './definition'
import SlideOver from '~/components/SlideOver'
import { usePublicationPermission } from '~/composables/permission/publication'
import { createDeskNameSchema } from '~/composables/is-reversed-desk-name'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
    default: false,
  },
  loading: {
    type: Boolean,
    required: true,
    default: false,
  },
  workspaceName: {
    type: String,
    required: true,
  },
  desk: {
    type: Object as PropType<DeskInterface>,
    required: true,
  },
  parent: {
    type: Object as PropType<DeskInterface>,
  },
})
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', newSubDesk: EventSubmitDataInterface): void
  (event: 'delete', desk: DeskInterface): void
}>()

const name = ref('')
const description = ref('')
const transferDesk = ref()
onMounted(() => {
  name.value = props.desk?.name
  description.value = props.desk?.description ?? ''
})
watch(
  () => [props.show, props.desk],
  () => {
    if (props.show) {
      name.value = props.desk.name
      description.value = props.desk.description
      transferDesk.value = undefined
    }
  },
)

const { canUpdateDeskSetting } = usePublicationPermission()

const { handleSubmit } = useForm({
  validationSchema: createDeskNameSchema('name'),
})
const submit = handleSubmit(() => {
  emit('submit', {
    id: props.desk.id,
    name: name.value,
    parentId: props.parent?.id ?? '',
    description: description.value,
  })
})

const {
  isRevealed: isRevealedOfDeleteDeskDialog,
  reveal: revealOfDeleteDeskDialog,
  confirm: confirmOfDeleteDeskDialog,
  cancel: cancelOfDeleteDeskDialog,
} = useConfirmDialog()
const readyDeleteDeskDialog = ref(false)

async function deleteSubDesk() {
  readyDeleteDeskDialog.value = true
  nextTick(async () => {
    const { isCanceled } = await revealOfDeleteDeskDialog()
    if (!isCanceled) emit('delete', transferDesk.value)
    readyDeleteDeskDialog.value = false
  })
}
</script>

<template>
  <SlideOver
    class="edit-sub-desk-slide-over"
    :show="show"
    :title="`Subdesk Settings for ${desk.name}`"
    :click-outside-to-close="false"
    @close="$emit('close')"
    @submit="!loading && submit()"
  >
    <SectionContent
      sub-title="Subdesk settings"
      content="The subdesk name is used in your live site for section headings and navigation."
      :class="{ 'opacity-50': !canUpdateDeskSetting }"
    >
      <div
        class="layer-1 relative h-fit w-[34rem] rounded-lg bg-white p-5"
        :class="{
          'after:absolute after:left-0 after:top-0 after:size-full after:content-[\'&nbsp;\']': !canUpdateDeskSetting,
        }"
      >
        <div class="flex items-end">
          <span class="basis-[20.375rem]">
            <Inputs v-model="name" label="Subdesk name" html-type="text" html-name="name" />
          </span>
          <Buttons class="ml-auto" :is-border="true" html-type="button" @click="deleteSubDesk()"
            >Delete subdesk</Buttons
          >
        </div>
        <div class="mt-4">
          <Inputs v-model="description" label="Subdesk description" html-type="text" html-name="description" />
        </div>
      </div>
    </SectionContent>
    <template #footer>
      <Buttons type="main" color="primary" html-type="submit" :is-loading="loading || !canUpdateDeskSetting">
        Save
      </Buttons>
    </template>
    <Destructive
      v-if="readyDeleteDeskDialog && parent?.desks?.length === 1"
      :visible="isRevealedOfDeleteDeskDialog"
      title="Delete Subdesk"
      button-text="delete subdesk"
      :confirm-value="`${workspaceName}/${desk.name}`"
      @on-click-delete="confirmOfDeleteDeskDialog(), $emit('close')"
      @on-modal-close="cancelOfDeleteDeskDialog()"
    >
      This will permanently delete this subdesk and move all its articles into the parent desk.
    </Destructive>
    <SelectDestructive
      v-if="readyDeleteDeskDialog && (parent?.desks?.length ?? 0) > 1"
      :visible="isRevealedOfDeleteDeskDialog"
      title="Delete Subdesk"
      button-text="delete subdesk"
      :confirm-value="`${workspaceName}/${desk.name}`"
      :desks="parent?.desks?.filter(({ id }) => id !== desk.id) ?? []"
      @on-click-delete="
        ($event) => {
          transferDesk = $event
          confirmOfDeleteDeskDialog()
          $emit('close')
        }
      "
      @on-modal-close="cancelOfDeleteDeskDialog()"
    >
      This will permanently delete the subdesk and move all its articles to a selected subdesk.
    </SelectDestructive>
  </SlideOver>
</template>

<style lang="scss">
.edit-sub-desk-slide-over {
  .slide-over__footer {
    @apply justify-end;
  }
}
</style>
