<!-- nav parent -->
<script lang="ts" setup>
import type { PropType, Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import { HoverHint, Icon, MenuItem, MenuItems, SubMenu, mergeTailwind } from '@storipress/core-component'
import { Menu as HeadlessuiMenu, MenuButton } from '@headlessui/vue'
import { cloneDeep } from 'lodash-es'
import ListDesk from './ListDesk.vue'
import ListSubDesk from './ListSubDesk.vue'
import { DEFAULT_ITEM } from './definition'
import type { DeskDataInterface } from './definition'
import LeftHandNavItem from './LeftHandNavItem.vue'
import { usePublicationPermission } from '~/composables/permission/publication'
import DroppableArea from '~/components/Draggable/DroppableArea.vue'
import { useSiteStore } from '~/stores/site'
import {
  GetSiteCustomSiteDocument,
  ListDesksDocument,
  MoveDeskAfterDocument,
  MoveDeskBeforeDocument,
  MoveDeskDocument,
} from '~/graphql-operations'
import { useMe } from '~/composables/me'

defineOptions({
  name: 'LeftHandNavPanel',
})

const props = defineProps({
  desks: {
    type: Array as PropType<DeskDataInterface[]>,
    default: () => [],
  },
  activeId: {
    type: String,
    default: DEFAULT_ITEM.ALL.id,
  },
  editDeskSlideVisible: {
    type: Boolean,
    default: false,
  },
  canAccessDeskCount: {
    type: Number,
    default: 0,
  },
})

defineEmits<{
  clickAll: []
  clickFeatured: []
  clickMyArticles: []
  clickAddDesk: []
  clickDeskSetting: []
  clickAddSubdesk: [DeskDataInterface]
  clickDesk: [DeskDataInterface]
}>()

const { canAddDesk, canAccessDesk, canDragItemIntoDesk } = usePublicationPermission()
const activePath = computed(() => {
  const findThePath = (desk: DeskDataInterface): string[] => {
    if (desk.id === props.activeId) {
      return [desk.id]
    } else if (desk.desks?.length) {
      for (const child of desk.desks) {
        const temp = findThePath(child)
        if (temp.length) return [desk.id, ...temp]
      }
    }

    return []
  }

  for (let i = 0; i < props.desks.length; i++) {
    const temp = findThePath(props.desks[i])
    if (temp.length) return temp
  }

  return undefined
})

const me = useMe()
const DESK_CONTROLLERS = new Set(['owner', 'admin'])
const canControlDesk = computed(() => {
  const role = me.value?.role ?? ''
  return DESK_CONTROLLERS.has(role) && props.editDeskSlideVisible
})

const openSubmenu = ref(true)
const waitingClose = ref(false)
;(() => {
  let timeId: NodeJS.Timeout
  watch(activePath, (newValue, oldValue) => {
    clearTimeout(timeId)
    waitingClose.value =
      openSubmenu.value && newValue !== undefined && oldValue !== undefined && oldValue[0] !== newValue[0]
    timeId = setTimeout(() => {
      waitingClose.value = false
    }, 100)
  })
})()
const draggingId = ref()
const openDeskIdForDraggingId = computed(() => {
  return props.desks.find(
    (desk) => desk.id === draggingId.value || desk.desks?.some((sub) => sub.id === draggingId.value),
  )?.id
})

const menuButtonRef = ref()
const siteStore = useSiteStore()
const { result: customSiteResult } = useQuery(GetSiteCustomSiteDocument)
const showCustomiseThemeTutorial = computed(() => {
  const disabledCustomSite = !customSiteResult.value?.site.custom_site_template
  return siteStore.siteTutorials?.setCustomiseTheme ? false : disabledCustomSite
})
const onCreateDesks = inject('setCreateDesks') as Ref<boolean>
watchOnce(menuButtonRef, () => {
  if (siteStore.showNewDeskTutorials) {
    siteStore.changeNewDeskTutorials(false)
    setTimeout(() => {
      menuButtonRef.value.$el.click()
    }, 1000)
  }
})
whenever(onCreateDesks, () => {
  menuButtonRef.value.$el.click()
  onCreateDesks.value = false
})
watch(
  () => props.activeId,
  (activeId) => {
    if (activePath.value?.includes(activeId)) {
      openSubmenu.value = true
    }
  },
)

const { mutate: mutateMoveDesk } = useMutation(MoveDeskDocument)
const { mutate: mutateMoveDeskBefore } = useMutation(MoveDeskBeforeDocument, {
  refetchQueries: [ListDesksDocument],
  awaitRefetchQueries: true,
})
const { mutate: mutateMoveDeskAfter } = useMutation(MoveDeskAfterDocument, {
  refetchQueries: [ListDesksDocument],
  awaitRefetchQueries: true,
})

const desksList = ref<DeskDataInterface[]>([])
watchDebounced(
  () => props.desks,
  () => {
    if (!props.desks.length) desksList.value = []
    desksList.value = cloneDeep(props.desks).sort((a, b) => a.order - b.order)
  },
  { immediate: true, debounce: 300 },
)

const isDropping = ref(false)

async function sortEnd(event: { newIndex: number; oldIndex: number; rootDesk: DeskDataInterface }) {
  isDropping.value = false
  const { newIndex, oldIndex, rootDesk } = event
  if (oldIndex === newIndex) return

  const sourceId = rootDesk?.desks?.[oldIndex]?.id || desksList.value[oldIndex]?.id
  const targetId = rootDesk?.desks?.[newIndex]?.id || desksList.value[newIndex]?.id

  handleSort({ sourceId, targetId, oldIndex, newIndex })
}

async function sortInsert(event: { newIndex: number; value: DeskDataInterface; rootDesk: DeskDataInterface }) {
  isDropping.value = false
  const { newIndex, value, rootDesk } = event
  if (value.id === rootDesk?.id) return
  const targetSortId = {
    ...(newIndex === 0 ? { before_id: desksList.value[1].id } : { after_id: desksList.value[newIndex - 1].id }),
  }
  await mutateMoveDesk(
    { input: { id: value.id, target_id: rootDesk?.id ?? null, ...targetSortId } },
    {
      refetchQueries: [ListDesksDocument],
      awaitRefetchQueries: true,
    },
  )
}

function handleSort(item: { sourceId: string; targetId: string; oldIndex: number; newIndex: number }) {
  const { sourceId, targetId, oldIndex, newIndex } = item
  if (oldIndex > newIndex) {
    mutateMoveDeskBefore({
      input: {
        id: sourceId,
        target_id: targetId,
      },
    })
  } else {
    mutateMoveDeskAfter({
      input: {
        id: sourceId,
        target_id: targetId,
      },
    })
  }
}

function handleDragMove(el: HTMLElement) {
  draggingId.value = el.id
}
function handleDropped() {
  draggingId.value = undefined
}
</script>

<template>
  <div
    :class="
      mergeTailwind([
        'flex h-screen w-[80vw] min-w-[14rem] flex-col border border-solid border-stone-200 bg-stone-100 pb-1 pr-2 pt-6 md:h-[calc(100vh-3.5rem+1px)] md:w-60',
        $attrs.class,
      ])
    "
  >
    <div class="mb-[1.875rem] flex-shrink-0 flex-grow-0">
      <LeftHandNavItem
        :id="DEFAULT_ITEM.ALL.id"
        icon-name="home"
        :text="DEFAULT_ITEM.ALL.name"
        :is-target="activeId === DEFAULT_ITEM.ALL.id"
        :disabled="editDeskSlideVisible"
        @click="$emit('clickAll')"
      />
      <LeftHandNavItem
        :id="DEFAULT_ITEM.FEATURED.id"
        icon-name="star"
        :text="DEFAULT_ITEM.FEATURED.name"
        :is-target="activeId === DEFAULT_ITEM.FEATURED.id"
        :disabled="editDeskSlideVisible"
        @click="$emit('clickFeatured')"
      />
      <LeftHandNavItem
        :id="DEFAULT_ITEM.MY_ARTICLES.id"
        icon-name="account_circle"
        :text="DEFAULT_ITEM.MY_ARTICLES.name"
        :is-target="activeId === DEFAULT_ITEM.MY_ARTICLES.id"
        :disabled="editDeskSlideVisible"
        @click="$emit('clickMyArticles')"
      />
    </div>
    <div class="mb-1.5 flex flex-shrink-0 flex-grow-0 items-center justify-between pl-5 pr-2">
      <span :class="mergeTailwind('text-xs font-semibold leading-7 text-stone-600')"> DESKS </span>
      <span v-if="canAddDesk" class="relative hidden h-full w-4 md:flex md:items-center">
        <HeadlessuiMenu as="div" class="relative z-[21] inline-block text-left">
          <HoverHint reference-class="add-button-tooltip">
            <MenuButton
              ref="menuButtonRef"
              class="tooltip text-[#7f7f7f] hover:brightness-75"
              data-intercom-target="New Desk Button"
            >
              <Icon icon-name="plus_circle" />
            </MenuButton>
            <template #content>
              <span class="text-body text-white">New desk</span>
            </template>
          </HoverHint>
          <transition
            enter-active-class="transition duration-75 ease-in-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="absolute left-[100%] top-[-0.75rem] ml-[0.312rem] origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="min-w-[9.5rem] py-1">
                <MenuItem @click.prevent="$emit('clickAddDesk')"> New desk </MenuItem>
                <SubMenu title="New sub-desk">
                  <MenuItem v-for="desk in desks" :key="desk.id" @click.prevent="$emit('clickAddSubdesk', desk)">
                    in {{ desk.name }}</MenuItem
                  >
                </SubMenu>
              </div>
            </MenuItems>
          </transition>
        </HeadlessuiMenu>
      </span>
    </div>
    <div
      class="desk-list overflow-auto"
      :class="{ 'flex-shrink flex-grow overflow-auto': !showCustomiseThemeTutorial }"
    >
      <DroppableArea group-name="desk" @drag-move="handleDragMove" @drag-out="handleDropped" @dropped="handleDropped">
        <ListDesk
          v-model="desksList"
          :can-control-desk="canControlDesk"
          @sort-insert="sortInsert"
          @sort-start="isDropping = true"
          @sort-end="sortEnd"
        >
          <template #default="{ desk }">
            <LeftHandNavItem
              :id="desk.id"
              :class="{ 'dropzone-item': canDragItemIntoDesk(desk).value }"
              icon-name="desk"
              :text="desk.name"
              :has-subdesks="!!(desk.desks && desk.desks.length)"
              :highlight="activePath?.[0] === desk.id"
              :is-target="activeId === desk.id"
              :is-dropping="isDropping"
              :is-dragging-item-hover="desk.id === draggingId && !(desk.desks && desk.desks.length)"
              :can-control-desk="canControlDesk"
              :can-access-desk="canAccessDesk(desk.id).value"
              @click="$emit('clickDesk', desk), (openSubmenu = activeId === desk.id && !openSubmenu)"
            />
          </template>
          <template #subDesks="{ desk }">
            <ListSubDesk
              :desk="desk"
              :can-control-desk="canControlDesk"
              :show-sub-desk="
                canControlDesk ||
                (((activePath?.includes(desk.id) && openSubmenu) || desk.id === openDeskIdForDraggingId) &&
                  !waitingClose)
              "
              @sort-insert="sortInsert"
              @sort-start="isDropping = true"
              @sort-end="sortEnd"
            >
              <template #default="{ subDesk }">
                <LeftHandNavItem
                  :id="subDesk.id"
                  :class="canDragItemIntoDesk(subDesk).value ? 'dropzone-item' : ''"
                  :text="subDesk.name"
                  :is-target="activeId === subDesk.id"
                  :is-sub-item="true"
                  :is-dropping="isDropping"
                  :is-dragging-item-hover="subDesk.id === draggingId"
                  :can-control-desk="canControlDesk"
                  :can-access-desk="canAccessDesk(subDesk.id).value"
                  @click="$emit('clickDesk', subDesk)"
                />
              </template>
            </ListSubDesk>
          </template>
        </ListDesk>
      </DroppableArea>
    </div>
    <div v-if="showCustomiseThemeTutorial" class="text-body flex-shrink flex-grow py-4 pl-5 pr-4 text-stone-800">
      <span>Welcome to your Publication. To customise your theme, </span>
      <span class="font-semibold"
        >click the big green button on the top right of the navbar and click ‘customise theme’.</span
      >
    </div>
    <div class="hidden flex-shrink-0 flex-grow-0 py-3.5 pl-3 md:flex">
      <button
        v-if="canAccessDeskCount"
        class="text-button flex items-center justify-between rounded p-2 text-stone-600 transition-colors duration-150 hover:bg-stone-800/5"
        data-intercom-target="Desk Setting Button"
        @click="$emit('clickDeskSetting')"
      >
        <Icon class="mr-4 text-lg" icon-name="settings" />
        Desk Settings
      </button>
    </div>
  </div>
</template>

<style lang="scss">
div.add-button-tooltip {
  @apply relative inline-flex justify-center;
  .tooltiptext {
    @apply left-auto top-[calc(-100%-0.562rem)];
  }
}
</style>
