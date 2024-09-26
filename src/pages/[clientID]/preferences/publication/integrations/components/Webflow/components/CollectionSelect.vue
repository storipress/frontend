<script setup lang="ts">
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { useField } from 'vee-validate'
import { Icon } from '@storipress/core-component'
import type { ListWebflowCollectionsQuery } from '~/graphql-operations'

const props = defineProps<{
  label: string
  placeholder: string
  items: ListWebflowCollectionsQuery['webflowCollections']
  modelValue: ListWebflowCollectionsQuery['webflowCollections'][number]
  name: string
  selectedIds: Set<ListWebflowCollectionsQuery['webflowCollections'][number]['id']>
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: ListWebflowCollectionsQuery['webflowCollections'][number]): void
}>()

const { errorMessage, value } = useField(props.name, undefined, {
  initialValue: props.modelValue,
})

function update($event: ListWebflowCollectionsQuery['webflowCollections'][number]) {
  value.value = $event
  emit('update:modelValue', $event)
}
</script>

<template>
  <Listbox v-slot="{ open }" :model-value="value" as="div" :name="name" @update:model-value="update">
    <ListboxLabel class="text-body block text-stone-800" :class="{ 'opacity-50': errorMessage }">
      {{ label }}
      <slot name="suffix" />
    </ListboxLabel>
    <div class="relative mt-1 h-[2.375rem]">
      <ListboxButton
        v-slot="{ value: selectedValue }"
        class="text-inputs relative size-full cursor-default rounded-md border bg-white pb-[0.312rem] pl-3 pr-10 pt-1.5 text-left"
        :class="
          errorMessage
            ? 'border-red-700 opacity-50 focus:border-red-700 focus:ring-red-700'
            : 'border-stone-400 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300'
        "
      >
        <span v-if="selectedValue" class="block truncate">
          {{ selectedValue.displayName }}
        </span>
        <span v-else class="text-black/25">{{ placeholder }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <Icon icon-name="selector" class="text-stone-500" />
        </span>
      </ListboxButton>

      <span v-if="errorMessage" class="text-caption absolute bottom-[calc(-1.5_*_1em)] left-0 text-red-700">
        <slot :error-message="errorMessage">
          {{ errorMessage }}
        </slot>
      </span>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          v-if="open"
          class="layer-2 text-body absolute z-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 focus:outline-none"
        >
          <ListboxOption
            v-for="(item, key) in items"
            :key="key"
            v-slot="{ active, selected, disabled }"
            :value="item"
            :disabled="item.id !== 'create' && selectedIds.has(item.id)"
          >
            <li
              class="relative cursor-default select-none py-2 pl-4 pr-[1.625rem] text-stone-800/75"
              :class="[{ 'bg-stone-100': active }, { 'cursor-not-allowed opacity-75': disabled }]"
            >
              <span class="block truncate" :class="[selected ? 'font-semibold' : 'font-normal']">
                {{ item.displayName }}
              </span>

              <span
                v-if="selected"
                class="absolute inset-y-0 right-0 flex items-center pr-4"
                :class="[active ? 'text-white' : 'text-indigo-600']"
              >
                <Icon icon-name="check" :class="active ? 'text-black' : 'text-stone-500'" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
