<script setup lang="ts">
import { Buttons, Destructive, HoverHint, Inputs, NOTIFICATION_KEY } from '@storipress/core-component'
import * as Sentry from '@sentry/vue'
import { joinURL, withQuery } from 'ufo'
import type { PublicationInfo } from './definitions'
import { env } from '~/env'
import { DeleteSiteDocument } from '~/graphql-operations'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'
import { useSiteStore } from '~/stores/site'
import { useWorkspaceStore } from '~/stores/workspace'
import { usePublicationPermission } from '~/composables/permission/publication'
import { watchToDisabledAllContainedInputs } from '~/composables/permission/watch-permission'
import { Integrations, RedirectTarget, useIntegrationUtils, useRedirectPortal, useUploadOtherCMS } from '~/composables'
import { useAuthStore } from '~/stores/auth'
import { HelpButton, HelpCategories } from '~/components/HelpButton'

const props = defineProps<{
  publicationInfo: PublicationInfo
  errors: Record<string, string | undefined>
}>()

const { homepageUrl } = toRefs(props.publicationInfo)

const { canUpdateSettingDangerZone } = usePublicationPermission()
const dangerZoneDivRef = watchToDisabledAllContainedInputs(canUpdateSettingDangerZone)

const visible = ref(false)
const authStore = useAuthStore()
const workspaceStore = useWorkspaceStore()
const router = useRouter()

const { mutate: mutateDeleteSite, loading: loadingDeleteSite } = useMutation(DeleteSiteDocument)

const portal = useRedirectPortal()

function startMigrateSplash() {
  portal({
    to: RedirectTarget.Migration,
    client_id: authStore.clientID,
  })
}

const { isLoading: isLoadingUploadOtherCMS, uploadInputRef, uploadOtherCMS } = useUploadOtherCMS()

const [confirmExportContent] = useConfirmFunction([
  {
    type: 'info',
    title: 'Export publication content',
    description: 'Download all publication content as a JSON file.',
    okText: 'Download',
    cancelText: 'Cancel',
  },
])

const { resultListIntegration, isThirdPartyEnabled } = useIntegrationUtils()
const isSetShopify = isThirdPartyEnabled(Integrations.Shopify)
const isSetWebflow = isThirdPartyEnabled(Integrations.Webflow)
const disabledHomepageUrl = computed(() => Boolean(isSetShopify.value || isSetWebflow.value))

async function onExportContent() {
  if (await confirmExportContent()) {
    window.open(
      withQuery(joinURL(env.VITE_API_HOST, `/client/${authStore.clientID}/takeouts`), {
        'api-token': authStore.token,
      }),
      '_blank'
    )
  }
}

const notifications = inject(NOTIFICATION_KEY)
async function deleteSite(password: string) {
  try {
    const result = await mutateDeleteSite({ password })
    if (result?.data?.deleteSite) {
      visible.value = false
      router.replace('/')
    } else {
      notifications?.({
        title: 'Incorrect password entered',
        type: 'warning',
        iconName: 'warning',
        content: 'Please enter the correct password and try again.',
      })
    }
  } catch (error) {
    Sentry.captureException(error)
  }
}
</script>

<template>
  <SectionContent
    :ref="(element: any) => (dangerZoneDivRef = element && element.$el)"
    sub-title="Danger Zone"
    content="Import, export, and delete your data. Proceed with caution: incorrectly applying these settings may have unintended effects."
    class="relative"
    :class="{
      'opacity-50 after:absolute after:left-0 after:top-0 after:size-full after:content-[\'&nbsp;\']':
        !canUpdateSettingDangerZone,
    }"
  >
    <template #content>
      <HoverHint :disabled="!disabledHomepageUrl">
        <template #default>
          <div class="border-b border-stone-200 pb-5">
            <div :class="{ 'opacity-50': disabledHomepageUrl }">
              <div class="text-body">
                <span class="mb-2 block text-stone-800">Homepage URL</span>
                <span class="mb-1 block text-stone-500">
                  If your blog is a part of another site, assign a custom link when users click your logo.
                </span>
              </div>
            </div>
            <div v-if="resultListIntegration?.integrations.length">
              <Inputs
                v-model="homepageUrl"
                placeholder="https://"
                html-type="text"
                html-name="homepageUrl"
                :show-error="Boolean(errors.homepageUrl)"
                autocomplete="url"
                :disabled="disabledHomepageUrl"
                class="w-full"
              />
            </div>
          </div>
        </template>
        <template #content>No need to set a homepage URL as you have integrated with Shopify or Webflow</template>
      </HoverHint>

      <div class="flex items-center justify-between border-b border-stone-200 py-5">
        <div class="text-body">
          <span class="mb-2 block text-stone-800">
            Migrate content
            <HelpButton :to="HelpCategories.GettingStarted.Migrae" />
          </span>
          <span class="block text-stone-500">Use our migration tools to move content to Storipress.</span>
        </div>
        <Buttons is-shadow is-border type="main" @click="startMigrateSplash">Migrate</Buttons>
      </div>

      <div class="flex items-center justify-between border-b border-stone-200 py-5">
        <div class="text-body">
          <span class="mb-2 block text-stone-800">Import content</span>
          <span class="block text-stone-500">Import articles from another CMS using a .ndjson file.</span>
        </div>
        <input ref="uploadInputRef" type="file" accept=".ndjson" class="hidden" @change="uploadOtherCMS" />
        <Buttons is-shadow is-border type="main" :is-loading="isLoadingUploadOtherCMS" @click="uploadInputRef?.click()">
          Import
        </Buttons>
      </div>

      <div class="flex items-center justify-between border-b border-stone-200 py-5">
        <div class="text-body">
          <span class="mb-2 block text-stone-800">Export your content</span>
          <span class="block text-stone-500">Download all your posts and settings in a single JSON file.</span>
        </div>
        <Buttons is-shadow is-border type="main" @click="onExportContent">Export</Buttons>
      </div>

      <div class="flex items-center justify-between pt-5">
        <div class="text-body">
          <span class="mb-2 block text-stone-800">Delete Publication</span>
          <span class="block text-stone-500">Warning: Once deleted, all data is non-recoverable.</span>
        </div>
        <Buttons is-shadow is-border type="main" color="warning" @click="visible = true">Delete</Buttons>
      </div>
    </template>
  </SectionContent>

  <Destructive
    :visible="visible"
    title="Nuke all: Are you absolutely sure?"
    confirm-value="your password"
    button-text="delete publication"
    input-type="password"
    :error-proof="false"
    :loading="loadingDeleteSite"
    @on-modal-close="visible = false"
    @on-click-delete="deleteSite"
  >
    <span>
      This will delete {{ workspaceStore.currentWorkspace?.name }}, removing all users and permanently deleting all
      content. You will be unable to access this publication again.
    </span>
    <br />
    <br />
    <span>
      This will not change your billing plan. If you want to downgrade, you can do so in your Billing Settings.
    </span>
  </Destructive>
</template>
