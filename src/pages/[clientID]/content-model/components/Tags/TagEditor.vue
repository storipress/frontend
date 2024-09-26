<script lang="ts" setup>
import { Icon, Inputs, Buttons as SpButton } from '@storipress/core-component'
import { CustomField } from '~/components/CustomField'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'
import { useCustomFields } from '~/composables'
import { CustomFieldGroupsDocument, DeleteTagDocument, UpdateTagDocument } from '~/graphql-operations'

const props = defineProps<{
  tag: Record<string, any> | null
  customFieldGroup: any
}>()

const emit = defineEmits<(event: 'close') => void>()

const tagName = ref((props.tag?.name as string) || '')

const groupFields = computed(() => props.customFieldGroup?.fields ?? [])
const tagFields = computed(() => props.tag?.metafields ?? [])

const { meta, editedValues, repeatValue, handleSubmit, createCustomFieldValue, editCustomFieldValue } = useCustomFields(
  groupFields,
  tagFields,
)

const { mutate: mutateUpdateTag } = useMutation(UpdateTagDocument)
const { refetch } = useQuery(CustomFieldGroupsDocument)
const onSubmit = handleSubmit(async () => {
  if (tagName.value !== props.tag?.name) {
    await mutateUpdateTag({ id: props.tag?.id as string, name: tagName.value })
  }
  await createCustomFieldValue(props?.tag?.id)
  await editCustomFieldValue()
  await refetch()
  emit('close')
})

const [confirmDeleteTag] = useConfirmFunction([
  {
    type: 'warning',
    title: 'Warning! This may break your site',
    description: `Deleting a tag is immediate and will cause problems for any Publications currently using it until those Publications are updated.

Your content will not show correctly until you update your application.`,
    okText: 'Delete tag',
    okButtonClass: 'bg-sky-700 hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-700',
  },
])
const { mutate: mutateDeleteTag } = useMutation(DeleteTagDocument)
async function onDelete(id: string) {
  const isConfirm = await confirmDeleteTag()
  if (!isConfirm) return
  await mutateDeleteTag({ id })
  await refetch()
  emit('close')
}
</script>

<template>
  <div v-if="tag" class="fixed inset-0 z-[28]" @click="emit('close')">
    <div
      class="absolute inset-y-0 right-0 flex w-[30rem] flex-col overflow-auto bg-stone-50 shadow-2-layer"
      @click.stop
    >
      <div class="text-display-small flex items-center p-6 capitalize">
        <div
          class="flex size-10 items-center justify-center rounded-lg border border-sky-600 bg-sky-600/[.15] text-sky-600"
        >
          <Icon icon-name="tag" class="text-2xl" />
        </div>
        <p class="ml-4 mr-2 font-bold text-stone-800">{{ tag.name }}</p>

        <p class="text-stone-400">{{ customFieldGroup.name }} Tag</p>
      </div>
      <hr class="border-t border-stone-200" />
      <Inputs v-model="tagName" class="m-6" label="Tag Name" />
      <hr class="border-t border-stone-200" />
      <CustomField class="p-6" :meta="meta" :edited-values="editedValues" @repeat-value="repeatValue" />
      <div class="flex-1" />
      <hr class="border-t border-stone-200" />
      <div class="flex justify-end p-6">
        <SpButton color="warning" class="mr-2" @click="onDelete(tag?.id)">Delete tag</SpButton>
        <SpButton color="primary" @click="onSubmit">Update tag</SpButton>
      </div>
    </div>
  </div>
</template>
