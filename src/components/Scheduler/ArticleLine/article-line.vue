<script lang="ts" setup>
import { useVModel, whenever } from '@vueuse/core'
import { not } from '@vueuse/math'
import type { Article, Location } from '../definitions'
import { ArticleCard } from '../ArticleCard'
import { useStage, useStages } from '../helpers'
import { ScheduleEventBus } from '../story-helper'
import { useSchedulerStore } from '../store'
import {
  onHolding,
  useArticlePermission,
  useDeleteArticle,
  usePublishArticle,
  useTogglePopup,
  useUnpublishArticle,
} from '~/composables'
import type { dayjs } from '~/lib/dayjs'
import { filterHTMLTag } from '~/utils'
import { useCalendarStore } from '~/stores/calendar'
import { env } from '~/env'

const props = withDefaults(
  defineProps<{
    article: Article
    proposedTime?: dayjs.Dayjs
    today?: dayjs.Dayjs
    loc?: Location
    disabled?: boolean
    autoPublish?: boolean
  }>(),
  { autoPublish: true },
)

const emit = defineEmits<{
  (event: 'update:proposedTime', proposedTime?: dayjs.Dayjs): void
  (event: 'scheduled', article: Article): void
}>()

const stages = useStages()

const dirty = ref(false)

const store = useSchedulerStore()
const modelStage = ref(props.article.stage.id)
const modelProposedTime = useVModel(props, 'proposedTime', emit)
const { indicatorColor } = useStage(modelStage, stages)
const { canManage } = useArticlePermission()
const manageable = canManage(toRef(props, 'article'))

const { reference, popup, open } = useTogglePopup({
  options: {
    placement: 'right-start',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['right', 'right-end', 'left-start', 'left', 'left-end'],
        },
      },
      {
        name: 'offset',
        options: {
          offset: ({ placement }: any) => {
            if (placement === 'right-start') {
              return [-72, 4]
            } else {
              return [0, 4]
            }
          },
        },
      },
    ],
  },
  onClickOutside: publishAtProposed,
})

const calendarStore = useCalendarStore()
// whenever we close the popup, we want to reset the proposed time and the scheduled time
whenever(
  not(open),
  () => {
    dirty.value = false
    modelProposedTime.value = undefined
    calendarStore.resetIndex()
  },
  { flush: 'sync' },
)

whenever(
  modelProposedTime,
  () => {
    open.value = true
  },
  { immediate: true },
)

// special case: we probably are going to drag the article line
function closeCardWhenHolding() {
  // we must handle schedule here as this may happen before click outside event
  publishAtProposed()
  open.value = false
}

onHolding(closeCardWhenHolding, {
  ignore: [popup],
  delay: 70,
})

function publishAtProposed() {
  if (props.proposedTime && props.autoPublish) {
    handleSchedule(props.proposedTime)
  }
}

function handleClick() {
  if (props.disabled) {
    return
  }
  open.value = true
}
const range = computed(() => ({ from: store.range.from, to: store.range.to }))
const mutateSchedule = usePublishArticle(range)

async function handleSchedule(time: dayjs.Dayjs) {
  if (env.DEV) {
    useEventBus(ScheduleEventBus).emit(time)
  }

  // set open to close will trigger the watcher on the above
  open.value = false

  await mutateSchedule(
    {
      id: props.article.id,
      time,
      now: false,
    },
    true,
  )
  emit('scheduled', props.article)
  // TODO: response/error handle
}

async function handlePublishNow() {
  open.value = false

  await mutateSchedule({ id: props.article.id, now: true }, true)
  emit('scheduled', props.article)
}

const mutateUnpublished = useUnpublishArticle()

async function handleUnschedule() {
  // set open to close will trigger the watcher on the above
  open.value = false

  await mutateUnpublished(
    {
      id: props.article.id,
    },
    true,
  )
}

const mutateDeleted = useDeleteArticle(range)

function handleDelete() {
  mutateDeleted({ id: props.article.id })
}
</script>

<template>
  <div>
    <button
      ref="reference"
      class="layer-1 text-body relative flex h-6 w-full flex-row content-center items-center truncate rounded pr-1.5 text-left text-stone-500 hover:duration-100 focus:outline-none"
      :class="[
        open ? 'bg-sky-50' : 'bg-white',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-grab hover:layer-2',
      ]"
      :title="filterHTMLTag(article.title)"
      :disabled="disabled"
      @click="handleClick"
    >
      <div
        class="rounded-sm-l mr-1 h-full w-[3px] shrink-0"
        :class="!manageable && 'opacity-50'"
        :style="{ backgroundColor: indicatorColor }"
      />
      <span class="grow truncate" :class="!manageable && 'text-stone-500'">
        {{ filterHTMLTag(article.title) }}
      </span>
    </button>
    <div ref="popup" class="relative z-50" @mousedown.stop>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <ArticleCard
          v-if="open"
          v-model:stage="modelStage"
          v-model:dirty="dirty"
          v-model:proposed-time="modelProposedTime"
          :disabled="!manageable"
          :today="today"
          :stages="stages"
          :article="article"
          @schedule="handleSchedule"
          @unschedule="handleUnschedule"
          @delete="handleDelete"
          @publish-now="handlePublishNow"
        />
      </transition>
    </div>
  </div>
</template>
