<route lang="yaml">
meta:
  transition: settings
</route>

<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
import Sidebar from '~/components/SettingsSidebar/index.vue'
import Navbar from '~/components/SettingsNavbar/index.vue'
import { UserInvite } from '~/components/UserInvite'
import RoleInfo from '~/components/UserInvite/RoleInfo.vue'
import { useMeStore } from '~/stores/me'
import { useWorkspaceStore } from '~/stores/workspace'
import { useSiteStore } from '~/stores/site'
import { usePublicationPermission } from '~/composables/permission/publication'
import { RolesTitleMap } from '~/composables/roles'
import type { RoleKeys } from '~/utils/definition'
import { OpenTransition } from '~/components/Transitions'
import { Flags, useFeatureFlag } from '~/lib/feature-flag'
import { useGoBackOrPath, useUserSubscription } from '~/composables'
import { env } from '~/env'

const { canAccessIntegrations, canAccessDomains } = usePublicationPermission()
const { isPlusPlan } = useUserSubscription()

const meStore = useMeStore()
const workspaceStore = useWorkspaceStore()
const siteStore = useSiteStore()

siteStore.fetchSite()

const currentRole = computed(() => {
  const role = meStore.me?.role as RoleKeys
  if (role) return RolesTitleMap[role]
  return null
})
const siteName = computed(() => siteStore.site?.name)

const route = useRoute()

const enabledCustomSite = useFeatureFlag(Flags.CustomSite)
const enableAILinter = useFeatureFlag(Flags.AiLinter)
const navigation = computed(() => [
  { name: 'Publication details', icon: 'publication', path: 'details' },
  { name: 'Team', icon: 'team', path: 'team' },
  ...(canAccessIntegrations.value ? [{ name: 'Integrations', icon: 'integrations', path: 'integrations' }] : []),
  ...(enableAILinter.value && isPlusPlan.value
    ? [{ name: 'Brand Voice & Style Guide', icon: 'fountain_pen_tip', path: 'style-guide' }]
    : []),
  ...(enabledCustomSite.value ? [{ name: 'Newstand API', icon: 'api', path: 'api' }] : []),
  ...(canAccessDomains.value ? [{ name: 'Custom Email', icon: 'web', path: 'domains' }] : []),
])

const onCloseNavbar = useGoBackOrPath(() => `/${route.params.clientID}/articles/desks/all`)
function onGoToHomepage() {
  window.open(`https://${workspaceStore.currentWorkspace?.workspace}.${env.VITE_STORIPRESS_DOMAIN}`)
}

const showRoleInfo = ref(false)
const isFocus = ref(false)
let timeId: NodeJS.Timeout

function clearTimer() {
  clearTimeout(timeId)
  showRoleInfo.value = false
}

watch(isFocus, (val) => {
  if (val) {
    timeId && clearTimeout(timeId)
    showRoleInfo.value = true
  } else {
    timeId = setTimeout(() => {
      showRoleInfo.value = false
    }, 1000)
  }
})
watch(route, ({ name }) => {
  if (name !== 'clientID-preferences-publication-team' && timeId) {
    clearTimer()
  }
})
</script>

<template>
  <div>
    <Navbar class="fixed w-full" @on-close-navbar="onCloseNavbar">
      <Icon icon-name="settings" class="text-3xl text-[#4f4f4f]" />
    </Navbar>
    <div class="min-w-fit bg-stone-100 pt-14">
      <div class="mx-auto flex h-full min-h-[calc(100vh-3.5rem)] max-w-[90rem] px-32 pb-44 pt-8">
        <div class="sticky top-[4rem] mr-8 h-min w-72 min-w-[18rem]">
          <Sidebar :list="navigation">
            <div class="text-body mb-1 text-stone-400">{{ currentRole }}</div>
            <div class="flex items-center">
              <div class="text-display-small truncate text-stone-600">{{ siteName }}</div>
              <Icon icon-name="goto-url" class="ml-3 cursor-pointer text-sm text-stone-600" @click="onGoToHomepage" />
            </div>
          </Sidebar>
          <UserInvite
            v-if="route.name === 'clientID-preferences-publication-team'"
            class="mt-2"
            @focus="isFocus = true"
            @blur="isFocus = false"
          />
        </div>
        <router-view :publication-name="siteName ?? ''" />
      </div>
    </div>
    <Teleport to="body">
      <div class="pointer-events-none fixed inset-0 flex flex-col justify-end gap-4 p-4">
        <OpenTransition>
          <RoleInfo v-if="showRoleInfo" />
        </OpenTransition>
      </div>
    </Teleport>
  </div>
</template>
