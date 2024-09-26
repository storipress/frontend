<script setup lang="ts">
import type { PropType } from 'vue'
import { Dropdowns, Icon, Inputs, MenuItem, Buttons as SpButton, Table as SpTable } from '@storipress/core-component'
import type { BasicCustomFieldInput } from '../AddNewFieldModel/definition'
import type { CustomFieldGroupData } from '../EditContentTypeSlideOver/definition'
import { contentType } from '../AddContentTypeSlideOver/definition'
import { fields } from '../AddNewFieldModel/definition'
import SlideOver from '~/components/SlideOver'
import type { UpdateCustomFieldGroupInput } from '~/graphql-operations'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  customFieldGroupId: {
    type: String,
    default: '',
  },
  customFieldGroupData: {
    type: Object as PropType<CustomFieldGroupData>,
    default: () => {},
  },
  draftCustomField: {
    type: Array as PropType<Pick<BasicCustomFieldInput, 'id' | 'name' | 'key' | 'description'>[]>,
    default: () => [],
  },
  errors: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'deleteGroup'): void
  (event: 'changeGroup', value: UpdateCustomFieldGroupInput): void
  (event: 'deleteField', value: BasicCustomFieldInput, index: number): void
  (event: 'editField', value: BasicCustomFieldInput, index: number): void
}>()

const show = useVModel(props, 'modelValue', emit)

const router = useRouter()

const draftCustomFieldGroup = reactive({
  name: '',
  key: '',
  description: '',
})
const { ignoreUpdates } = ignorableWatch(draftCustomFieldGroup, (val) => {
  emit('changeGroup', { id: props.customFieldGroupId, ...val })
})
watch(props.customFieldGroupData, (data) => {
  ignoreUpdates(() => Object.assign(draftCustomFieldGroup, data))
})

const findContentType = computed(() => {
  return contentType.find((item) => item.type === props.customFieldGroupData.type)
})

const columnsInfo = [
  { key: 'name', title: 'Field name', sortable: true },
  { key: 'key', title: 'API Identifier', sortable: true },
  { key: 'description', title: 'Description', sortable: true },
  { key: 'extra', title: '', sortable: false },
]
</script>

<template>
  <SlideOver :show="show" :click-outside-to-close="false" @close="show = false" @after-leave="router.back">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex gap-x-2 py-5">
          <span class="text-pageheading text-stone-800">{{ customFieldGroupData.name }}</span>
          <span class="text-display-small text-stone-400">{{ findContentType?.class }}</span>
        </div>
        <button class="size-12 rounded-full outline-none hover:bg-stone-200" type="button" @click="show = false">
          <Icon class="text-[1rem] text-[#4c4c4c]" icon-name="cross_thin" />
        </button>
      </div>
    </template>

    <div class="relative flex-shrink flex-grow overflow-auto">
      <SectionContent
        :sub-title="`${findContentType?.class} settings`"
        :content="`Give your ${findContentType?.class.toLocaleLowerCase()} a name and description and provide an API identifier.`"
      >
        <div class="layer-1 relative h-fit w-[34rem] rounded-lg bg-white p-5">
          <div class="flex items-end">
            <Inputs
              v-model="draftCustomFieldGroup.name"
              :show-error="Boolean(errors.name)"
              class="mr-4 basis-[10.5rem]"
              :label="`${findContentType?.class.split(' ')[1]} Name`"
              html-type="text"
              html-name="name"
            />
            <div class="relative mr-4 basis-[10.5rem]">
              <Inputs
                v-model="draftCustomFieldGroup.key"
                :show-error="Boolean(errors.key)"
                label="API Identifier"
                html-type="text"
                html-name="key"
              />
              <span v-if="errors['api-error']" class="text-caption absolute bottom-[calc(-1.5_*_1em)] text-red-700">
                {{ errors['api-error'] }}
              </span>
            </div>
            <SpButton class="ml-auto" :is-border="true" html-type="button" @click="emit('deleteGroup')">
              Delete Group
            </SpButton>
          </div>
          <hr class="mx-[-1.25rem] mb-[1.375rem] mt-7 border-stone-200" />
          <div class="flex items-end">
            <Inputs
              v-model="draftCustomFieldGroup.description"
              :show-error="Boolean(errors.description)"
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
  </SlideOver>
</template>

<style lang="scss" scoped>
:deep .text-caption {
  @apply w-max;
}
</style>
