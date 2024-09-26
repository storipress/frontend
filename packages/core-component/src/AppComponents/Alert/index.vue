<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'
import Icon from '../Icon/index.vue'
import { classname } from './classname'
import type { AlertType } from './definition'

const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  alertIcon: {
    type: String,
    default: 'warning',
  },
  type: {
    type: String as PropType<AlertType>,
    default: 'info',
    validator: (value: string) => {
      return ['info', 'warning', 'danger'].includes(value)
    },
  },
})
const borderColor = computed(() => {
  return classname[props.type].borderColor
})
const backgroundColor = computed(() => {
  return classname[props.type].backgroundColor
})
const textColor = computed(() => {
  return classname[props.type].textColor
})
</script>

<template>
  <div class="flex max-w-[34rem] rounded border px-5 py-4" :class="[borderColor, backgroundColor]">
    <div class="mr-4">
      <Icon :icon-name="alertIcon" class="text-xl" :class="textColor" />
    </div>

    <div>
      <div class="text-heading mb-1">
        {{ message }}
      </div>
      <slot name="description">
        <div class="text-body">
          {{ description }}
        </div>
      </slot>
    </div>
  </div>
</template>
