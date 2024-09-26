<script setup lang="ts">
import HubspotAuthorized from './components/Authorized.vue'
import { AuthorizationView, BasicDialog } from '~/components/Integrations'

const props = defineProps<{
  modelValue: boolean
  label: string
  info: string
  img: string
  hasAuthorized: boolean
}>()

defineEmits<{
  'update:modelValue': [val: boolean]
  connect: []
  disconnect: []
}>()

const visible = useModel(props, 'modelValue')
</script>

<template>
  <BasicDialog v-model="visible" :img="img" :integration-name="label" :info="info">
    <HubspotAuthorized v-if="hasAuthorized" :integration-img="img" @disconnect="$emit('disconnect')" />
    <AuthorizationView v-else :integration-img="img" @connect="$emit('connect')" @back="visible = false" />
  </BasicDialog>
</template>
