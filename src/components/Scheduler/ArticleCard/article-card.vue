<script lang="ts" setup>
import { Buttons, Dropdowns, Icon, MenuItem } from '@storipress/core-component'
import { MenuButton } from '@headlessui/vue'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { ignorableWatch, useVModel, whenever } from '@vueuse/core'
import { not } from '@vueuse/math'
import type { Article, Stage } from '../definitions'
import { dateFormat, dateTimeFormat, timeFormat } from '../definitions'
import { useMutateStage, useStage } from '../helpers'
import { useSchedulerStore } from '../store'
import DateInput from './date-input.vue'
import TimeInput from './time-input.vue'
import type { Formatter } from './helpers'
import { useFormatTime } from './helpers'
import { useDesks, useFocusLoopProvider } from '~/composables'
import { dayjs } from '~/lib/dayjs'
import { usePublicationPermission } from '~/composables/permission/publication'
import { filterHTMLTag } from '~/utils'
import { useWorkspaceStore } from '~/stores/workspace'
import { useMe } from '~/composables/me'

const props = withDefaults(
  defineProps<{
    article: Article
    stage: string
    stages: Stage[]
    proposedTime?: dayjs.Dayjs
    disabled?: boolean
    today?: dayjs.Dayjs
    /// indicate that value has been updated. the only valid usage is set this to false to clear it
    /// you should never set the dirty value to true outside of this component
    dirty?: boolean
  }>(),
  {
    today: () => dayjs(),
  },
)
const emit = defineEmits<{
  (event: 'update:dirty', dirty: boolean): void
  (event: 'update:stage', stage: string): void
  (event: 'update:proposedTime', time?: dayjs.Dayjs): void
  (event: 'schedule', scheduledAt: dayjs.Dayjs): void
  (event: 'unschedule'): void
  (event: 'delete'): void
  (event: 'publishNow'): void
}>()

const { canPublishedArticle, canUnscheduleArticle, canUpdateDesk } = usePublicationPermission()

useFocusLoopProvider()
const store = useSchedulerStore()
const formatDate = useFormatTime(dateFormat)
const formatTime = useFormatTime(timeFormat)
const isScheduled = computed(() => Boolean(props.article.scheduledAt))
const modelProposedTime = useVModel(props, 'proposedTime', emit)
const workspaceStore = useWorkspaceStore()
const articleURL = computed(() => `/${workspaceStore.currentWorkspace?.id}/articles/${props.article.id}/edit`)
const mutateArticleStage = useMutateStage(toRef(props, 'stages'), toRef(props, 'article'))

function initialTime(formatter: Formatter) {
  const { scheduledAt = props.today } = props.article
  return formatter(scheduledAt)
}

const disableUnschedule = computed(() => !canUnscheduleArticle.value || !props.article.editable)
const disableSchedule = computed(() => !canPublishedArticle.value || !props.article.editable)

const date = ref(initialTime(formatDate))
const time = ref(initialTime(formatTime))

const scheduledAt = computed(() => {
  if (!date.value || !time.value) {
    return dayjs().tz(store.timezone).startOf('minute')
  }

  return dayjs.tz(`${date.value} ${time.value}`, dateTimeFormat, store.timezone).startOf('minute')
})
const canPublishNow = computed(() => {
  if (isScheduled.value) {
    if (scheduledAt.value.isBefore(props.today)) {
      return !props.article?.published
    }
    return scheduledAt.value.isAfter(props.today)
  }
  return !isScheduled.value
})

const offsetString = computed(() => {
  // ref: https://stackoverflow.com/questions/1954397/detect-timezone-abbreviation-using-javascript
  const abbrev = new Date()
    .toLocaleTimeString('en-us', { timeZone: store.timezone, timeZoneName: 'short' })
    .split(' ')[2]
  return abbrev
})

const modelStage = useVModel(props, 'stage', emit, { passive: true })
const modelDirty = useVModel(props, 'dirty', emit, { passive: true })

