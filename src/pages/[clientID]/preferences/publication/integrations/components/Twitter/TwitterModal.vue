<script setup lang="ts">
import type { Twitter } from '../../utils'
import TwitterAuthorized from './components/Authorized.vue'
import { AuthorizationView, BasicDialog } from '~/components/Integrations'

const props = defineProps<{
  modelValue: boolean
  label: string
  info: string
  img: string
  hasAuthorized: boolean
  integrationData: Twitter
}>()
const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  connect: []
  disconnect: []
}>()

const visible = useVModel(props, 'modelValue', emit)
</script>

<template>
  <BasicDialog v-model="visible" :img="img" :integration-name="label" :info="info">
    <TwitterAuthorized
      v-if="hasAuthorized"
      :integration-img="img"
      :integration-data="integrationData"
      @disconnect="$emit('disconnect')"
    />
    <AuthorizationView v-else :integration-img="img" @connect="$emit('connect')" @back="visible = false" />
  </BasicDialog>
</template>
