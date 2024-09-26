<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
import { Buttons, Icon, mergeTailwind } from '@storipress/core-component'
import { useRouteQuery } from '@vueuse/router'
import { useEventListener } from '@vueuse/core'
import { DEFAULT_ITEM as DEFAULT_DESK } from '../LeftHandNavPanel'
import StageList from './StageList.vue'
import DraftStage from './DraftStage.vue'
import TrialSnackbar from './TrialSnackbar.vue'
import NoPermissions from './NoPermissions.vue'

import { useKanbanState } from './definition'
import { useNewArticle } from '~/composables/new-article'
import { useMigratorSplashControl } from '~/composables/migrator-splash'
import { usePublicationPermission } from '~/composables/permission/publication'
import { onFromRedirect } from '~/composables'
import { useMeStore } from '~/stores/me'

const router = useRouter()
const state = useKanbanState()
const showNewArticle = useNewArticle()
const migrate = useRouteQuery('migrate', null as null | string)
const automatic = useRouteQuery('automatic', null as null | string)
const { setEnable } = useMigratorSplashControl()
watch(
  migrate,
  (value) => {
    // currently, when clicking on `Migrate content` from the publication settings just go to ask if migrate from webflow or use web scraper etc screen
    if (typeof value === 'string' && !automatic.value) {
      router.replace({ query: { migrate: 'true', automatic: 'true' } })
    }
    setEnable(typeof value === 'string')
  },
  { immediate: true },
)

const { canAccessDesk } = usePublicationPermission()
const isPresetDesk = computed<boolean>(
  () =>
    state.value.deskId === DEFAULT_DESK.ALL.id ||
    state.value.deskId === DEFAULT_DESK.FEATURED.id ||
    state.value.deskId === DEFAULT_DESK.MY_ARTICLES.id,
)
const canAccessDeskCurrentDesk = canAccessDesk(computed(() => state.value.deskId))
const canAccessThisDesk = computed(() => isPresetDesk.value || canAccessDeskCurrentDesk.value)

const customs = computed(() =>
  state.value.isLoading
    ? [{ id: '', name: '', color: '', icon: '', type: 'custom', key: '' }]
    : state.value.stagesForView.customs,
)

const articleTotal = computed(() => {
  const temp = Array.from(state.value.mapStageKeyToArticlesForView.values())
  const sum = temp.reduce((acc, curr) => acc + curr.total, 0)
  return sum
})

const meStore = useMeStore()
const me = computed(() => meStore.me)
const isOwnerOrAdmin = computed(() => {
  return me.value?.role === 'owner' || me.value?.role === 'admin'
})
const hasAssignedDesk = computed(() => {
  return me.value?.desks.length
})

const route = useRoute()
const inAllDeskSlug = computed(() => route.params.deskSlug === 'all')

const noPermissions = computed(() => {
  return !isOwnerOrAdmin.value && inAllDeskSlug.value && (!hasAssignedDesk.value ?? articleTotal.value === 0)
})

const isLargeScreen = useMediaQuery('(min-width: 1110px)')

const allLoaded = ref(false)

watch(customs, (nowCustoms) => {
  if (nowCustoms.length > 0) {
    allLoaded.value = true
  }
})

const newStoryButton: Ref<InstanceType<typeof Buttons> | null> = ref(null)

// `n` keyboard shortcut to trigger new article dialogue
useEventListener('keydown', (event) => {
  // Check if 'n' key is pressed and neither an INPUT nor TEXTAREA is currently active
  if (
    event.key === 'n' &&
    document.activeElement?.tagName !== 'INPUT' &&
    document.activeElement?.tagName !== 'TEXTAREA'
  ) {
    // Stop `n` shortcut from typing `n` in new article dialogue (due to autofocus)
    event.preventDefault()
    // Simulate click on the new story button
    newStoryButton.value?.$el.click()
  }
})

const createNewArticle = useRouteQuery('createNewArticle', null as null | string)
onFromRedirect(async () => {
  if (state.value.isLoading) {
    await until(() => state.value.isLoading).not.toBeTruthy()
  }

  if (noPermissions.value || !canAccessThisDesk.value) return
  createNewArticle.value && showNewArticle(!isPresetDesk.value ? state.value.deskId : undefined)
})
</script>

<template>
  <NoPermissions v-if="!state.isLoading && noPermissions" />
  <div v-else class="relative overflow-x-auto">
    <div
      :class="
        mergeTailwind([
          'flex overflow-x-auto bg-stone-100 md:px-5 md:pt-1',
          $attrs.class,
          { scrollbar: !isLargeScreen },
        ])
      "
      role="kanban"
    >
      <div class="mx-1 shrink-0">
        <StageList
          default-icon="draft"
          type="default"
          v-bind="state.stagesForView.default"
          :is-initial-loading="state.isLoading && !allLoaded"
          :initial-loading-card-num="4"
        >
          <template v-if="canAccessThisDesk" #extra-heading>
            <Buttons
              ref="newStoryButton"
              class="inline-flex h-auto items-center rounded border border-black/5 py-[0.188rem] pl-[0.125rem] pr-[0.35rem] shadow-1-layer"
              data-intercom-target="New Story Button"
              @click="showNewArticle(!isPresetDesk ? state.deskId : undefined)"
            >
              <span class="inline-flex items-center justify-start">
                <Icon icon-name="plus" class="w-4 scale-75 leading-4 text-stone-400" />
              </span>
              <span :class="mergeTailwind('text-caption ml-0.5 uppercase text-stone-400')">New Story</span>
            </Buttons>
          </template>
        </StageList>
      </div>
      <TransitionGroup
        enter-active-class="transition duration-100 origin-left ease-out"
        enter-from-class="transform scale-x-75 opacity-0"
        enter-to-class="transform scale-x-100 opacity-100"
        leave-active-class="transition duration-100 origin-left ease-in"
        leave-from-class="transform scale-x-100 opacity-100"
        leave-to-class="transform scale-x-75 opacity-0"
      >
        <div
          v-for="(stage, index) in customs"
          :key="index === 0 ? '0' : 'id' in stage ? stage.key || stage.id : stage.draftId"
          class="mx-1 shrink-0"
        >
          <StageList
            v-if="'id' in stage"
            v-bind="stage"
            default-icon="preview"
            type="custom"
            :is-initial-loading="state.isLoading && !allLoaded"
            :initial-loading-card-num="3"
          />
          <DraftStage v-else v-bind="stage" />
        </div>
      </TransitionGroup>
      <div class="mx-1 shrink-0">
        <StageList
          v-bind="state.stagesForView.ready"
          icon="schedule"
          type="ready"
          :is-initial-loading="state.isLoading && !allLoaded"
          :initial-loading-card-num="5"
        />
      </div>
      <div class="mx-1 shrink-0">
        <StageList
          v-bind="state.stagesForView.published"
          name="Published"
          icon="published"
          type="published"
          :is-initial-loading="state.isLoading && !allLoaded"
          :initial-loading-card-num="6"
        />
      </div>
    </div>
    <TrialSnackbar class="absolute z-[25] w-full" :class="isLargeScreen ? 'bottom-0' : 'bottom-2.5'" />
  </div>
</template>

<style lang="scss" scoped>
.scrollbar::-webkit-scrollbar {
  @apply h-[11px] w-[11px];
}
.scrollbar::-webkit-scrollbar-thumb {
  @apply rounded-lg border-2 border-solid border-white bg-black/50;
}
.scrollbar::-webkit-scrollbar-track {
  @apply bg-[#f5f5f4];
}
</style>
