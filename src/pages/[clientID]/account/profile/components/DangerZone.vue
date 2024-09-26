<script setup lang="ts">
import { Buttons, Destructive, HoverHint } from '@storipress/core-component'
import * as Sentry from '@sentry/vue'
import { DeleteAccountDocument, GetBillingDocument } from '~/graphql-operations'
import { clients } from '~/lib/apollo'
import { useAuthStore } from '~/stores/auth'

const visible = ref(false)
const authStore = useAuthStore()

const { result: billingResult } = useQuery(GetBillingDocument)
const hasSubscribed = computed(() => {
  return billingResult.value?.billing.subscribed && !billingResult.value?.billing.canceled
})

async function deleteAccount(password: string) {
  const client = clients.default
  try {
    const result = await client.mutate({
      mutation: DeleteAccountDocument,
      variables: { password },
    })
    if (result?.data?.deleteAccount) {
      visible.value = false
      authStore.$reset()
      window.location.href = '/auth/login'
    }
  } catch (error) {
    Sentry.captureException(error)
  }
}

function onShowDestructive() {
  if (hasSubscribed.value) return
  visible.value = true
}
</script>

<template>
  <SectionContent
    sub-title="Danger Zone"
    content="Delete your data. Proceed with caution: incorrectly applying these settings may have unintended effects."
    class="relative"
  >
    <template #content>
      <div class="flex items-center justify-between gap-x-2">
        <div class="text-body">
          <span class="mb-2 block text-stone-800">Delete Account</span>
          <span class="block text-stone-500">Delete your account. Once deleted, all user data is non-recoverable.</span>
        </div>
        <component :is="hasSubscribed ? HoverHint : 'div'">
          <Buttons is-shadow is-border type="main" color="warning" :disabled="hasSubscribed" @click="onShowDestructive">
            Delete
          </Buttons>
          <template #content>You still have a paid plan. Please unsubscribe first</template>
        </component>
      </div>
    </template>
  </SectionContent>

  <Destructive
    :visible="visible"
    title="Nuke all: Are you absolutely sure?"
    confirm-value="your password"
    button-text="delete account"
    input-type="password"
    :error-proof="false"
    @on-modal-close="visible = false"
    @on-click-delete="deleteAccount"
  >
    <div class="mt-1">
      <span class="font-bold">Warning:</span> this will permanently delete your account, your owned publications and
      associated data from our servers, forever. If you are on a paid plan, you must cancel your plan first before
      taking this action.
    </div>
  </Destructive>
</template>

<style scoped></style>
