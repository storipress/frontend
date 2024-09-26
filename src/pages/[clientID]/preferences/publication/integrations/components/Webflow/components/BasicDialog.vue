<script setup lang="ts">
import { BasicDialog } from '~/components/Integrations'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    label: string
    info: string
    img: string
  }>(),
  {},
)
const emit = defineEmits<{
  (event: 'update:modelValue', val: boolean): void
  (event: 'closeModel'): void
}>()

const visible = useVModel(props, 'modelValue', emit)
</script>

<template>
  <BasicDialog v-model="visible" :img="img" :integration-name="label" :info="info">
    <slot />
  </BasicDialog>
</template>
