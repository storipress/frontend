<script setup lang="ts">
import WebflowSvg from '@assets/icons-webflow.svg'
import { LoadingSpinner, NOTIFICATION_KEY } from '@storipress/core-component'
import type { NestedHooks } from 'hookable'
import { mergeHooks } from 'hookable'
import { INTEGRATIONS_INFO } from '../../definition'
import { Steps, useStepManager } from './composables/useWebflowIntegration'
import BasicDialog from './components/BasicDialog.vue'
import WebflowNotify from './components/WebflowNotify.vue'
import type { WebflowHooks } from './composables/definition'
import { useWebflowState } from './composables'
import { Integrations, useTutorials } from '~/composables'

const props = defineProps<{
  modelValue: boolean
  hooks?: NestedHooks<WebflowHooks>
}>()

const { setTutorials } = useTutorials()
const notifications = inject(NOTIFICATION_KEY)
const webflowHooks: NestedHooks<WebflowHooks> = {
  async afterAuth() {
    await setTutorials('setDomain')
  },
  afterOnboarding() {
    notifications?.({
      title: 'webflow setting completed',
      type: 'primary',
      content: 'webflow setting completed.',
    })
  },
}

const route = useRoute()
const { currentStep, context, visible, isLoading, setCurrentStep } = useStepManager(
  mergeHooks(props.hooks ?? {}, webflowHooks),
)
const { webflowActivated } = useWebflowState()
const modelValue = useVModel(props)
syncRef(modelValue, visible)

const loading = computed(() => isLoading.value)
setCurrentStep(Steps.Connect)

const webflowIntegration = INTEGRATIONS_INFO[Integrations.Webflow]
const IGNORE = new Set(['clientID-onboarding-first-feature', 'clientID-onboarding-migrate'])
const showNotify = computed(() => {
  return (
    context.isReady.value &&
    webflowActivated.value &&
    !IGNORE.has(route.name as string) &&
    context.hasAuthorized.value &&
    !context.hasCompletedOnboarding.value
  )
})
</script>

<template>
  <BasicDialog
    v-model="visible"
    :label="webflowIntegration.name"
    :info="webflowIntegration.info"
    :img="WebflowSvg"
    v-bind="$attrs"
  >
    <div v-if="loading" class="flex min-h-[27rem] flex-col">
      <LoadingSpinner show spin-width="w-[6.25rem]" class="mt-[6.625rem]" />
      <p v-if="Boolean(context.loadingMessage.value)" class="text-display-medium mt-14 text-center text-neutral-800">
        {{ context.loadingMessage.value }}
      </p>
    </div>
    <component
      :is="currentStep?.component"
      v-else
      v-bind="currentStep?.props"
      :is-activated="webflowActivated"
      v-on="currentStep?.events"
    />
  </BasicDialog>

  <WebflowNotify v-if="showNotify" @click-notify="visible = true" />
</template>
