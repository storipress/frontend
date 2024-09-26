<script setup lang="ts">
import { Buttons as SpButton } from '@storipress/core-component'

const props = withDefaults(
  defineProps<{
    enabled?: boolean
    title: string
    subtitle: string
    price: string
    buttonText: string
  }>(),
  {
    enabled: true,
    title: '',
    subtitle: '',
    price: '',
    buttonText: '',
  },
)

const emit = defineEmits<{ buttonClick: [] }>()

defineSlots<{
  default: () => void
}>()
</script>

<template>
  <article class="layer-1 flex-1 rounded-lg bg-white p-5 pb-6 text-stone-800">
    <h3 class="text-display-small mb-1">{{ props.title }}</h3>
    <p class="text-body mb-6">{{ props.subtitle }}</p>
    <p class="text-display-small mb-4 min-h-[1.5rem]">{{ props.price }}</p>
    <SpButton type="main" color="primary" :disabled="!enabled" class="mb-8 block w-full" @click="emit('buttonClick')">{{
      props.buttonText
    }}</SpButton>
    <slot />
  </article>
</template>

<style scoped></style>
