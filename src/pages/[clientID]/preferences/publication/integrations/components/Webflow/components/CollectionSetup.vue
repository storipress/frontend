<script setup lang="ts">
import { Buttons, NOTIFICATION_KEY } from '@storipress/core-component'
import { array as yupArray, object as yupObject } from 'yup'
import { useForm } from 'vee-validate'
import { upperFirst } from 'scule'
import { useWebflowCollection } from '../composables'
import CollectionSelect from './CollectionSelect.vue'
import type { WebflowCollectionType } from '~/graphql-operations'

const props = defineProps<{
  collectionType: WebflowCollectionType[]
}>()

const emit = defineEmits<{
  (event: 'clickNext'): void
}>()

const {
  collections,
  selectedIds,
  selectedCollection,
  loading: isLoading,
  updateCollection,
  createCollection,
  pullCollections,
} = useWebflowCollection(props.collectionType)

const notifications = inject(NOTIFICATION_KEY)

const schema = yupObject().shape({
  webflowCollection: yupArray().of(yupObject().required().label('This')),
})

const { handleSubmit } = useForm({
  validationSchema: schema,
})

const onNext = handleSubmit(async () => {
  const create = Object.entries(selectedCollection).flatMap(([type, { id }]) =>
    id === 'create' ? { type: type as WebflowCollectionType } : [],
  )
  const update = Object.entries(selectedCollection).flatMap(([type, { id }]) =>
    id !== 'create' ? { type: type as WebflowCollectionType, value: id } : [],
  )

  const result = await updateCollection(update)
  if (!result) {
    notifications?.({
      title: 'The selected collection id has already been used',
      type: 'warning',
      iconName: 'warning',
      content: 'Please select another collection.',
    })
    return
  }
  await createCollection(create)
  emit('clickNext')
})
</script>

<template>
  <div>
    <div class="layer-1 m-5 rounded-lg bg-gray-100/75">
      <div class="p-5">
        <div class="text-subheading mb-4 uppercase">
          1. If you have an existing collection, select from the dropdown
        </div>
        <CollectionSelect
          v-for="(type, index) in Object.keys(selectedCollection)"
          :key="index"
          v-model="selectedCollection[type as WebflowCollectionType]"
          :name="`webflowCollection[${index}]`"
          :items="collections"
          :label="`${upperFirst(type)} collection`"
          placeholder="Select your Webflow collection"
          :selected-ids="selectedIds"
          class="mt-6 w-full first:mt-0"
        />

        <div class="text-caption mt-4 text-stone-400">
          Haven't seen your collection?
          <button class="text-sky-700" @click="pullCollections">click here to refresh</button>
        </div>
      </div>
    </div>

    <div class="flex justify-end border-t border-stone-200 px-5 py-4">
      <Buttons :is-loading="isLoading" type="main" color="primary" html-type="submit" @click="onNext">Next</Buttons>
    </div>
  </div>
</template>

<style lang="scss">
body > div[aria-live='assertive'] {
  z-index: 999999;
}
</style>
