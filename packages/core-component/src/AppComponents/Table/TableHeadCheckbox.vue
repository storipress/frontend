<script setup lang="ts">
import { useModel } from 'vue'
import Checkbox from '../Checkbox/index.vue'

const props = defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [boolean]
}>()

const checked = useModel(props, 'modelValue')
</script>

<template>
  <th class="px-4" scope="col">
    <Checkbox v-model="checked" />
  </th>
</template>
