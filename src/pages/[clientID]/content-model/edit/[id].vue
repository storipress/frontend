<script setup lang="ts">
import { NavbarSave } from '@storipress/core-component'
import { onMounted, ref } from 'vue'
import invariant from 'tiny-invariant'
import * as Sentry from '@sentry/vue'
import { useForm } from 'vee-validate'
import { ApolloError } from '@apollo/client/core'
import { errorMessage, useContentModelValidate } from '../components/utils'
import EditContentTypeSlideOver from '../components/EditContentTypeSlideOver'
import AddNewFieldModel from '../components/AddNewFieldModel'
import EditFieldModel from '../components/EditFieldModel'
import type { BasicCustomFieldInput, NewCustomField } from '../components/AddNewFieldModel/definition'
import type { CustomFieldGroupData } from '../components/EditContentTypeSlideOver/definition'
import type { GetCustomFieldGroupQuery, UpdateCustomFieldGroupInput } from '~/graphql-operations'
import {
  CreateCustomFieldDocument,
  DeleteCustomFieldDocument,
  DeleteCustomFieldGroupDocument,
  GetCustomFieldGroupDocument,
  UpdateCustomFieldDocument,
  UpdateCustomFieldGroupDocument,
} from '~/graphql-operations'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'

type Id = string
type customFieldGroup = NonNullable<GetCustomFieldGroupQuery['customFieldGroup']>
type customFieldGroupFields = customFieldGroup['fields'][number]
type Fields = Pick<customFieldGroupFields, 'id' | 'name' | 'key' | 'type' | 'options'>
interface ErrorValidation {
  key: [keyof typeof errorMessage]
}
interface EditedFields {
  type: 'update' | 'delete'
  field: BasicCustomFieldInput
}

const props = defineProps<{
  id: string
  clientID: string
}>()

const addModalVisible = inject('addModalVisible', false)

const route = useRoute()
const router = useRouter()
const show = ref(false)
const editModalVisible = ref(false)
const isChanged = ref(false)
const customField = ref<NewCustomField | null>(null)
const customFieldGroupData = reactive({}) as CustomFieldGroupData
const addCustomFieldData = ref<BasicCustomFieldInput[]>([])
const draftCustomFieldData = ref<BasicCustomFieldInput[]>([])
const editedFields = ref<Map<Id, EditedFields>>(new Map())
const editCustomFieldData = ref()
const editCustomFieldIndex = ref<number>()
const { result, refetch } = useQuery(GetCustomFieldGroupDocument, {
  id: props.id,
})

function initEditContentType(data: CustomFieldGroupData<Fields>) {
  const { key, name, description, type, fields } = data

  const filterCustomFields: BasicCustomFieldInput[] = fields
    .filter((field) => {
      return !field.key.startsWith('__')
    })
    .map((field) => {
      const result = Object.assign({}, field)
      const { options } = field
      if (options?.__typename === 'CustomFieldTextOptions') {
        const { textMin: min, textMax: max, ...opt } = options

        Object.assign(result, { options: { min, max, ...opt } })
      } else if (options?.__typename === 'CustomFieldNumberOptions') {
        const { numberMin: min, numberMax: max, ...opt } = options

        Object.assign(result, { options: { min, max, ...opt } })
      }
      return result
    })
  Object.assign(customFieldGroupData, { key, name, description, type, fields })
  draftCustomFieldData.value = [...filterCustomFields]
  addCustomFieldData.value = []
  editedFields.value.clear()
}

watch(result, (result) => {
  if (result?.customFieldGroup) {
    const { id, key, name, description, type, fields } = result.customFieldGroup
    initEditContentType({
      id,
      key,
      name,
      description,
      type,
      fields,
    })
  } else {
    router.replace(`/${route.params.clientID}/content-model`)
  }
})

function editField(customField: BasicCustomFieldInput, index: number) {
  editCustomFieldData.value = customField
  editCustomFieldIndex.value = index
  editModalVisible.value = true
}

const [confirmDeleteContentType] = useConfirmFunction([
  {
    type: 'warning',
    title: 'Warning! This may break your site',
    description: `Deleting a field is immediate and will cause problems for any Publications currently using it until those Publications are updated.

      Your content will not show correctly until you update your application.`,
    okText: 'Delete group',
    cancelText: 'Cancel',
  },
])
const { mutate: deleteCustomFieldGroup } = useMutation(DeleteCustomFieldGroupDocument)
async function deleteContentType() {
  if (await confirmDeleteContentType()) {
    await deleteCustomFieldGroup({ id: props.id })
    router.replace(`/${route.params.clientID}/content-model`)
  }
}
function changeContentType(data: UpdateCustomFieldGroupInput) {
  isChanged.value = true
  Object.assign(customFieldGroupData, data)
}
function addCustomField(customField: BasicCustomFieldInput) {
  isChanged.value = true
  addCustomFieldData.value.push({ ...customField })
}
function updateCustomField(customField: BasicCustomFieldInput) {
  isChanged.value = true
  if (customField.id) {
    draftCustomFieldData.value.splice(editCustomFieldIndex.value!, 1, customField)

    editedFields.value.set(customField.id, { type: 'update', field: { ...customField } })
  } else {
    addCustomFieldData.value.splice(editCustomFieldIndex.value! - draftCustomFieldData.value.length, 1, customField)
  }
}
function deleteCustomField(customField: BasicCustomFieldInput, index: number) {
  isChanged.value = true
  if (customField.id) {
    draftCustomFieldData.value.splice(index, 1)

    editedFields.value.set(customField.id, { type: 'delete', field: { ...customField } })
  } else {
    addCustomFieldData.value.splice(index - draftCustomFieldData.value.length, 1)
  }
}

