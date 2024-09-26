<script setup lang="ts">
import { Buttons, Checkbox, HoverHint, Icon } from '@storipress/core-component'
import { logicNot } from '@vueuse/math'
import type { Shopify } from '../../../utils'
import { InfoDialog } from '~/components/Integrations'

const props = defineProps<{
  visible: boolean
  img: string
  isActivated: boolean
  integrationData: Shopify
  querySetup: string | null
}>()
const emit = defineEmits<{
  'update:integrationData': []
  completeInstructions: []
}>()

const integrationData = useVModel(props, 'integrationData', emit)
const querySetup = useVModel(props, 'querySetup', emit)

const checked = ref(false)
whenever(
  logicNot(() => props.visible),
  () => {
    clearFirstSetupFlag()
    checked.value = false
  },
)
function clearFirstSetupFlag() {
  querySetup.value = null
}

function onOpenShopifyBlog() {
  if (integrationData.value?.domain) {
    window.open(`https://${integrationData.value.domain}${integrationData.value.prefix}`, '_blank', 'noopener')

    integrationData.value.first_setup_done = true
    emit('completeInstructions')
  }
}
</script>

<template>
  <InfoDialog
    :img="img"
    title="Add your new blog to your Shopify Nav"
    content="Your new blog isn’t connected to your theme yet. Integrate it by following these instructions:"
  >
    <template #buttonArea>
      <div class="m-auto w-80 text-center">
        <Buttons is-shadow class="mb-8 text-zinc-600">
          <a
            href="https://help.storipress.com/shopify-integration/rJZWQTYeP3YtntrCBi8cWb/adding-the-blog-to-your-navigation/2tnBwVvsdESAmQfmQwEfNR"
            rel="noopener noreferrer"
            target="_blank"
            class="-mx-4 -my-2.5 flex items-center px-4 py-2.5"
          >
            Continue Integration Setup<Icon icon-name="arrow_right" class="ml-2 text-[1rem]" />
          </a>
        </Buttons>

        <!-- Confirmation Checkbox -->
        <div class="mb-6">
          <Checkbox v-model="checked" />
          <span class="text-body text-neutral-800"> I confirm I have added the blog to my navbar </span>
        </div>

        <!-- Go to your new blog Button -->
        <HoverHint :disabled="isActivated">
          <Buttons
            type="main"
            :color="isActivated ? 'primary' : undefined"
            is-shadow
            :disabled="!checked"
            class="min-w-[11rem]"
            @click="onOpenShopifyBlog"
          >
            Go to your new blog
            <Icon icon-name="arrow_right" class="ml-2 text-[1rem]" />
          </Buttons>
          <template #content>Please activate Shopify integration</template>
        </HoverHint>
      </div>
    </template>
  </InfoDialog>
</template>
