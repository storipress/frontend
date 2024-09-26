<script setup lang="ts">
import type { Facebook } from '../../utils'
import FacebookAuthorized from './components/Authorized.vue'
import { AuthorizationView, BasicDialog } from '~/components/Integrations'

const props = defineProps<{
  modelValue: boolean
  label: string
  info: string
  img: string
  hasAuthorized: boolean
  integrationData: Facebook
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
    <FacebookAuthorized
      v-if="hasAuthorized"
      :integration-img="img"
      :integration-data="integrationData"
      @disconnect="$emit('disconnect')"
    />
    <AuthorizationView v-else :integration-img="img" @connect="$emit('connect')" @back="visible = false">
      <template #outsideContent>
        <div class="mt-3.5">
          <span class="text-caption text-stone-400"
            >Note: Due to policy adjustments by Facebook, linking to Business pages is currently unavailable.</span
          >
        </div>
      </template>
    </AuthorizationView>
  </BasicDialog>
</template>
