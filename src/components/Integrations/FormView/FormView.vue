<script setup lang="ts">
import { Buttons } from '@storipress/core-component'
import { Form as VeeForm } from 'vee-validate'
import type { SubmissionContext } from 'vee-validate'
import type { AnySchema } from 'yup'
import SharedLayout from '../SharedLayout/SharedLayout.vue'

withDefaults(
  defineProps<{
    validationSchema?: AnySchema
    isActivated?: boolean
    disableSubmit?: boolean
  }>(),
  { validationSchema: undefined, isActivated: false, disableSubmit: false },
)
const emit = defineEmits<{
  closeModel: []
  deactivate: [{ values: Record<string, unknown>; ctx: SubmissionContext }]
  activate: [{ values: Record<string, unknown>; ctx: SubmissionContext }]
  update: [{ values: Record<string, unknown>; ctx: SubmissionContext }]
}>()

function onActivate(values: Record<string, unknown>, ctx: SubmissionContext) {
  emit('activate', { values, ctx })
}

function onDeactivate(values: Record<string, unknown>, ctx: SubmissionContext) {
  emit('deactivate', { values, ctx })
}

function onUpdate(values: Record<string, unknown>, ctx: SubmissionContext) {
  emit('update', { values, ctx })
}
</script>

<template>
  <form @submit.prevent>
    <VeeForm v-slot="{ handleSubmit }" :validation-schema="validationSchema" as="div">
      <SharedLayout>
        <template #content>
          <slot />
        </template>

        <template #footer>
          <slot name="formFooter" v-bind="{ handleSubmit }">
            <template v-if="isActivated">
              <Buttons
                type="main"
                color="warning"
                class="mr-2"
                aria-label="deactivate-integration"
                @click="handleSubmit($event, onDeactivate)"
              >
                Deactivate
              </Buttons>
              <Buttons
                type="main"
                color="primary"
                html-type="submit"
                :disabled="disableSubmit"
                @click="handleSubmit($event, onUpdate)"
              >
                Update Settings
              </Buttons>
            </template>

            <template v-else>
              <Buttons
                type="main"
                color="primary"
                html-type="submit"
                :disabled="disableSubmit"
                @click="handleSubmit($event, onActivate)"
              >
                Activate
              </Buttons>
            </template>
          </slot>
        </template>
      </SharedLayout>
    </VeeForm>
  </form>
</template>
