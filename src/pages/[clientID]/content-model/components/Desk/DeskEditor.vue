<script lang="ts" setup>
import { Icon, Buttons as SpButton } from '@storipress/core-component'
import { CustomField } from '~/components/CustomField'
import { useCustomFields } from '~/composables'
import { CustomFieldGroupsDocument, DesksCustomFieldDocument } from '~/graphql-operations'

const props = defineProps<{
  desk: Record<string, any> | null
  customFieldGroup: any
}>()

const emit = defineEmits<(event: 'close') => void>()

const groupFields = computed(() => props.customFieldGroup?.fields ?? [])
const deskFields = computed(() => props.desk?.metafields ?? [])

const { meta, editedValues, repeatValue, handleSubmit, createCustomFieldValue, editCustomFieldValue } = useCustomFields(
  groupFields,
  deskFields,
)

const { refetch: refetchCustomFieldGroups } = useQuery(CustomFieldGroupsDocument)
const { refetch: refetchDesks } = useQuery(DesksCustomFieldDocument)
const onSubmit = handleSubmit(async () => {
  await createCustomFieldValue(props?.desk?.id)
  await editCustomFieldValue()
  await refetchCustomFieldGroups()
  await refetchDesks()
  emit('close')
})
</script>

<template>
  <div v-if="desk" class="fixed inset-0" @click="emit('close')">
    <div class="absolute inset-y-0 right-0 flex w-[30rem] flex-col bg-stone-50 shadow-2-layer" @click.stop>
      <div class="text-display-small flex items-center p-6 capitalize">
        <div
          class="flex size-10 items-center justify-center rounded-lg border border-sky-600 bg-sky-600/[.15] text-sky-600"
        >
          <Icon icon-name="tag" class="text-2xl" />
        </div>
        <p class="ml-4 mr-2 font-bold text-stone-800">{{ desk.name }}</p>
        <p class="text-stone-400">Desk</p>
      </div>
      <hr class="border-t border-stone-200" />
      <CustomField class="m-6" :meta="meta" :edited-values="editedValues" @repeat-value="repeatValue" />
      <div class="flex-1" />
      <hr class="border-t border-stone-200" />
      <div class="flex justify-end p-6">
        <SpButton color="primary" @click="onSubmit">Update desk</SpButton>
      </div>
    </div>
  </div>
</template>
