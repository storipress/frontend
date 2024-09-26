<script lang="ts" setup>
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import { ViewTypes } from '../definitions'

const props = withDefaults(defineProps<{ modelValue?: string }>(), {
  modelValue: ViewTypes.Month,
})

const emit = defineEmits<(event: 'update:modelValue', value: string) => void>()

const viewType = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <RadioGroup v-model="viewType">
    <div class="relative flex rounded-lg bg-stone-200 hover:bg-stone-900/20 hover:transition-colors hover:duration-75">
      <RadioGroupOption v-for="option in ViewTypes" :key="option" v-slot="{ checked }" as="template" :value="option">
        <div
          class="text-button flex h-7 w-[4.5rem] cursor-pointer items-center justify-center rounded-lg px-3 py-1 transition-colors duration-200 focus:outline-none sm:flex-1"
          :class="[checked ? 'bg-red-700 text-white' : 'text-stone-800']"
        >
          <RadioGroupLabel as="p">
            {{ option }}
          </RadioGroupLabel>
        </div>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