watch(
  () => props.article.stage.id,
  (stage) => {
    modelStage.value = stage
  },
  { immediate: true },
)

const showSchedule = computed((): boolean => {
  if (!isScheduled.value) {
    return true
  }

  if (modelProposedTime.value) {
    return true
  }

  if (modelDirty.value) {
    return true
  }

  return false
})

const { ignoreUpdates } = ignorableWatch(
  scheduledAt,
  (scheduledAt) => {
    // update the dirty flag first to prevent infinite update
    modelDirty.value = true

    // we are editing auto timing, send it back to parent
    if (modelProposedTime.value) {
      modelProposedTime.value = scheduledAt
    }
  },
  // we need this value to immediately update, so the follow `whenever` can rely on it
  { flush: 'sync' },
)

function updateTime(scheduledAt: dayjs.Dayjs | string | undefined) {
  // don't update value if user is editing
  if (modelDirty.value) {
    return
  }

  if (!scheduledAt) {
    date.value = ''
    time.value = ''
    return
  }

  date.value = formatDate(scheduledAt)
  time.value = formatTime(scheduledAt)
}

// loading data from proposed time should set dirty flag as we need to show schedule button
whenever(modelProposedTime, updateTime, {
  // we want to update this after DOM has been updated, so we can show the user the proposed time
  flush: 'post',
  // after dragged, the component may be re-mounted, so we need immediate update
  immediate: true,
})

// syncing data from scheduledAt should not set dirty flag
function resetTime() {
  ignoreUpdates(() => {
    updateTime(props.article.scheduledAt)
  })
}

whenever(() => props.article.scheduledAt, resetTime)
whenever(not(modelDirty), resetTime)

const { indicatorColor, stageName } = useStage(modelStage, toRef(props, 'stages'))
async function clickStage(id: string) {
  modelStage.value = id
  await mutateArticleStage({
    id: props.article.id,
    stageId: modelStage.value,
  })
  sendTrackUnchecked('article_stage_changed', {
    article_id: props.article.id,
    source: 'scheduler',
    stage_id: id,
    stage_name: stageName.value,
  })
}

const listFormatter = new Intl.ListFormat('en')

const authorNames = computed(() => {
  return listFormatter.format(props.article.authors.map(({ name }) => name))
})

const { desks } = useDesks()
const me = useMe()
const canUpdateAllArticle = canUpdateDesk(computed(() => props.article.desk.id))
const mapIdToDesk = computed(() => new Map(desks.value.map((item) => [item.id, item])))
// TODO [SPMVP-2389]: extra this to a new file
const canAccessDeskIdSet = computed(() => {
  return new Set([
    ...(me.value?.desks || [])
      .map((desk) => desk.id)
      .flatMap((id) => {
        const desk = mapIdToDesk.value.get(id)
        return desk?.desks.length ? [id, ...desk.desks.map((item) => item.id)] : id
      }),
    ...(desks.value || [])
      .filter(({ open_access }) => open_access)
      .flatMap(({ id, desks }) => [id, ...desks.map(({ id }) => id)]),
  ])
})
const canDeleteArticle = computed<boolean>(() => {
  return (
    canUpdateAllArticle.value ||
    canAccessDeskIdSet.value.has(props.article.desk.id) ||
    (me.value?.role === 'editor' && canAccessDeskIdSet.value.has(props.article.desk.id))
  )
})
</script>

