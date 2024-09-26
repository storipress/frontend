<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import { MenuItem, MenuItems, SubMenu, mergeTailwind } from '@storipress/core-component'
import { Menu, MenuButton } from '@headlessui/vue'
import { useInfiniteScroll } from '@vueuse/core'
import { DEFAULT_ITEM as DEFAULT_DESK } from '../LeftHandNavPanel'
import type { CardPropsInterface, StageWithType, UpdateStageInputData } from './definition'
import { CardStatus, sortByList, useKanbanMutation, useKanbanState } from './definition'
import Card from './Card.vue'
import Icon from './Icon.vue'
import Dropzone from './Dropzone.vue'
import StageHeaderFrom from './StageHeaderFrom.vue'
import { cardHeight, publishedCardHeight } from './setting'
import LoadingCard from '~/components/LoadingCard.vue'
import { useConfirmFunction } from '~/components/ConfirmModalProvider'
import DraggableList from '~/components/Draggable/DraggableList.vue'
import { usePublicationPermission } from '~/composables/permission/publication'

const props = withDefaults(
  defineProps<{
    id?: string
    name?: string
    color?: string
    icon?: string
    defaultIcon?: string
    type: 'default' | 'custom' | 'ready' | 'published'
    isInitialLoading?: boolean
    initialLoadingCardNum?: number
  }>(),
  {
    id: '',
    name: '',
    color: '',
    icon: '',
  },
)

const isEditing = ref<boolean>(false)
const [confirmDelete] = useConfirmFunction([
  {
    type: 'warning',
    title: 'Delete stage',
    description:
      'Delete this article stage. All current articles in this stage will be moved back 1 step to the left. \n\nThis action does not delete any articles.',
    okText: 'Delete',
  },
])

const state = useKanbanState()
const stageKey = computed(() => state.value.getStageKey(props.id, props.type))
const articles = computed(() => {
  return state.value.mapStageKeyToArticlesForView.get(stageKey.value)
})
const disabledArticleIds = computed(() =>
  (articles.value?.articles ?? []).filter((item) => item.disabled).map((item) => item.id),
)

const mutation = useKanbanMutation()

async function save(data: UpdateStageInputData) {
  isEditing.value = false
  await mutation?.updateStage(props.id, data)
}
function cancel() {
  isEditing.value = false
}
function editStage() {
  isEditing.value = true
}
async function deleteStage() {
  if (await confirmDelete()) {
    await mutation?.removeStage(props.id)
  }
}

const isLoadingNext = ref<boolean>(false)
const listRef = ref<ComponentPublicInstance>()
const listElRef = computed<HTMLElement>(() => listRef.value?.$el)
const hasMore = computed<boolean>(() => {
  return (articles.value?.total ?? 0) > (articles.value?.articles.length ?? 0)
})
useInfiniteScroll(
  listElRef,
  async () => {
    if (!isLoadingNext.value && hasMore.value) {
      isLoadingNext.value = true
      const scrollTop =
        listElRef.value.scrollTop - (listElRef.value.scrollTop % (props.type === 'published' ? 108 : 72))
      await mutation?.queryNextPageByStageIdAndType(props.id, props.type)
      listElRef.value?.scrollTo(0, scrollTop)
      isLoadingNext.value = false
    }
  },
  { distance: (props.type === 'published' ? publishedCardHeight : cardHeight) * 10 },
)

watch(articles, () => {
  if (articles.value === undefined) {
    listElRef.value?.scrollTo(0, 0)
  }
})

function handleSortEnd($event: {
  newValue: { index: string | number; group: string }
  oldValue: { index: string | number; group: string }
}) {
  const id = articles.value?.articles[$event.oldValue.index as number]?.id ?? ''
  if ($event.newValue.group === 'desk') {
    if ($event.newValue.index !== state.value.deskId)
      mutation?.moveArticleToDifferentDesk(id, $event.newValue.index as string)
  } else {
    if ($event.newValue.group === $event.oldValue.group) {
      const newIndexArticleId = articles.value?.articles[$event.newValue.index as number]?.id ?? ''
      if ($event.oldValue.index > $event.newValue.index) {
        mutation?.moveArticleBefore(id, newIndexArticleId)
      } else if ($event.oldValue.index < $event.newValue.index) {
        mutation?.moveArticleAfter(id, newIndexArticleId)
      }
    } else {
      mutation?.moveArticleToDifferentStage(id, $event.newValue.group, $event.newValue.index as number)
    }
  }
}

