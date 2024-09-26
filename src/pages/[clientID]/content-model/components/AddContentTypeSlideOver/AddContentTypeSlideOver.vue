<script setup lang="ts">
import type { PropType } from 'vue'
import { Dropdowns, Icon, Inputs, MenuItem, Buttons as SpButton, Table as SpTable } from '@storipress/core-component'
import { useForm } from 'vee-validate'
import { fields } from '../AddNewFieldModel/definition'
import type { BasicCustomFieldInput } from '../AddNewFieldModel/definition'
import { useContentModelValidate } from '../utils'
import type { ContentType } from './definition'
import SlideOver from '~/components/SlideOver'
import type { CreateCustomFieldGroupInput } from '~/graphql-operations'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  customFieldGroupType: {
    type: Object as PropType<ContentType>,
    default: () => {},
  },
  draftCustomField: {
    type: Array as PropType<Pick<BasicCustomFieldInput, 'id' | 'name' | 'key' | 'description'>[]>,
    default: () => [],
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (
    event: 'submit',
    value: CreateCustomFieldGroupInput,
    setFieldError: (field: string, message: string | string[] | undefined) => void,
  ): void
  (event: 'deleteField', value: CreateCustomFieldGroupInput, index: number): void
  (event: 'editField', value: CreateCustomFieldGroupInput, index: number): void
}>()

const router = useRouter()
const show = useVModel(props, 'modelValue', emit)
const newCustomFieldGroup = reactive({
  name: '',
  key: '',
  description: '',
})
const focusInput = ref(false)
const editedKey = ref(false)

watch(
  () => newCustomFieldGroup.key,
  (key) => {
    if (focusInput.value && Boolean(key)) {
      editedKey.value = true
    }
  },
)
watch(
  () => newCustomFieldGroup.name,
  (name) => {
    if (!editedKey.value) {
      const result = name.replaceAll(' ', '').toLowerCase()
      newCustomFieldGroup.key = result
    }
  },
)

const { nameValidate, keyValidate, descriptionValidate } = useContentModelValidate()
const schema = {
  name: nameValidate(),
  key: keyValidate(),
  description: descriptionValidate(),
}
const { handleSubmit, setFieldError, errors } = useForm({
  validationSchema: schema,
})

const submit = handleSubmit(() => {
  emit('submit', { type: props.customFieldGroupType.type, ...newCustomFieldGroup }, setFieldError)
})

const columnsInfo = [
  { key: 'name', title: 'Field name', sortable: true },
  { key: 'key', title: 'API Identifier', sortable: true },
  { key: 'description', title: 'Description', sortable: true },
  { key: 'extra', title: '', sortable: false },
]
</script>

<template>
  <SlideOver
    class="add-content-type-slide-over"
    :show="show"
    :title="`Create New ${customFieldGroupType.class}`"
    :click-outside-to-close="false"
    @close="show = false"
    @submit="submit"
    @after-leave="router.back"
  >
    <div class="relative flex-shrink flex-grow overflow-auto">
      <SectionContent
        :sub-title="`${customFieldGroupType.class} settings`"
        :content="`Give your ${customFieldGroupType.class.toLocaleLowerCase()} a name and description and provide an API identifier.`"
      >
        <div class="layer-1 relative h-fit w-[34rem] rounded-lg bg-white p-5">
          <div class="flex items-end">
            <Inputs
              v-model="newCustomFieldGroup.name"
              class="mr-4 basis-[11rem]"
              :label="`${customFieldGroupType.class.split(' ')[1]} Name`"
              html-type="text"
              html-name="name"
            />
            <div class="relative">
              <Inputs
                v-model="newCustomFieldGroup.key"
                class="mr-4 basis-[11rem]"
                label="API Identifier"
                html-type="text"
                html-name="key"
                @focus="focusInput = true"
                @blur="focusInput = false"
              />
              <span v-if="errors['api-error']" class="text-caption absolute bottom-[calc(-1.5_*_1em)] text-red-700">
                {{ errors['api-error'] }}
              </span>
            </div>
          </div>
          <hr class="mx-[-1.25rem] mb-[1.375rem] mt-7 border-stone-200" />
          <div class="flex items-end">
            <Inputs
              v-model="newCustomFieldGroup.description"
              class="w-full"
              label="Description"
              html-type="text"
              html-name="description"
            />
          </div>
        </div>
      </SectionContent>

      <Section class="relative mb-[5.375rem] flex-shrink flex-grow" title="Fields">
        <div class="overflow-scroll py-4">
          <SpTable selectable row-key="id" :columns="columnsInfo" :data="draftCustomField" class="min-w-[66rem]">
            <template #data-0="{ row }">
              <div class="flex items-center gap-x-4">
                <Icon
                  :icon-name="fields.find((field) => field.type === row.type)?.icon ?? ''"
                  class="rounded border border-sky-700 bg-sky-700/20 p-1 text-sky-700"
                />
                <span class="text-button text-stone-800">{{ row.name }}</span>
              </div>
            </template>
            <template #data-3="{ row, rowIndex }">
              <Dropdowns placement="left-start">
                <MenuItem @click.prevent="emit('deleteField', row, rowIndex)">Delete field</MenuItem>
                <MenuItem @click.prevent="emit('editField', row, rowIndex)">Edit field</MenuItem>
              </Dropdowns>
            </template>
          </SpTable>
        </div>
      </Section>
    </div>

    <template #footer>
      <SpButton type="main" color="primary" html-type="submit">Create new {{ customFieldGroupType.class }}</SpButton>
    </template>
  </SlideOver>
</template>

<style lang="scss">
.add-content-type-slide-over {
  .slide-over__footer {
    @apply justify-end;
  }
}
</style>

<style lang="scss" scoped>
:deep .text-caption {
  @apply w-max;
}
</style>
