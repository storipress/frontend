<script setup lang="ts">
import { Icon, mergeTailwind } from '@storipress/core-component'

const props = defineProps<{
  iconName: string
  defaultIcon?: string
}>()

const emit = defineEmits<(event: 'show', data: 'default' | 'normal') => void>()

const iconRef = ref()
const showDefaultIcon = ref<boolean>(false)

watch(
  () => [props.iconName],
  () => (showDefaultIcon.value = false),
)
watch(
  iconRef,
  () => {
    if (iconRef.value) {
      const $el = iconRef.value.$el
      showDefaultIcon.value = getComputedStyle($el, ':before')?.getPropertyValue('content') === 'none'
      emit('show', props.defaultIcon && showDefaultIcon.value ? 'default' : 'normal')
    }
  },
  { flush: 'post' },
)
</script>

<template>
  <span :class="mergeTailwind(['flex items-center justify-center', $attrs.class])">
    <icon v-if="!showDefaultIcon" ref="iconRef" :icon-name="iconName"></icon>
    <icon v-if="defaultIcon && showDefaultIcon" class="default-icon" :icon-name="defaultIcon" />
  </span>
</template>

<style scoped></style>
