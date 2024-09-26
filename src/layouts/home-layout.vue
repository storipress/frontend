<script setup lang="ts">
import { onBeforeMount, ref, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type {
  EventClickStepDataInterface,
  SearchDataInterface,
  UserInfoInterface,
  WorkspaceInfoInterface,
} from '~/components/Navbar'
import Navbar from '~/components/Navbar'
import PageLoadingMask from '~/components/PageLoadingMask'
import WarningNotificationProvider from '~/components/WarningNotificationProvider'
import { useTutorials } from '~/composables'
import { usePublicationPermission } from '~/composables/permission/publication'
import { env } from '~/env'
import { useCheckIfNoAuthRedirect } from '~/hooks/useRedirect'
import { getAvatarURL } from '~/lib/avatar'
import { useFeatureFlag } from '~/lib/feature-flag'
import { useMeStore } from '~/stores/me'
import { useSearchConditionStore } from '~/stores/search-condition'
import { useSiteStore } from '~/stores/site'
import { useWorkspaceStore } from '~/stores/workspace'

const searchConditionStore = useSearchConditionStore()

const searchConditionState = computed<SearchDataInterface>({
  get: () => ({
    text: unref(searchConditionStore.text),
    people: unref(searchConditionStore.people),
    tags: unref(searchConditionStore.tags),
    range: unref(searchConditionStore.range),
    desks: unref(searchConditionStore.desks),
    plans: unref(searchConditionStore.plans),
  }),
  set: (data) => searchConditionStore.$patch(data),
})

const workspaceStore = useWorkspaceStore()
const meStore = useMeStore()
const siteStore = useSiteStore()

const open = ref(false)
provide('openKanbanLeftHandNavPanel', open)

useCheckIfNoAuthRedirect(() => {
  workspaceStore.prepareForUsing()
  meStore.prepareForUsing()
})

const route = useRoute()
const router = useRouter()

const { clickCustomiseTheme } = useTutorials()

const currentCategory = computedEager<string>(() => {
  if (/^\/[^/]+\/articles/.test(route.fullPath)) {
    return 'Articles'
  } else if (/^\/[^/]+\/scheduler/.test(route.fullPath)) {
    return 'Scheduler'
  } else if (/^\/[^/]+\/members/.test(route.fullPath)) {
    return 'Members'
  }

  return ''
})

siteStore.fetchSite()
const currentWorkspace = computed<WorkspaceInfoInterface>(() => {
  const temp = workspaceStore.currentWorkspace
  return {
    id: temp?.id ?? '',
    name: temp?.name ?? '',
    domain: siteStore.site?.customer_site_domain ?? '',
  }
})
const workspaceList = computed<WorkspaceInfoInterface[]>(() => {
  return (
    workspaceStore.workspaces?.map<WorkspaceInfoInterface>((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      domain: workspace.customer_site_domain || `${workspace.workspace}.${env.VITE_STORIPRESS_DOMAIN}`,
    })) ?? []
  )
})

const userInfo = computed<UserInfoInterface>(() => {
  return {
    name: meStore.me?.full_name ?? '',
    avatarSrc: meStore.me?.avatar ?? getAvatarURL(meStore.me?.full_name),
  }
})

const siteTutorials = computed(() => siteStore.siteTutorials)

siteStore.fetchSiteTutorials()

onBeforeMount(() => {
  if (searchConditionStore.persist) return
  searchConditionStore.$reset()
})

const waitingPageLoading = ref<{ show: boolean; visible: boolean }>({
  show: false,
  visible: false,
})
function handleLoading(options = { type: 'opacity' }) {
  waitingPageLoading.value = {
    show: true,
    visible: options.type !== 'opacity',
  }
}
function handleReady() {
  waitingPageLoading.value = { show: false, visible: false }
}

const onOpenDesk = ref(false)
provide('setCreateDesks', onOpenDesk)

const enableMembers = useFeatureFlag('members')
const { canAccessMember } = usePublicationPermission()

function handleClickGuideStep($event: EventClickStepDataInterface) {
  if ($event.path) {
    router.replace(`/${currentWorkspace.value.id}${$event.path}`)
  } else {
    switch ($event.key) {
      case 'setCreateDesks':
        onOpenDesk.value = true
        break
      case 'setCustomiseTheme':
        clickCustomiseTheme()
        break
    }
  }
}
</script>

<template>
  <WarningNotificationProvider>
    <div class="flex min-h-screen flex-col bg-stone-100">
      <Navbar
        v-model:search-value="searchConditionState"
        class="fixed z-30 flex-shrink-0 flex-grow-0"
        :highlight-link="currentCategory"
        :placeholder="route.meta.searchPlaceholder"
        :show-member="enableMembers && canAccessMember"
        :guide-progress="siteTutorials"
        :workspace="currentWorkspace"
        :workspace-list="workspaceList"
        :user-info="userInfo"
        :search-input-type="route.meta.searchInputType"
        @click-step="handleClickGuideStep"
        @click-menu="open = true"
      />
      <main class="mt-14 flex-grow-0">
        <router-view @loading="handleLoading" @ready="handleReady" />
      </main>
      <PageLoadingMask v-bind="waitingPageLoading" />
    </div>
  </WarningNotificationProvider>
</template>
