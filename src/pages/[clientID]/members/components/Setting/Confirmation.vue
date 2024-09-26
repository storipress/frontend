<script lang="ts" setup>
import { Icon, Buttons as SpButton } from '@storipress/core-component'
import { SetupStep } from '../definition'
import { LaunchSubscriptionDocument } from '~/graphql-operations'
import { useMutation } from '~/lib/apollo'

const emit = defineEmits<{
  (event: 'updateStep', step: SetupStep): void
  (event: 'done'): void
  (event: 'error'): void
}>()

const { onDone, onError, mutate } = useMutation(LaunchSubscriptionDocument)

function goBack() {
  return emit('updateStep', SetupStep.Import)
}

onDone(() => {
  emit('done')
})
onError(() => {
  emit('error')
})
</script>

<template>
  <div class="flex w-96 flex-col">
    <p class="text-heading mt-4 text-stone-800">Have a click around! 👉</p>
    <p class="text-body mt-1 text-stone-500">
      You’re all set up to start your subscription service! Have a click around to make sure everything looks good.
    </p>
    <p class="text-body mt-7 text-stone-500">
      You can always make further tweaks to your subscriptions in the subscriptions dashboard.
    </p>
    <div class="flex-1" />
    <div class="flex gap-2">
      <SpButton is-shadow is-border class="h-11 w-20" @click="goBack">
        <icon icon-name="arrow_left" class="text-stone-400" />
      </SpButton>
      <SpButton is-shadow default="Button" type="main" color="primary" class="h-11 flex-1" @click="mutate">
        Launch subscriptions 🚀
        <icon icon-name="arrow_right" icon-right />
      </SpButton>
    </div>
  </div>
</template>

<style></style>
