<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as Sentry from '@sentry/vue'
import { ApolloError } from '@apollo/client/core'
import AddContentTypeSlideOver from '../components/AddContentTypeSlideOver'
import AddNewFieldModel from '../components/AddNewFieldModel'
import EditFieldModel from '../components/EditFieldModel'
import { contentType } from '../components/AddContentTypeSlideOver/definition'
import type { BasicCustomFieldInput, NewCustomField } from '../components/AddNewFieldModel/definition'
import { errorMessage } from '../components/utils'
import type { CreateCustomFieldGroupInput } from '~/graphql-operations'
import {
  CreateCustomFieldDocument,
  CreateCustomFieldGroupDocument,
  CustomFieldGroupType,
  CustomFieldGroupsDocument,
  CustomFieldType,
} from '~/graphql-operations'

interface ErrorValidation {
  key: [keyof typeof errorMessage]
}

const props = withDefaults(
  defineProps<{
    customFieldGroupType: string
    clientID: string
  }>(),
  { customFieldGroupType: '' },
)

const addModalVisible = inject('addModalVisible', false)

const route = useRoute()
const router = useRouter()
const show = ref(false)
const editModalVisible = ref(false)
const customField = ref<NewCustomField | null>(null)
const draftCustomField = ref<BasicCustomFieldInput[]>([])
const editCustomFieldData = ref()
const editCustomFieldIndex = ref<number>()

function editField(_customField: CreateCustomFieldGroupInput, index: number) {
  editCustomFieldData.value = draftCustomField.value[index]
  editCustomFieldIndex.value = index
  editModalVisible.value = true
}
function deleteField(_customField: CreateCustomFieldGroupInput, index: number) {
  draftCustomField.value.splice(index, 1)
}

const findContentType = computed(() => {
  return contentType.find((item) => item.routeParams === props.customFieldGroupType)
})

const { mutate: createCustomFieldGroup } = useMutation(CreateCustomFieldGroupDocument)
const { mutate: createCustomFieldMutation } = useMutation(CreateCustomFieldDocument)

const { refetch: refetchCustomFieldGroups } = useQuery(CustomFieldGroupsDocument)
const errorValidation = ref<keyof typeof errorMessage>()
async function createContentType(
  customFieldGroup: CreateCustomFieldGroupInput,
  setFieldError: (field: string, message: string | string[] | undefined) => void,
) {
  try {
    const result = await createCustomFieldGroup({
      input: customFieldGroup,
    })

    if (result?.data?.createCustomFieldGroup) {
      if (findContentType.value?.type === CustomFieldGroupType.ArticleContentBlock) {
        draftCustomField.value.push({
          name: '__blocks',
          key: '__blocks',
          type: CustomFieldType.Json,
        })
      }
      if (draftCustomField.value.length) {
        const { id } = result.data.createCustomFieldGroup

        const promise = draftCustomField.value.map(({ name, key, description, type, options }) =>
          createCustomFieldMutation({
            input: {
              custom_field_group_id: id,
              name,
              key,
              description,
              type,
              options: JSON.stringify(options),
            },
          }),
        )

        await Promise.all(promise)
      }
      await refetchCustomFieldGroups()
      const goBack = () => {
        const lastPath = router?.options?.history?.state?.back
        return lastPath ? router.back() : router.replace(`/${route.params.clientID}/content-model`)
      }
      goBack()
    }
  } catch (error: unknown) {
    if (error instanceof ApolloError) {
      errorValidation.value = (error.graphQLErrors[0].extensions.validation as ErrorValidation)?.key?.[0]
      setFieldError('api-error', errorMessage[errorValidation.value])
    } else {
      Sentry.captureException(error)
    }
  }
}
function createCustomField(customField: BasicCustomFieldInput) {
  draftCustomField.value.push({ ...customField })
}
function updateCustomField(customField: BasicCustomFieldInput) {
  draftCustomField.value.splice(editCustomFieldIndex.value!, 1, customField)
}

onMounted(() => (show.value = true))
</script>

<template>
  <AddContentTypeSlideOver
    v-model="show"
    :client-id="clientID"
    :custom-field-group-type="findContentType"
    :draft-custom-field="draftCustomField"
    @edit-field="editField"
    @delete-field="deleteField"
    @submit="createContentType"
  />
  <AddNewFieldModel
    v-model="addModalVisible"
    v-model:newField="customField"
    @add-new-field="
      (field: NewCustomField) => {
        customField = field
      }
    "
    @submit="createCustomField"
  />
  <EditFieldModel v-model="editModalVisible" :field-data="editCustomFieldData" @submit="updateCustomField" />
</template>

<style lang="scss"></style>

<route lang="yaml">
name: content-model-add
</route>
