<script setup lang="ts">
import { Buttons, HoverHint, Icon, LoadingSpinner, Select } from '@storipress/core-component'
import Webflow from '@assets/icons-webflow.svg'
import { useMappingDialog } from './mapping-dialog'
import { onVisibleAgain } from '~/composables'
import type { GetWebflowCollectionQuery, WebflowCollectionType } from '~/graphql-operations'

const props = defineProps<{
  collection: GetWebflowCollectionQuery['webflowCollection']
  collectionType: WebflowCollectionType
  isActivated: boolean
}>()

const emit = defineEmits<{
  (event: 'clickBack'): void
  (event: 'clickSync'): void
  (event: 'refreshCollection'): void
}>()

const READONLY_TYPE = new Set(['multiReference', 'reference'])

const collection = toRef(props, 'collection')
const isActivated = toRef(props, 'isActivated')

const { onSubmit, validate, isLoading, updateSyncList, hasValidationError } = useMappingDialog(props)

async function onSync(event?: Event) {
  await onSubmit(event)

  emit('clickSync')
}

async function refreshCollection() {
  emit('refreshCollection')
  await validate()
}

onVisibleAgain(async () => {
  await refreshCollection()
})

const mapping = computed(() => (collection.value?.mappings ? JSON.parse(collection.value.mappings) : {}))

function onBack() {
  emit('clickBack')
}
</script>

<template>
  <div>
    <LoadingSpinner v-if="isLoading" show spin-width="w-8" class="absolute left-1/2 top-1/2 z-10" />
    <div class="layer-1 m-5 rounded-lg bg-gray-100/75">
      <div class="flex border-b border-stone-200 p-5">
        <img class="mr-4 size-[2.375rem]" :src="Webflow" />
        <div class="flex flex-col">
          <span class="text-body pb-1 text-stone-800">{{ collection?.displayName }}</span>
          <span class="text-caption text-stone-500">Account connected</span>
        </div>
      </div>

      <div class="relative max-h-[50vh] overflow-x-clip overflow-y-scroll p-5">
        <div class="text-subheading mb-2 uppercase">Map your {{ collectionType }} collection</div>
        <div v-for="(field, index) in collection?.fields" :key="field.id" class="mb-4 flex items-end justify-between">
          <div
            class="layer-1 flex h-9 w-64 items-center justify-center rounded-lg text-[0.75rem] font-semibold text-stone-800"
            :class="{ 'opacity-50': !field.candidates?.length, 'mb-8': !field.candidates?.length && field.isRequired }"
          >
            {{ `${field.displayName}${field.isRequired ? '' : ' (optional)'}` }}
          </div>
          <Icon
            icon-name="arrow_right"
            class="flex h-9 items-center text-stone-800"
            :class="{ 'opacity-50': !field.candidates?.length, 'mb-8': !field.candidates?.length && field.isRequired }"
          />

          <template v-if="READONLY_TYPE.has(field.type) && mapping[field.id]">
            <div
              class="layer-1 mt-4 flex h-9 w-64 items-center justify-center rounded-lg text-[0.75rem] font-semibold text-stone-800"
            >
              {{ mapping[field.id] }}
            </div>
          </template>

          <template v-else>
            <HoverHint :disabled="Boolean(field.candidates?.length)">
              <template #default>
                <div>
                  <Select
                    :items="field.candidates ?? []"
                    :model-value="field.candidates?.find((candidate) => candidate.value === mapping[field.id])"
                    :name="`webflowFields[${index}]`"
                    label="Storipress Field Name"
                    placeholder="Storipress Headline"
                    option-label-prop="name"
                    :disabled="!field.candidates?.length"
                    class="w-64"
                    @update:model-value="updateSyncList($event, field.id)"
                  />

                  <div v-if="!field.candidates?.length && field.isRequired" class="mt-4">
                    <div class="text-caption text-stone-400">
                      Already updated?
                      <button class="text-sky-700" @click="refreshCollection">click here to refresh</button>
                    </div>
                  </div>
                </div>
              </template>
              <template #content>
                <div class="text-body max-w-sm whitespace-break-spaces text-white">
                  {{
                    field.isRequired
                      ? `Syncing ${field.type} fields not supported in this collection, please go to your Webflow collection settings and set this field as optional`
                      : `${collectionType} collection currently does not support syncing custom fields of the ${field.type} type`
                  }}
                </div>
              </template>
            </HoverHint>
          </template>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-x-2 border-t border-stone-200 px-5 py-4">
      <Buttons type="main" is-shadow @click="onBack">Back</Buttons>

      <HoverHint :disabled="isActivated && !hasValidationError">
        <template #default>
          <Buttons type="main" color="primary" html-type="submit" :disabled="!isActivated" @click="onSync"
            >Sync</Buttons
          >
        </template>
        <template #content>
          <div v-if="!isActivated" class="text-body max-w-sm whitespace-break-spaces text-white">
            Please enable the Webflow integration to continue
          </div>
          <div v-else class="text-body max-w-sm whitespace-break-spaces text-white">
            Ensure all required fields are selected
          </div>
        </template>
      </HoverHint>
    </div>
  </div>
</template>
