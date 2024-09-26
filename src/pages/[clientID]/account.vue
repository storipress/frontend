<route lang="yaml">
meta:
  transition: settings
</route>

<script lang="ts" setup>
import spLogo from '@storipress/core-component/assets/images/icons/settings/sp-logo-white.svg'
import type { AccountState } from './account/definition'
import { SymbolAccountState } from './account/definition'
import Sidebar from '~/components/SettingsSidebar/index.vue'
import Navbar from '~/components/SettingsNavbar/index.vue'

import { useWorkspaceStore } from '~/stores/workspace'
import type { GetMeQuery } from '~/graphql-operations'
import { GetMeAccountDocument } from '~/graphql-operations'
import { useAccountPermission } from '~/composables/permission/account'
import { useFeatureFlag } from '~/lib/feature-flag'

const { canUseBilling } = useAccountPermission()

const workspaceStore = useWorkspaceStore()
const route = useRoute()
const router = useRouter()
const { result } = useQuery(GetMeAccountDocument)
const me = computed(() => {
  return result.value?.me ?? ({} as GetMeQuery['me'])
})
const enableBilling = useFeatureFlag('billing')
const navigation = computed(() => {
  const clientID = workspaceStore.currentWorkspace?.id || '_'
  const baseUrl = `/${clientID}/account/`
  const list = [
    { name: 'My profile', icon: 'user', path: `${baseUrl}profile` },
    { name: 'Security', icon: 'lock-filled', path: `${baseUrl}security` },
    { name: 'Publications', icon: 'publication', path: `${baseUrl}publications` },
  ]
  if (enableBilling.value && canUseBilling.value) {
    list.push({ name: 'Billing & Earnings', icon: 'billing', path: `${baseUrl}billing` })
  }
  return list
})

// it is hack method, ref:https://stackoverflow.com/a/70965943
function onCloseNavbar() {
  const lastPath = router?.options?.history?.state?.back
  const url = route.params.clientID === '_' ? '/workspaces' : `/${route.params.clientID}/articles/desks/all`
  return lastPath ? router.back() : router.push(url)
}

const accountState = reactive<AccountState>({
  showSidebar: true,
})
provide(SymbolAccountState, accountState)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Navbar class="fixed w-full" @on-close-navbar="onCloseNavbar">
      <img :src="spLogo" />
    </Navbar>
    <div class="min-w-fit flex-1 bg-stone-100 pt-14">
      <div class="mx-auto flex h-full max-w-[90rem] px-32 pb-[3.75rem] pt-8">
        <Sidebar
          v-if="accountState.showSidebar"
          class="sticky top-[5.563rem] mr-8 w-72 min-w-[18rem]"
          :list="navigation"
        >
          <div class="text-body mb-1 text-stone-400">Account Settings</div>
          <div class="text-display-small text-stone-600">{{ me.full_name }}</div>
        </Sidebar>
        <router-view />
      </div>
    </div>
  </div>
</template>

<style></style>
