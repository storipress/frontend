<script setup lang="ts">
import { Buttons as SpButton, Inputs as SpInput } from '@storipress/core-component'

const props = withDefaults(defineProps<{ enable?: boolean; code?: string }>(), {
  code: '',
  enable: false,
})

const emit = defineEmits<(event: 'submit', value: string) => void>()

const couponCode = ref('')

watch(
  () => props.code,
  (code) => {
    if (code === couponCode.value) return
    couponCode.value = code
  },
)
</script>

<template>
  <form
    class="mt-4 flex rounded-lg bg-white p-5 pt-[1.375rem] shadow-1-layer"
    :class="{ 'opacity-50': !enable }"
    @submit.prevent="emit('submit', couponCode)"
  >
    <SpInput
      v-model="couponCode"
      class="flex-1"
      html-type="text"
      placeholder="Coupon code"
      html-name="couponCode"
      :disabled="!enable"
    />
    <SpButton class="ml-4" type="main" color="primary" html-type="submit" :disabled="!enable">
      Add coupon code
    </SpButton>
  </form>
</template>