const { mutate: updateCustomFieldGroup } = useMutation(UpdateCustomFieldGroupDocument)
const { mutate: createCustomFieldMutation } = useMutation(CreateCustomFieldDocument)
const { mutate: updateCustomFieldMutation } = useMutation(UpdateCustomFieldDocument)
const { mutate: deleteCustomFieldMutation } = useMutation(DeleteCustomFieldDocument)

const { nameValidate, keyValidate, descriptionValidate } = useContentModelValidate()
const schema = {
  name: nameValidate(),
  key: keyValidate(),
  description: descriptionValidate(),
}
const { handleSubmit, setFieldError, errors } = useForm({
  validationSchema: schema,
})
const errorValidation = ref<keyof typeof errorMessage>()
function createCustomField() {
  if (!addCustomFieldData.value.length) {
    return []
  }
  return addCustomFieldData.value.map(({ name, key, description, type, options }) =>
    createCustomFieldMutation({
      input: {
        custom_field_group_id: props.id,
        name,
        key,
        description,
        type,
        options: JSON.stringify(options),
      },
    }),
  )
}
function editedCustomField() {
  if (!editedFields.value.size) {
    return []
  }

  const promise = []
  for (const {
    type,
    field: { id, name, key, description, options },
  } of editedFields.value.values()) {
    if (type === 'update') {
      promise.push(
        updateCustomFieldMutation({
          input: {
            id: id!,
            name,
            key,
            description,
            options: JSON.stringify(options),
          },
        }),
      )
    } else if (type === 'delete') {
      promise.push(deleteCustomFieldMutation({ id: id! }))
    }
  }
  return promise
}
const updateContentType = handleSubmit(async () => {
  const { key, name, description } = customFieldGroupData

  try {
    const result = await updateCustomFieldGroup({
      input: { id: props.id, key, name, description },
    })

    if (result?.data?.updateCustomFieldGroup) {
      const addCustomFieldPromise = createCustomField()
      const editedCustomFieldPromise = editedCustomField()

      await Promise.all([...addCustomFieldPromise, ...editedCustomFieldPromise])
      refetch()

      isChanged.value = false
      editedFields.value.clear()
      addCustomFieldData.value = []
    }
  } catch (error: unknown) {
    if (error instanceof ApolloError) {
      errorValidation.value = (error.graphQLErrors[0].extensions.validation as ErrorValidation)?.key?.[0]
      setFieldError('api-error', errorMessage[errorValidation.value])
    } else {
      Sentry.captureException(error)
    }
  }
})
async function onDiscard() {
  invariant(result.value?.customFieldGroup, 'expect customFieldGroup data')
  const { id, key, name, description, type, fields } = result.value.customFieldGroup
  initEditContentType({
    id,
    key,
    name,
    description,
    type,
    fields,
  })
  isChanged.value = false
}

onMounted(() => (show.value = true))
</script>

<template>
  <transition
    enter-active-class="transition duration-100 ease-out origin-top"
    enter-from-class="transform scale-y-95 opacity-0"
    enter-to-class="transform scale-y-100 opacity-100"
    leave-active-class="transition duration-75 ease-in origin-top"
    leave-from-class="transform scale-y-100 opacity-100"
    leave-to-class="transform scale-y-95 opacity-0"
  >
    <NavbarSave
      class="fixed right-0 top-0 z-[35] w-screen"
      :show="isChanged"
      @on-discard="onDiscard"
      @on-save="updateContentType"
    />
  </transition>

  <EditContentTypeSlideOver
    v-model="show"
    :custom-field-group-id="id"
    :custom-field-group-data="customFieldGroupData"
    :draft-custom-field="[...draftCustomFieldData, ...addCustomFieldData]"
    :errors="errors"
    @delete-group="deleteContentType"
    @change-group="changeContentType"
    @edit-field="editField"
    @delete-field="deleteCustomField"
  />
  <AddNewFieldModel
    v-model="addModalVisible"
    v-model:newField="customField"
    @add-new-field="
      (field: NewCustomField) => {
        customField = field
      }
    "
    @submit="addCustomField"
  />
  <EditFieldModel v-model="editModalVisible" :field-data="editCustomFieldData" @submit="updateCustomField" />
</template>

<style lang="scss" scoped></style>

<route lang="yaml">
name: content-model-edit
</route>
