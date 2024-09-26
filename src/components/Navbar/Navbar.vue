<!-- navbar parent -->
<script lang="ts" setup>
import type {
  EventClickStepDataInterface,
  SearchDataInterface,
  TutorialKeyType,
  UserInfoInterface,
  WorkspaceInfoInterface,
} from './definition'
import logo from '@assets/logomark-l.svg'
// Importing necessary modules and components
import { Icon, mergeTailwind } from '@storipress/core-component'
import { stubArray, stubObject } from 'lodash-es'
import { UsedFeature, useUsedFeature, useUserSubscription } from '~/composables'
import { usePublicationPermission } from '~/composables/permission/publication'
import { SearchInputType } from './definition'
import GuideProgress from './GuideProgress.vue'
import NavbarLink from './NavbarLink.vue'
import SearchInput from './SearchInput.vue'
import UserMenu from './UserMenu.vue'
import WorkspaceMenu from './WorkspaceMenu.vue'

// Defining the Navbar component
withDefaults(
  defineProps<{
    workspace: WorkspaceInfoInterface
    highlightLink?: string
    searchValue: SearchDataInterface
    placeholder?: string
    guideProgress: Record<TutorialKeyType, boolean>
    workspaceList: WorkspaceInfoInterface[]
    showMember?: boolean
    userInfo: UserInfoInterface
    searchInputType: SearchInputType
  }>(),
  {
    workspace: stubObject as () => WorkspaceInfoInterface,
    searchValue: stubObject,
    guideProgress: stubObject,
    workspaceList: stubArray,
    showMember: false,
    userInfo: stubObject,
    searchInputType: SearchInputType.Article,
  },
)

const emit = defineEmits(['clickStep', 'clickMenu', 'update:searchValue'])

// used in template
const assets = { logo }

const { canAccessTutorial } = usePublicationPermission()
const showLogo = ref(true)
const [isSchedulerUsed, setSchedulerUsed] = useUsedFeature(UsedFeature.Scheduler, true)

function handleSearchInputChange(data: SearchDataInterface) {
  emit('update:searchValue', data)
}

function handleClickStep(data: EventClickStepDataInterface) {
  emit('clickStep', data)
}
</script>

<template>
  <!-- Header component with dynamic classes -->
  <header
    :class="
      mergeTailwind([
        'z-30 flex h-14 w-full items-center justify-between px-2 backdrop-blur-3xl sm:overflow-visible md:px-5',
        $attrs.class,
      ])
    "
  >
    <!-- Left section of the navbar -->
    <div class="relative flex shrink items-center md:grow md:basis-1/3">
      <!-- Hamburger menu button for mobile view -->
      <div role="button" class="mr-2 mt-1 block rounded-full px-1 md:hidden" @click="$emit('clickMenu')">
        <Icon icon-name="hamburger" class="text-stone-500" @click="$emit('clickMenu')" />
      </div>
      <!-- Conditional Guide Progress Component -->
      <GuideProgress
        v-if="canAccessTutorial"
        data-testid="guide-progress"
        class="-ml-2 mr-3 hidden md:block"
        :guide-progress="guideProgress"
        @click-step="handleClickStep"
        @show-guide-progress="showLogo = false"
      />
      <!-- logo link -->
      <a
        v-if="showLogo"
        class="mr-5 hidden size-[1.875rem] items-center justify-center md:flex"
        :href="`/${workspace.id}/`"
      >
        <img :src="assets.logo" alt="logo" />
      </a>
      <!-- Navbar links -->
      <NavbarLink
        rel="preload"
        class="relative hidden min-w-[3.9rem] md:block"
        :highlight="highlightLink === 'Articles'"
        :to="`/${workspace.id}/articles`"
      >
        Manage
      </NavbarLink>
      <NavbarLink
        rel="preload"
        class="relative hidden min-w-[4rem] md:block"
        :highlight="highlightLink === 'Scheduler'"
        :to="`/${workspace.id}/scheduler`"
        @click="setSchedulerUsed()"
      >
        Schedule
        <span
          v-if="!isSchedulerUsed"
          class="absolute -right-1.5 top-4 size-2 animate-ping rounded-full bg-emerald-900 opacity-100"
        ></span>
      </NavbarLink>
      <NavbarLink
        v-if="showMember"
        rel="preload"
        class="relative hidden min-w-[4.6rem] md:block"
        :highlight="highlightLink === 'Members'"
        :to="`/${workspace.id}/members`"
      >
        Subscribers
      </NavbarLink>
    </div>
    <!-- Search input component -->
    <div class="flex shrink basis-1/3 items-center">
      <SearchInput
        class="w-max md:w-11/12"
        :model-value="searchValue"
        :placeholder="placeholder"
        :type="searchInputType"
        @update:model-value="handleSearchInputChange"
      />
    </div>
    <!-- Right section of the navbar -->
    <div class="flex shrink items-center justify-end md:grow md:basis-1/3">
      <!-- Invite team button -->
      <button class="ml-1 hidden flex-shrink-0 flex-grow-0 lg:flex">
        <router-link
          :to="`/${workspace.id}/preferences/publication/team`"
          class="text-body flex items-center justify-between rounded p-2 text-stone-600 transition-colors duration-150 hover:bg-stone-800/5"
          rel="prefetch"
        >
          <Icon class="mr-2 text-xs" icon-name="plus" />
          Invite team
        </router-link>
      </button>
      <!-- Workspace menu component -->
      <WorkspaceMenu
        data-testid="workspace-menu"
        class="ml-2"
        :workspace-list="workspaceList"
        :current-workspace="workspace"
      />
      <!-- User menu component -->
      <UserMenu
        data-testid="user-menu"
        :user-info="userInfo"
        :workspace-id="workspace.id"
        class="ml-5 hidden md:flex"
      />
    </div>
  </header>
</template>