function getDraggingCard(item: CardPropsInterface, newGroupKey: string): CardPropsInterface {
  const [, newGroupType] = state.value.parseStageKey(newGroupKey)
  if (item.status === CardStatus.Edit) {
    if (newGroupType === 'published') {
      return { ...item, status: CardStatus.Published, publishedAt: new Date() }
    }
  } else if (item.status === CardStatus.Unpublished) {
    if (newGroupType === 'published') {
      return { ...item, status: CardStatus.Published }
    }
  } else if (item.status === CardStatus.Published) {
    if (newGroupType === 'ready') {
      return { ...item, status: CardStatus.Edit, publishedAt: undefined }
    } else if (newGroupType !== 'published') {
      return { ...item, status: CardStatus.Unpublished }
    }
  }

  return item
}

function defaultDraggingCard(item: CardPropsInterface) {
  return { ...item, status: CardStatus.Edit, publishedAt: undefined }
}

const { canUpdateStage, canChangeArticleStage, canAccessDesk } = usePublicationPermission()

const allStageKeys = computed(() => {
  const { default: defaultStage, customs, ready, published } = state.value.stagesForView
  return [
    defaultStage ? state.value.getStageKey(defaultStage.id, 'default') : '',
    ...customs
      .filter((stage) => Object.hasOwn(stage, 'id'))
      .map((stage) => state.value.getStageKey((stage as StageWithType).id, 'custom')),
    ready ? state.value.getStageKey(ready.id, 'ready') : '',
    published ? state.value.getStageKey(published.id, 'published') : '',
  ]
})

const isPresetDesk = computed<boolean>(
  () =>
    state.value.deskId === DEFAULT_DESK.ALL.id ||
    state.value.deskId === DEFAULT_DESK.FEATURED.id ||
    state.value.deskId === DEFAULT_DESK.MY_ARTICLES.id,
)
const canAccessDeskCurrentDesk = canAccessDesk(computed(() => state.value.deskId))
const canAccessThisDesk = computed(() => isPresetDesk.value || canAccessDeskCurrentDesk.value)
</script>

