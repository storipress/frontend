<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { useField } from 'vee-validate'
import { Float } from '@headlessui-float/vue'
import type { FloatProps } from '@headlessui-float/vue'
import { cn } from '../../plugins/MergeTailwindPlugin'
import Icon from '../Icon/index.vue'

type Value = string | number | boolean | object | null | undefined

defineOptions({
  name: 'SpSelect',
})

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select ...',
  modelValue: undefined,
  defaultValue: undefined,
  name: 'listbox',
  disabled: false,
  floatOptions: () => ({}),
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

interface Props {
  label?: string
  placeholder?: string
  items?: Value[]
  modelValue?: string | object | number | boolean
  displayClass?: HTMLAttributes['class']
  defaultValue?: string | object | number | boolean
  optionLabelProp?: string
  name?: string
  disabled?: boolean
  floatOptions?: FloatProps
}

const optionLabel = computed(() => (item: any) => {
  if (props.optionLabelProp) return item[props.optionLabelProp]
  return item
})

const { errorMessage, value } = useField(props.name, undefined, {
  initialValue: props.modelValue,
})

watch(
  () => props.modelValue,
  (modelValue) => {
    if (modelValue) {
      value.value = modelValue
    }
  },
)

watch(value, (value) => {
  emit('update:modelValue', value)
})

const listRef = ref()
watch(
  () => listRef.value?.$el,
  (el, pre) => {
    if (pre === undefined) return
    if (el) {
      emit('focus')
    } else {
      emit('blur')
    }
  },
)
</script>

<template>
  <Listbox v-model="value" :default-value="defaultValue" :disabled="disabled" :name="name" as="div">
    <ListboxLabel class="text-body block text-stone-800" :class="{ 'opacity-50': errorMessage }">
      {{ label }}
      <slot name="suffix" />
    </ListboxLabel>
    <div class="relative mt-1 h-[2.375rem]">
      <Float
        portal
        adaptive-width
        :hide="[
          {
            strategy: 'referenceHidden',
          },
          {
            strategy: 'escaped',
          },
        ]"
        reference-hidden-class="hidden"
        escaped-class="hidden"
        leave="transition duration-100 ease-in"
        enter="transition duration-100 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
        v-bind="floatOptions"
      >
        <ListboxButton
          v-slot="{ value: selectedValue }"
          :class="
            cn(
              'text-inputs relative size-full cursor-default rounded-md border bg-white pb-[0.312rem] pl-3 pr-10 pt-1.5 text-left',
              displayClass,
              errorMessage
                ? 'border-red-700 opacity-50 focus:border-red-700 focus:ring-red-700'
                : 'border-stone-400 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300',
            )
          "
        >
          <span v-if="selectedValue" class="block truncate">
            {{ optionLabel(selectedValue) }}
          </span>
          <span v-else class="text-black/25">{{ placeholder }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <Icon icon-name="selector" class="text-stone-500" />
          </span>
        </ListboxButton>

        <ListboxOptions
          ref="listRef"
          class="layer-2 text-body max-h-60 w-full overflow-auto rounded-md bg-white py-1 focus:outline-none"
        >
          <ListboxOption
            v-for="(item, key) in items"
            :key="key"
            v-slot="{ active, selected }"
            as="template"
            :value="item"
          >
            <li
              :class="
                cn('relative cursor-default select-none py-2 pl-4 pr-[1.625rem] text-stone-800/75', displayClass, {
                  'bg-stone-100': active,
                })
              "
            >
              <span class="block truncate" :class="[selected ? 'font-semibold' : 'font-normal']">
                {{ optionLabel(item) }}
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
      </Float>

      <span v-if="!errorMessage" class="text-caption absolute bottom-[calc(-1.5_*_1em)] left-0 text-red-700">
        <slot :error-message="errorMessage">{{ errorMessage }}</slot>
      </span>
    </div>
  </Listbox>
</template>
