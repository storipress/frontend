<script setup lang="ts">
import { debounce } from 'lodash-es'

const props = withDefaults(defineProps<{ loading: boolean }>(), {
  loading: true,
})
const loadingDebounce = ref(props.loading)
watch(
  () => props.loading,
  debounce((loading) => (loadingDebounce.value = loading), 75),
)
</script>

<template>
  <transition
    mode="out-in"
    enter-active-class="transition duration-75 ease-out delay-75"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-75 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    appear
  >
    <div v-if="loadingDebounce" class="relative inset-0 overflow-hidden">
      <slot name="loading">Loading...</slot>
    </div>
    <div v-else>
      <slot />
    </div>
  </transition>
</template>
