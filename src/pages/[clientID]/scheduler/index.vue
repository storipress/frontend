<script lang="ts" setup>
import { onBeforeRouteLeave } from 'vue-router'
import { useFilteredArticles } from './helpers'
import { Calendar, SchedulerNavigation, useScheduler } from '~/components/Scheduler'
import { useWorkspaceStore } from '~/stores/workspace'
import { ViewTypes } from '~/components/Scheduler/definitions'
import { useMeMeta } from '~/composables'

const workspaceStore = useWorkspaceStore()

useHead({
  title: computed(() => `${workspaceStore.currentWorkspace?.name ?? ''} - Schedule - Storipress`),
})

sendTrackUnchecked('scheduler_view')

const viewType = ref<ViewTypes>(ViewTypes.Month)
const { ignoreUpdates } = watchIgnorable(viewType, (type) => {
  const trackTypeMap = {
    [ViewTypes.Month]: 'month',
    [ViewTypes.FiveDay]: '5day',
  }
  sendTrackUnchecked('scheduler_active_view_changed', { type: trackTypeMap[type] })
})

const { userMeta, setUserMeta } = useMeMeta()
watchOnce(
  () => userMeta.value?.lastSchedulerView,
  (type) => {
    ignoreUpdates(() => (viewType.value = type))
  },
)
onBeforeRouteLeave(() => {
  setUserMeta({ lastSchedulerView: viewType.value })
})

const { today, range } = useScheduler()

const [scheduledArticles, loadingScheduledArticles] = useFilteredArticles(range)
const [unscheduledArticles, loadingUnscheduledArticles] = useFilteredArticles({ unscheduled: true })
const isLoadingScheduledArticles = computed<boolean>(() => {
  return today.value === undefined || loadingScheduledArticles.value
})
const isLoadingUnscheduledArticles = computed<boolean>(() => {
  return today.value === undefined || loadingUnscheduledArticles.value
})
</script>

<template>
  <div class="flex h-[calc(100vh-3.875rem)] gap-6 bg-stone-100">
    <SchedulerNavigation
      class="h-full w-60 shrink-0"
      :today="today"
      :articles="unscheduledArticles"
      :view-type="viewType"
      :is-loading="isLoadingUnscheduledArticles"
      data-intercom-target="Scheduler Navigation"
    />
    <div class="mt-1.5 flex size-full">
      <Calendar
        v-model:viewType="viewType"
        class="size-full rounded-tl-xl"
        :today="today"
        :articles="scheduledArticles"
        scroll-to-now
        :is-loading="isLoadingScheduledArticles"
      />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home-layout
  searchInputType: Schedule # Article | Member | Schedule
  searchPlaceholder: Filter articles...
</route>
