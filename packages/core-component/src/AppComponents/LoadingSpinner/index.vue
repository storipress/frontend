<script setup lang="ts">
import spinnerIcon from '../../assets/loading-spinner.svg'

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  tip: {
    type: String,
    require: false,
  },
  tipColor: {
    type: String,
    default: 'text-white',
  },
  spinWidth: {
    type: String,
    default: 'w-16',
  },
})
</script>

<template>
  <div v-if="show" class="flex flex-col items-center">
    <img :class="spinWidth" class="animate-spin" :src="spinnerIcon" />
    <div v-if="tip" :class="tipColor" class="text-body mt-6">
      {{ tip }}
    </div>
  </div>
</template>

<style scoped></style>
