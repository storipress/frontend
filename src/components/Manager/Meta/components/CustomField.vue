<script setup lang="ts">
import { Buttons as SpButton } from '@storipress/core-component'
import { debounce } from 'lodash-es'
import type { ApolloQueryResult } from '@apollo/client/core'
import { CustomField } from '~/components/CustomField'
import type { CustomFields, FieldValues } from '~/composables/custom-field-editor'
import { useCustomFields } from '~/composables'
import type { GetArticleMetafieldQuery } from '~/graphql-operations'

const props = withDefaults(
  defineProps<{
    fields: CustomFields[]
    fieldValues: FieldValues
    targetId: string
    refetch: (variables?: { id: string }) => Promise<ApolloQueryResult<GetArticleMetafieldQuery>> | undefined
  }>(),
  {
    fields: () => [],
    fieldValues: () => [],
    targetId: '',
  },
)
const emit = defineEmits<(event: 'loading', val: boolean) => void>()

const { meta, editedValues, isUploadingFile, repeatValue, handleSubmit, createCustomFieldValue, editCustomFieldValue } =
  useCustomFields(toRef(props, 'fields'), toRef(props, 'fieldValues'))

const onSubmit = handleSubmit(async () => {
  try {
    await createCustomFieldValue(props.targetId)
    await editCustomFieldValue()
  } catch (e) {}
})

// Display a prompt if the user reloads the page before saving changes in the custom field
const { isLoading, execute } = useAsyncState(onSubmit, null, { immediate: false })
window.onbeforeunload = () => {
  return isLoading.value ? 'alert' : null
}

watch(
  meta,
  debounce(() => {
    execute()
  }, 500),
  { deep: true },
)
watch(isUploadingFile, (val) => {
  emit('loading', val)
})
</script>

<template>
  <CustomField :meta="meta" :edited-values="editedValues" :show-loading="isUploadingFile" @repeat-value="repeatValue" />
  <SpButton html-type="submit" class="hidden" @click="onSubmit" />
</template>

<style scoped></style>