<template>
  <div
    data-testid="stage-list"
    :class="
      mergeTailwind([
        'flex h-full min-w-[17rem] flex-col rounded bg-stone-500/5',
        { 'w-[34rem]': type === 'published' },
        $attrs.class,
      ])
    "
  >
    <h4
      v-if="!isEditing"
      class="mb-[0.875rem] flex items-center px-2 pt-2"
      :class="[{ invisible: !id }]"
      data-testid="stage-header"
    >
      <span class="mr-1.5 h-5 w-[0.188rem] rounded-r-sm" :style="{ background: color }"></span>
      <icon class="mr-[0.5rem] text-stone-600" :icon-name="icon" :default-icon="defaultIcon" />
      <span :class="mergeTailwind('text-heading mr-[0.5rem] text-stone-600')">{{ name }}</span>
      <span class="text-heading mr-auto text-stone-400">
        {{ articles?.total }}
      </span>
      <span class="ml-auto flex space-x-2">
        <slot name="extra-heading"></slot>
        <Menu
          v-if="canAccessThisDesk && type !== 'published'"
          as="div"
          class="relative z-10 flex items-center"
          data-testid="stage-menu"
        >
          <MenuButton class="size-5 hover:brightness-75" data-testid="stage-menu-trigger">
            <Icon icon-name="dots_horizontal" class="cursor-pointer text-[1.125rem] text-stone-500" />
          </MenuButton>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="shadow-lg absolute left-0 top-full float-left ml-[-0.1rem] origin-top-right divide-y divide-gray-100 rounded-md bg-white focus:outline-none"
            >
              <div class="min-w-[9.5rem] py-1">
                <SubMenu title="Sort">
                  <MenuItem
                    v-for="item of sortByList"
                    :key="item.sort"
                    @click="mutation?.sortBy({ stage: id, type, sort: item.sort })"
                  >
                    {{ item.text }}
                  </MenuItem>
                </SubMenu>
                <template v-if="canUpdateStage">
                  <template v-if="type === 'default'">
                    <MenuItem @click.prevent="mutation?.addDraftStage(id)">Add stage</MenuItem>
                  </template>
                  <template v-else-if="type === 'custom'">
                    <MenuItem @click.prevent="mutation?.addDraftStage(id)">Add stage</MenuItem>
                    <MenuItem @click.prevent="editStage">Edit stage</MenuItem>
                    <MenuItem @click.prevent="deleteStage">Delete stage</MenuItem>
                  </template>
                </template>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </span>
    </h4>
    <StageHeaderFrom
      v-else
      :name="name"
      :color="color"
      :icon="icon"
      :default-icon="defaultIcon"
      @save="save"
      @cancel="cancel"
    />

    <DraggableList
      ref="listRef"
      :list="articles?.articles ?? []"
      :get-item-key="(item) => item.id"
      :group-name="stageKey"
      class="flex-grow"
      :disabled="{
        sorting: type === 'published',
        group: false,
        itemKeyList: disabledArticleIds,
      }"
      :block-group="canChangeArticleStage ? [] : [...allStageKeys]"
      @start-dragging="mutation?.setDragging(true)"
      @end-dragging="mutation?.setDragging(false)"
      @drop-to-change="handleSortEnd"
    >
      <template #item="{ item, active, disabled, startDragging }">
        <Card
          v-if="!isInitialLoading"
          data-testId="draggable-card"
          :class="{ 'opacity-50': active || disabled }"
          v-bind="item"
          :disabled="disabled"
          @mousedown="startDragging"
        />
      </template>
      <template #dropzone="{ oldValue, newValue }">
        <Dropzone
          class="animate-pulse"
          :status="/-published/.test(newValue.group ?? '') ? CardStatus.Published : CardStatus.Edit"
          :old-stage="state.getStageByKey(oldValue.group ?? '')?.name ?? ''"
          :new-stage="name"
          :new-stage-color="$props.color || ''"
        />
      </template>
      <template #dragging-item="{ item, draggingItemTemplate, newValue, isDropping }">
        <div
          v-if="draggingItemTemplate"
          data-testId="dragging-card"
          class="border border-black/[.05] shadow-3-layer"
          :class="[
            isDropping
              ? 'animate-[rotate-to-0_100ms_ease-in-out_forwards]'
              : 'animate-[rotate-to-6_100ms_ease-in-out_forwards]',
            { 'opacity-10 transition-opacity duration-200': newValue.group === 'desk' },
          ]"
        >
          <Card
            :data-testId="`dragging-${item.id}`"
            v-bind="newValue.group && item ? getDraggingCard(item, newValue.group) : defaultDraggingCard(item)"
          />
        </div>
      </template>
      <div
        v-for="index in Math.min((articles?.total ?? 0) - (articles?.articles ?? []).length, 10)"
        :key="index"
        class="pb-[0.375rem]"
      >
        <LoadingCard
          :width="(type === 'published' ? 33 : 16) * 16"
          :height="(type === 'published' ? 4.175 : 6.375) * 16"
        />
      </div>
      <template v-if="isInitialLoading">
        <div v-for="index in initialLoadingCardNum" :key="index" class="pb-[0.375rem]">
          <LoadingCard
            :width="(type === 'published' ? 33 : 16) * 16"
            :height="(type === 'published' ? 4.175 : 6.375) * 16"
          />
        </div>
      </template>
    </DraggableList>
  </div>
</template>

<style lang="scss">
@keyframes rotate-to-6 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(6deg);
  }
}
@keyframes rotate-to-0 {
  from {
    transform: rotate(6deg);
  }
  to {
    transform: rotate(0deg);
  }
}
</style>
