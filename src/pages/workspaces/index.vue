<route lang="yaml">
meta:
  layout: workspaces
</route>

<script setup lang="ts">
import { Buttons } from '@storipress/core-component'
import { logicNot } from '@vueuse/math'
import { pick } from 'lodash-es'
import { captureException } from '@sentry/vue'
import type { WorkspacesTabs } from './definition'
import { useRedirectTargets } from './use-redirect-targets'
import { useChoosePublicationAction } from './use-choose-publication-action'
import SpTabs from '~/components/Workspaces/Tabs/Tabs.vue'
import SpTab from '~/components/Workspaces/Tab/Tab.vue'
import TabCard from '~/components/Workspaces/TabCard/TabCard.vue'
import { useLoading, useMeMeta } from '~/composables'
import { useAuthStore } from '~/stores/auth'
import { useWorkspaceStore } from '~/stores/workspace'
import { GetBillingDocument } from '~/graphql-operations'

useHead({
  title: 'Your publications - Storipress',
})

const { hasAction, handleAction, includeTabs, message } = useChoosePublicationAction()

const activeTab = ref('')
const tabs: Record<string, WorkspacesTabs> = reactive({
  owner: { name: 'Owner', tabKey: 'owner', count: 0 },
  admin: { name: 'Admin', tabKey: 'admin', count: 0 },
  editor: { name: 'Editor', tabKey: 'editor', count: 0 },
  other: { name: 'Other', tabKey: 'other', count: 0 },
})

const displayTabs = computed(() => {
  if (includeTabs.value) {
    return pick(tabs, includeTabs.value)
  }
  return tabs
})

const OTHER_TABS_ROLE = new Set(['author', 'contributor'])
const workspaceStore = useWorkspaceStore()
workspaceStore.$reset()
const workspaces = computed(() => workspaceStore.workspaces ?? [])
const store = useAuthStore()

const { userMeta, setUserMeta } = useMeMeta()
const isFirstEntry = computed(() => !userMeta.value?.hasEnteredWorkspaces)

const { result: billingResult, loading: loadingBilling } = useQuery(GetBillingDocument, undefined, {
  fetchPolicy: 'network-only',
})
const { createPublicationTarget, workspaceLinks } = useRedirectTargets({
  billingResult,
  workspaces,
  userMeta,
  workspaceStore,
})
const currentWorkspaces = computed(() => (role: string) => {
  return workspaces.value.filter((workspace) => {
    if (role === 'other') return OTHER_TABS_ROLE.has(workspace.role)
    return workspace.role === role
  })
})

function reset() {
  for (const tab of Object.values(tabs)) {
    tab.count = 0
  }
}

const checkProfile = computed(
  () =>
    workspaces.value.length > 0 &&
    Object.keys(workspaceStore.userShouldFieldProfile).length === workspaces.value.length &&
    !loadingBilling.value,
)

const targetLinks = computed(() => {
  return new Map(workspaceLinks.value)
})

function getTargetLinks(id: string) {
  const link = targetLinks.value.get(id)
  if (link) {
    return link
  }
  captureException(new Error('workspace link not exists'), (scope) => {
    scope.setContext('workspace', { id })
    return scope
  })
  return '#'
}

function setDefaultTab() {
  activeTab.value =
    Object.entries(tabs).find((item) => {
      const { count } = item[1]

      return count !== 0
    })?.[0] ?? ''
}

const { ready } = useLoading()
if (!store.isAuth) {
  ready()
} else {
  const loading = computed(() => !workspaceStore.workspaces)
  whenever(logicNot(loading), () => ready())
  watch(
    workspaces,
    (value) => {
      reset()
      value.forEach((item) => {
        if (OTHER_TABS_ROLE.has(item.role)) {
          tabs.other.count++
        } else {
          tabs[item.role].count++
        }
      })
      setDefaultTab()
    },
    { deep: true, immediate: true },
  )
}

function handleWorkspaceClick(input: { event: Event; clientId: string; navigate: () => void }) {
  if (isFirstEntry.value) {
    setUserMeta({ hasEnteredWorkspaces: true })
  }

  handleAction(input)
}
</script>

<template>
  <div class="w-auto px-4 md:w-[28.5rem] md:px-0">
    <div class="mb-[3.3rem] flex justify-between">
      <div class="text-pageheading pt-1.5 md:text-display-large">{{ message }}</div>
      <router-link v-if="!hasAction" v-slot="{ navigate }" :to="createPublicationTarget" custom>
        <Buttons type="main" class="transition-colors duration-200" color="primary" is-shadow @click="navigate">
          Create new site
        </Buttons>
      </router-link>
    </div>

    <SpTabs v-model="activeTab" :tab-list="Object.values(displayTabs)">
      <SpTab :tab-key="activeTab">
        <template v-if="checkProfile">
          <router-link
            v-for="workspace in currentWorkspaces(activeTab)"
            :key="workspace.id"
            v-slot="{ navigate }"
            :to="getTargetLinks(workspace.id)"
            :custom="hasAction"
          >
            <TabCard
              :title="workspace.name"
              :info="workspace.custom_domain || workspace.workspace"
              :image="workspace.favicon"
              :highlight-invited="workspace.role !== 'owner' && isFirstEntry"
              class="mb-4"
              @click="handleWorkspaceClick({ event: $event, navigate, clientId: workspace.id })"
            />
          </router-link>
        </template>
      </SpTab>
    </SpTabs>
  </div>
</template>

<style lang="scss" scoped>
:deep .tab-content {
  @apply mt-10;
}
</style>