<template>
  <div class="layer-2 w-64 rounded-md border border-gray-100 bg-gray-100">
    <!-- stage indicator -->
    <div class="mb-1.5 h-1.5 rounded-t-md" :style="{ backgroundColor: indicatorColor }" />

    <div class="flex gap-2 px-3">
      <div class="w-full">
        <!-- Article Title -->
        <h2 class="text-body my-1 cursor-pointer font-medium text-stone-800 hover:text-sky-700 hover:duration-300">
          <router-link :to="articleURL" @click="$emit('schedule', scheduledAt)">
            {{ filterHTMLTag(article.title) }}
          </router-link>
        </h2>
        <!-- Authors -->
        <p class="text-caption mb-2 font-medium text-stone-500">By {{ authorNames }}</p>
        <!-- author photos -->
        <div class="mb-2 flex -space-x-2">
          <img
            v-for="author of article.authors"
            :key="author.id"
            class="layer-1 size-8 overflow-hidden rounded-full object-cover object-center"
            :src="author.avatar"
            :alt="author.name"
          />
        </div>
      </div>
      <Dropdowns is-vertical class="h-fit bg-gray-100">
        <template #button>
          <MenuButton
            class="focus-ring text-body -mx-2 inline-flex aspect-1 justify-start rounded-full p-1.5 text-stone-800 hover:bg-gray-50"
          >
            <Icon icon-name="dots_vertical" class="cursor-pointer text-lg leading-none text-stone-500" />
          </MenuButton>
        </template>
        <template #default>
          <MenuItem
            :disabled="!canPublishNow"
            :class="{ 'cursor-not-allowed opacity-75': !canPublishNow }"
            @click="canPublishNow && !disableSchedule && $emit('publishNow')"
          >
            Publish Now
          </MenuItem>
          <MenuItem
            :disabled="!canDeleteArticle"
            :class="{ 'opacity-75': !canDeleteArticle }"
            @click.prevent="canDeleteArticle && $emit('delete')"
          >
            Delete article
          </MenuItem>
        </template>
      </Dropdowns>
    </div>
    <!-- schedule stage/time toggles -->
    <div class="pl-7">
      <div class="flex gap-x-3">
        <div class="flex flex-col items-end justify-between">
          <label class="h-7">
            <span class="text-caption font-semibold">stage</span>
          </label>
          <label class="h-7">
            <span class="text-caption font-semibold">date</span>
          </label>
          <label class="h-7">
            <span class="text-caption font-semibold">time</span>
          </label>
        </div>
        <div class="flex flex-col items-start justify-between">
          <Dropdowns class="h-7" placement="bottom-start">
            <template #button>
              <MenuButton
                class="text-caption inline-flex items-center rounded px-1.5 py-1 text-stone-800 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-sky-600"
              >
                <span class="whitespace-nowrap">{{ stageName }}</span>
                <Icon class="ml-1.5 text-[0.5rem]" aria-hidden="true" icon-name="chevron_down" />
              </MenuButton>
            </template>
            <template #default>
              <div class="py-1">
                <MenuItem v-for="item of stages" :key="item.id" @click.prevent="clickStage(item.id)">{{
                  item.name
                }}</MenuItem>
              </div>
            </template>
          </Dropdowns>
          <div class="h-7">
            <DateInput v-model="date" :readonly="disabled" class="text-caption" />
          </div>
          <div class="flex h-7 items-center gap-2">
            <TimeInput v-model="time" :readonly="disabled" class="text-caption" /><span
              class="text-caption text-stone-400/80"
              >{{ offsetString }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <!--- bottom divider -->
    <div class="mb-2 mt-3 h-px w-full bg-gray-200" />
    <!--- schedule button(s) -->
    <div class="flex justify-between px-3 pb-3" :class="disabled && 'invisible'">
      <Buttons
        type="transparent"
        :is-border="false"
        class="layer-1 w-28 text-stone-500"
        :class="!isScheduled && 'invisible'"
        :disabled="disabled || !isScheduled || disableUnschedule"
        @click="$emit('unschedule')"
      >
        Unschedule
      </Buttons>
      <Buttons
        type="main"
        color="primary"
        class="w-28"
        :class="!showSchedule && 'invisible'"
        :disabled="disabled || !showSchedule || disableSchedule"
        @click="$emit('schedule', scheduledAt)"
      >
        {{ isScheduled ? 'Reschedule' : 'Schedule' }}
      </Buttons>
    </div>
  </div>
</template>
