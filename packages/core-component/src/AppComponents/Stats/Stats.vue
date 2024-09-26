<script lang="ts" setup>
import { computed } from 'vue'
import Icon from '../Icon/index.vue'
import type { StatsProp } from './definitions'

defineOptions({
  name: 'SpStats',
})

const props = withDefaults(defineProps<StatsProp>(), {
  title: '',
  content: '',
  percentageValue: 0,
  afterword: '',
})

const iconName = computed<string>(() => (props.percentageValue >= 0 ? 'arrow-up' : 'arrow-down'))
const percentageValueColor = computed<string>(() => (props.percentageValue >= 0 ? 'text-emerald-600' : 'text-red-600'))
</script>

<template>
  <div class="layer-1 max-w-xs rounded-lg bg-white p-3">
    <p class="text-body mb-1 truncate leading-normal text-stone-700">
      {{ title }}
    </p>
    <div class="flex">
      <p class="text-display-large shrink-0 truncate font-medium leading-tight text-stone-500">
        {{ content }}
      </p>
      <p
        v-if="percentageValue"
        class="text-body flex-1 self-end truncate pb-0.5 text-right leading-normal"
        :class="[percentageValueColor]"
      >
        <Icon :icon-name="iconName" />
        {{ Math.abs(percentageValue) }}%
        {{ afterword }}
      </p>
    </div>
  </div>
</template>
