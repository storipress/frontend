<script setup lang="ts">
import WpAuthorized from './components/Authorized.vue'
import WpUnauthorized from './components/Unauthorized.vue'
import { BasicDialog } from '~/components/Integrations'
import { GetWordpressAuthorizedDocument } from '~/graphql-operations'

const props = defineProps<{
  modelValue: boolean
  label: string
  info: string
  img: string
}>()
const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  disconnect: []
}>()

const visible = useVModel(props, 'modelValue', emit)

const { result, refetch } = useQuery(GetWordpressAuthorizedDocument)

const hasAuthorized = computed(() => result.value?.wordPressAuthorized)

async function onDisconnect() {
  await refetch()
  emit('disconnect')
  emit('update:modelValue', false)
}
</script>

<template>
  <BasicDialog v-model="visible" :img="img" :integration-name="label" :info="info">
    <WpAuthorized v-if="hasAuthorized" :img="img" @disconnect="onDisconnect" />
    <WpUnauthorized v-else />
  </BasicDialog>
</template>
