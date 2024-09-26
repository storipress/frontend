<script setup lang="ts">
import { useForwardProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import ErrorBoundary from './ErrorBoundary.vue'
import type { Props } from './Provider.vue'
import Provider from './Provider.vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<KanbanRootProps>()

interface KanbanRootProps extends Props {
  class?: HTMLAttributes['class']
}

const forwardedProps = useForwardProps(props)
</script>
<template>
  <ErrorBoundary>
    <Provider v-bind="forwardedProps" />
  </ErrorBoundary>
</template>
