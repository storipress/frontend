<script setup lang="ts">
import { eagerComputed, useScroll } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { NotificationProvider } from '@storipress/core-component'
import { cloneDeep, minBy } from 'lodash-es'
import type { EventSubmitDataInterface as EventSubmitDataInterfaceOfAddDesk } from './components/AddDeskSlideOver'
import AddDeskSlideOver from './components/AddDeskSlideOver'
import type { EventSubmitDataInterface as EventSubmitDataInterfaceOfAddSubdesk } from './components/AddSubDeskSlideOver'
import AddSubDeskSlideOver from './components/AddSubDeskSlideOver'
import type {
  DeskSettingDataInterface,
  EventSubmitDataInterface as EventSubmitDataInterfaceOfEditDesk,
} from './components/EditDeskSettingsSlideOver'
import EditDeskSettingsSlideOver from './components/EditDeskSettingsSlideOver'
import type { EventSubmitDataInterface as EventSubmitDataInterfaceOfEditSubDesk } from './components/EditSubDeskSettingsSlideOver'
import EditSubDeskSettingsSlideOver from './components/EditSubDeskSettingsSlideOver'
import LeftHandNavPanel, { COMMON_DEFAULT, DEFAULT_ITEM, FALLBACK_DEFAULT } from './components/LeftHandNavPanel'
import type { EventClickAddSubdeskDataInterface, EventClickDeskDataInterface } from './components/LeftHandNavPanel'
import { useDeskSettingSlideOverControl } from './components/hooks'
import Kanban from './components/Kanban'
import MigratorUserDialog from './components/MigratorUserDialog'
import SlideOver from './components/SlideOver'
import { usePublicationPermission } from '~/composables/permission/publication'
import { useWorkspaceStore } from '~/stores/workspace'
import { useMutation, useQuery } from '~/lib/apollo'
import type { ListDesksQuery, ListSimpleUsersQuery } from '~/graphql-operations'
import {
  AssignUserToDeskDocument,
  CreateDeskDocument,
  DeleteDeskDocument,
  ListDesksDocument,
  ListSimpleUsersDocument,
  RevokeUserFromDeskDocument,
  TransferDeskArticlesDocument,
  UpdateDeskDocument,
} from '~/graphql-operations'
import { key as WarningNotificationKey } from '~/components/WarningNotificationProvider'
import DraggableGroupProvider from '~/components/Draggable/DraggableGroupProvider'
import {
  RedirectTarget,
  useContinueOauth,
  useFromRedirect,
  useLoading,
  useRedirectPortal,
  useTutorials,
} from '~/composables'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'
import type { OAuthIntegration } from '~/composables/continue-oauth'
import { getFailDialogMessage } from '~/composables/continue-oauth'

const props = defineProps<{
  clientID: string
  deskSlug: string
}>()
const emit = defineEmits<{
  (event: 'loading', options?: { type?: 'opacity' | 'visible' }): void
  (event: 'ready'): void
}>()

const workspaceStore = useWorkspaceStore()
const { setTutorials } = useTutorials()

useHead({
  title: computed(() => `${workspaceStore.currentWorkspace?.name ?? ''} - Home - Storipress`),
})

const router = useRouter()
const route = useRoute()

const showMigratorUserDialog = ref(false)
const scraperToken = route.query['scraper-token'] as string | undefined
if (scraperToken) showMigratorUserDialog.value = true

function wrapPageLoadingAction(action: any) {
  return async (...args: any[]) => {
    emit('loading', { type: 'opacity' })
    await action(...args)
    emit('ready')
  }
}

const { warn } = inject(WarningNotificationKey, {
  warn:
    (message: string, config = { timeout: 3000, closable: true }) =>
    () => {},
})

const deskListPanel = ref()
const { result: desksQueryResult } = useQuery(ListDesksDocument)

const mapSlugToDesk = computed(() => {
  const desks = desksQueryResult.value?.desks ?? []
  return desks
    .flatMap((item) =>
      item.desks.length
        ? [item, ...item.desks.map((subdesk) => ({ ...subdesk, desks: [], open_access: item.open_access }))]
        : item,
    )
    .reduce<Record<string, ListDesksQuery['desks'][0]>>((res, item) => {
      return Object.assign(res, { [item.slug]: item })
    }, {})
})

const activeId = eagerComputed<string>(() => {
  switch (props.deskSlug) {
    case 'all':
      return DEFAULT_ITEM.ALL.id
    case 'featured':
      return DEFAULT_ITEM.FEATURED.id
    case 'mine':
      return DEFAULT_ITEM.MY_ARTICLES.id
    default:
      return mapSlugToDesk.value[props.deskSlug]?.id ?? DEFAULT_ITEM.ALL.id
  }
})

const mapSubDeskIdToParent = computed(() => {
  const desks = cloneDeep(desksQueryResult.value?.desks) ?? []
  return desks.reduce<Record<string, ListDesksQuery['desks'][0]>>((res, item) => {
    item.desks.forEach((subdesk) => (res[subdesk.id] = item))
    return res
  }, {})
})
const mapDeskIdToDesk = computed(() => {
  const desks = desksQueryResult.value?.desks ?? []
  return desks.reduce<Record<string, ListDesksQuery['desks'][0]>>((res, item) => {
    res[item.id] = item
    return res
  }, {})
})

const isInSubdesk = computed(() => {
  return Boolean(mapSubDeskIdToParent.value[activeId.value])
})

const { mutate: mutateCreateDesk } = useMutation(CreateDeskDocument, {
  refetchQueries: [ListDesksDocument, ListSimpleUsersDocument],
  awaitRefetchQueries: true,
})
const { mutate: mutateAssignUserToDesk } = useMutation(AssignUserToDeskDocument)

const addDeskSlideOverCtrl = useDeskSettingSlideOverControl({
  onSubmit: wrapPageLoadingAction(async (data: EventSubmitDataInterfaceOfAddDesk) => {
    try {
      const result = await mutateCreateDesk({
        input: { name: data.name, description: data.description, open_access: data.openAccess },
      })
      setTutorials('setCreateDesks')
      const deskId = result?.data?.createDesk?.id ?? ''
      await Promise.all(
        data.members
          .filter(({ role }) => role !== 'admin')
          .map(({ id: userId }) => mutateAssignUserToDesk({ userId, deskId })),
      )
      deskListPanel.value?.$el
        ?.querySelector('.desk-list')
        ?.scrollBy({ top: Number.MAX_SAFE_INTEGER, behavior: 'smooth' })
    } catch (e) {
      warn('There was an error creating your new desk. Please refresh your browser and retry.')
    }
  }),
})

const addSubDeskSlideOverParent = ref<EventClickAddSubdeskDataInterface>({
  id: '',
  name: '',
  description: '',
  slug: '',
  order: 0,
})
const addSubDeskSlideOverCtrl = useDeskSettingSlideOverControl({
  onShow: (data: EventClickAddSubdeskDataInterface) => {
    addSubDeskSlideOverParent.value = data
  },
  onSubmit: wrapPageLoadingAction(async (data: EventSubmitDataInterfaceOfAddSubdesk) => {
    try {
      const result = await mutateCreateDesk({
        input: { name: data.name, description: data.description, desk_id: data.parentId },
      })
      setTutorials('setCreateDesks')
      if (
        (isInSubdesk.value && mapSubDeskIdToParent.value[activeId.value].id === addSubDeskSlideOverParent.value.id) ||
        (!isInSubdesk.value && activeId.value === addSubDeskSlideOverParent.value.id)
      ) {
        if (addSubDeskSlideOverParent.value.desks?.length === 0) {
          router.push(`/${props.clientID}/articles/desks/${result?.data?.createDesk.slug}`)
        }
      }
    } catch (e) {
      warn('There was an error creating your new desk. Please refresh your browser and retry.')
    }
  }),
})

// const workspaceStore = useWorkspaceStore()
const { result: usersQueryResult } = useQuery<ListSimpleUsersQuery>(ListSimpleUsersDocument)

const lastEditTime = ref<Date>()
const currentDeskSetting = computed<DeskSettingDataInterface | undefined>(() => {
  const currentDesk = mapDeskIdToDesk.value[activeId.value] || mapSubDeskIdToParent.value[activeId.value]
  if (currentDesk) {
    return {
      id: currentDesk.id ?? '',
      name: currentDesk.name ?? '',
      openAccess: currentDesk.open_access ?? false,
      description: currentDesk.description ?? '',
      editTime: lastEditTime.value,
      members:
        usersQueryResult.value?.users
          .filter((user) => user.role === 'admin' || user.desks.some((desk) => desk.id === currentDesk?.id))
          .map((user) => ({
            id: user.id,
            name: user?.full_name ?? '',
            avatar: user?.avatar ?? '',
            status: user?.status ?? '',
            role: user?.role ?? '',
            desks: user.desks,
            suspended: user?.suspended ?? false,
          })) ?? [],
    }
  }
})
const defaultTeamMembers = computed(() => {
  return (
    usersQueryResult.value?.users
      .filter((user) => user.role === 'admin')
      .map((user) => ({
        id: user.id,
        name: user?.full_name ?? '',
        avatar: user?.avatar ?? '',
        status: user?.status ?? '',
        role: user?.role ?? '',
        desks: user.desks,
        suspended: user?.suspended ?? false,
      })) ?? []
  )
})
const mapSubDeskIdToDesk = computed(() => {
  const desks = desksQueryResult.value?.desks ?? []
  return desks.reduce<Record<string, ListDesksQuery['desks'][0]['desks'][0]>>((res, item) => {
    item.desks.forEach((subdesk) => (res[subdesk.id] = subdesk))
    return res
  }, {})
})
const currentSubDeskSetting = computed(() => {
  const currentSubDesk = mapSubDeskIdToDesk.value[activeId.value]
  return {
    id: currentSubDesk?.id,
    name: currentSubDesk?.name,
    description: currentSubDesk?.description ?? '',
  }
})

const { mutate: mutateUpdateDesk } = useMutation(UpdateDeskDocument, {
  refetchQueries: [ListDesksDocument, ListSimpleUsersDocument],
  awaitRefetchQueries: true,
})
const { mutate: mutateRevokeUserFromDesk } = useMutation(RevokeUserFromDeskDocument)
const { mutate: mutateDeleteDesk } = useMutation(DeleteDeskDocument, {
  refetchQueries: [ListDesksDocument, ListSimpleUsersDocument],
  awaitRefetchQueries: true,
})
const { mutate: mutateTransferDeskArticles } = useMutation(TransferDeskArticlesDocument, {
  refetchQueries: [ListDesksDocument, ListSimpleUsersDocument],
  awaitRefetchQueries: true,
})
const editDeskSlideOverCtrl = useDeskSettingSlideOverControl(
  {
    onSubmit: wrapPageLoadingAction(
      async (raw: EventSubmitDataInterfaceOfEditDesk | EventSubmitDataInterfaceOfEditSubDesk) => {
        try {
          const data = raw as EventSubmitDataInterfaceOfEditDesk
          const deskId = data.id
          const oldMemberIdSet = new Set<string>(currentDeskSetting.value?.members.map((member) => member.id))
          const newMemberIdSet = new Set<string>(data.members.map((member) => member.id))
          await Promise.all([
            ...Array.from(newMemberIdSet)
              .filter((id) => !oldMemberIdSet.has(id))
              .map((userId) => mutateAssignUserToDesk({ userId, deskId })),
            ...Array.from(oldMemberIdSet)
              .filter((id) => !newMemberIdSet.has(id))
              .map((userId) => mutateRevokeUserFromDesk({ userId, deskId })),
          ])
          const result = await mutateUpdateDesk({
            input: { id: data.id, name: data.name, description: data.description, open_access: data.openAccess },
          })
          lastEditTime.value = new Date()
          router.replace(`/${props.clientID}/articles/desks/${result?.data?.updateDesk.slug}`)
        } catch (e) {
          warn('There was an error updating your new desk. Please refresh your browser and retry.')
        }
      },
    ),
    onDelete: wrapPageLoadingAction(async ($event: any) => {
      try {
        const deleteId = currentDeskSetting.value?.id
        const redirectSlug = 'all'
        if (deleteId) {
          if ($event) await mutateTransferDeskArticles({ input: { from_id: deleteId, to_id: $event.id, trash: true } })
          else await mutateDeleteDesk({ id: deleteId })
        }
        router.push(`/${props.clientID}/articles/desks/${redirectSlug}`)
      } catch (e) {
        warn('There was an error deleting your new desk. Please refresh your browser and retry.')
      }
    }),
  },
  {
    keepSlideOverAfterSubmit: true,
  },
)
const editSubDeskSlideOverCtrl = useDeskSettingSlideOverControl(
  {
    onSubmit: wrapPageLoadingAction(
      async (raw: EventSubmitDataInterfaceOfEditDesk | EventSubmitDataInterfaceOfEditSubDesk) => {
        try {
          const data = raw as EventSubmitDataInterfaceOfEditSubDesk
          if (currentDeskSetting.value?.name !== data.name) {
            const result = await mutateUpdateDesk({
              input: { id: data.id, name: data.name, description: data.description },
            })
            router.replace(`/${props.clientID}/articles/desks/${result?.data?.updateDesk.slug}`)
          }
        } catch (e) {
          warn('There was an error updating your new desk. Please refresh your browser and retry.')
        }
      },
    ),
    onDelete: wrapPageLoadingAction(async ($event: any) => {
      try {
        const deleteId = currentSubDeskSetting.value.id
        const redirectSlug = mapSubDeskIdToParent.value[deleteId].slug
        if ($event) await mutateTransferDeskArticles({ input: { from_id: deleteId, to_id: $event.id, trash: true } })
        else await mutateDeleteDesk({ id: deleteId })
        router.push(`/${props.clientID}/articles/desks/${redirectSlug}`)
      } catch (e) {
        warn('There was an error deleting your new desk. Please refresh your browser and retry.')
      }
    }),
  },
  {
    keepSlideOverAfterSubmit: true,
  },
)

const isPredefinedDesk = computed(
  () => props.deskSlug === 'all' || props.deskSlug === 'featured' || props.deskSlug === 'mine',
)
watch(isPredefinedDesk, closeAllSlideOver)

const { canAccessDesk } = usePublicationPermission()
const canAccessDeskList = computed(() => {
  return desksQueryResult.value?.desks.filter((desk) => canAccessDesk(desk.id).value).sort((a, b) => a.order - b.order)
})

function closeAllSlideOver() {
  addDeskSlideOverCtrl.close(undefined)
  addSubDeskSlideOverCtrl.close(undefined)
  editDeskSlideOverCtrl.close(undefined)
  editSubDeskSlideOverCtrl.close(undefined)
}

function handleClickAll() {
  closeAllSlideOver()
  router.push(`/${props.clientID}/articles/desks/all`)
}
function handleClickFeatured() {
  closeAllSlideOver()
  router.push(`/${props.clientID}/articles/desks/featured`)
}
function handleClickMyArticles() {
  closeAllSlideOver()
  router.push(`/${props.clientID}/articles/desks/mine`)
}
async function handleClickDesk(desk: EventClickDeskDataInterface) {
  router.push(`/${props.clientID}/articles/desks/${desk.slug}`)
}
async function handleClickDeskSetting($event: any) {
  if (isPredefinedDesk.value) {
    const deskList = canAccessDeskList.value ?? []
    const firstCustomDesk = minBy(deskList, ({ order }) => order) || deskList[0]
    if (!firstCustomDesk) return
    await router.push(`/${props.clientID}/articles/desks/${firstCustomDesk.slug}`)
    nextTick(() => editDeskSlideOverCtrl.open($event))
  } else if (editSubDeskSlideOverCtrl.args.show || editDeskSlideOverCtrl.args.show) {
    !isInSubdesk.value ? editDeskSlideOverCtrl.close($event) : editSubDeskSlideOverCtrl.close($event)
  } else {
    !isInSubdesk.value ? editDeskSlideOverCtrl.open($event) : editSubDeskSlideOverCtrl.open($event)
  }
}

const desksLength = computed(() => {
  const result = desksQueryResult.value?.desks ?? []
  return result.length
})
watch([activeId, desksLength], ([activeDeskID]) => {
  const isSubdesk = mapSubDeskIdToParent.value[activeDeskID] !== undefined
  if (editDeskSlideOverCtrl.args.show && isSubdesk) {
    editDeskSlideOverCtrl.close(undefined)
    editSubDeskSlideOverCtrl.open(undefined)
  }
  if (editSubDeskSlideOverCtrl.args.show && !isSubdesk) {
    editSubDeskSlideOverCtrl.close(undefined)
    editDeskSlideOverCtrl.open(undefined)
  }
})

const deskForKanban = computed<ListDesksQuery['desks'][0]>(() => {
  switch (props.deskSlug) {
    case 'all':
      return {
        ...DEFAULT_ITEM.ALL,
        ...COMMON_DEFAULT,
      }
    case 'featured':
      return {
        ...DEFAULT_ITEM.FEATURED,
        ...COMMON_DEFAULT,
      }
    case 'mine':
      return {
        ...DEFAULT_ITEM.MY_ARTICLES,
        ...COMMON_DEFAULT,
      }
    default: {
      const temp = mapSlugToDesk.value[props.deskSlug]
      if (temp) return temp
      else return { ...DEFAULT_ITEM.ALL, ...FALLBACK_DEFAULT }
    }
  }
})

const { isFromRedirect } = useFromRedirect()
const portal = useRedirectPortal()
const continueOauth = useContinueOauth({
  code: route.query.code as string,
  integration: route.query.integration as string,
})
const { ready } = useLoading()

const key = (route.query.integration || 'shopify') as OAuthIntegration
const confirmData = ref()
const [confirmOauthFail] = useConfirmFunction(
  computed(() => [
    confirmData.value?.[key] ?? {
      type: 'warning',
      title: 'Integration failed.',
      description: 'Please try again.',
      okText: 'Continue',
    },
  ]),
)

onMounted(async () => {
  const { clientID: id } = router.currentRoute.value.params

  if (isFromRedirect.value && route.query.code) {
    // only continue shopify oauth
    if (key === 'shopify') {
      const oauthResult = await continueOauth(id as string)
      const normalizedOauth =
        typeof oauthResult === 'number'
          ? {
              success: false,
              errorCode: oauthResult,
            }
          : {
              success: oauthResult,
              errorCode: undefined,
            }

      if (!normalizedOauth.success) {
        confirmData.value = getFailDialogMessage(normalizedOauth.errorCode)
        const confirmed = await confirmOauthFail()
        if (confirmed) {
          return router.push(
            `/${id}/preferences/publication/integrations?integration=${route.query.integration as string}`,
          )
        }
        return router.push(`/${id}`)
      }

      // continue redirect to integration
      portal({
        ...route.query,
        to: RedirectTarget.Integration,
        client_id: id,
      })
      return
    } else {
      // clear wordpress redirect code
      router.replace({
        path: route.path,
      })
    }
  }

  ready()
})

const isMediumScreen = useMediaQuery('(min-width: 768px)')

const canAccessDeskCurrentDesk = canAccessDesk(activeId)
const canAccessThisDesk = computed(() => isPredefinedDesk.value || canAccessDeskCurrentDesk.value)
watch(
  [activeId, router.currentRoute, canAccessThisDesk],
  (() => {
    let close: (() => void) | undefined
    return async () => {
      if (router.currentRoute.value.name !== 'clientID-articles-desks-deskSlug' || canAccessThisDesk.value) {
        if (close) {
          close()
          close = undefined
        }
      } else {
        close = await warn(
          'You do not have permissions to edit articles in this desk. Ask an Editor, Admin, or the Publication Owner to invite you to this desk.',
          { timeout: 2147483647, closable: false },
        )
      }
    }
  })(),
)

const mainEl = ref<HTMLElement | null | undefined>()
const { x } = useScroll(mainEl)
const showScrollCoverInFrontOfKanban = computed<boolean>(() => x.value > 0)
</script>

<template>
  <NotificationProvider>
    <DraggableGroupProvider>
      <div
        :ref="(comp: any) => (mainEl = comp?.querySelector('[role=kanban]') as HTMLElement)"
        class="relative flex h-full items-stretch overflow-hidden"
      >
        <component :is="isMediumScreen ? 'div' : SlideOver">
          <LeftHandNavPanel
            ref="deskListPanel"
            class="left-hand-nav-panel relative -mt-px flex-none"
            :class="[
              showScrollCoverInFrontOfKanban ? 'md:after:opacity-100' : 'md:after:opacity-0',
              showScrollCoverInFrontOfKanban ? 'md:before:opacity-100' : 'md:before:opacity-0',
            ]"
            :desks="desksQueryResult?.desks"
            :active-id="activeId"
            :edit-desk-slide-visible="editDeskSlideOverCtrl.args.show || editSubDeskSlideOverCtrl.args.show"
            :can-access-desk-count="canAccessDeskList?.length"
            @click-all="handleClickAll"
            @click-featured="handleClickFeatured"
            @click-my-articles="handleClickMyArticles"
            @click-add-desk="addDeskSlideOverCtrl.open"
            @click-add-subdesk="addSubDeskSlideOverCtrl.open"
            @click-desk="handleClickDesk"
            @click-desk-setting="handleClickDeskSetting"
          />
        </component>

        <Kanban
          :client-id="clientID"
          :desk="deskForKanban"
          class="h-[calc(100vh-3.5rem)] flex-grow"
          @loading="emit('loading', { type: 'opacity' })"
          @ready="emit('ready')"
        />
      </div>
      <AddDeskSlideOver
        v-bind="addDeskSlideOverCtrl.args"
        :default-members="defaultTeamMembers"
        @close="addDeskSlideOverCtrl.close"
        @submit="addDeskSlideOverCtrl.submit"
      />
      <AddSubDeskSlideOver
        v-bind="addSubDeskSlideOverCtrl.args"
        :parent="addSubDeskSlideOverParent"
        @close="addSubDeskSlideOverCtrl.close"
        @submit="addSubDeskSlideOverCtrl.submit"
      />
      <EditDeskSettingsSlideOver
        :show="editDeskSlideOverCtrl.args.show"
        :loading="editDeskSlideOverCtrl.args.loading"
        :workspace-name="workspaceStore.currentWorkspace?.name"
        :desk-setting="currentDeskSetting"
        @close="editDeskSlideOverCtrl.close"
        @submit="editDeskSlideOverCtrl.submit"
        @delete="editDeskSlideOverCtrl.delete"
      />
      <EditSubDeskSettingsSlideOver
        :show="editSubDeskSlideOverCtrl.args.show"
        :loading="editSubDeskSlideOverCtrl.args.loading"
        :workspace-name="workspaceStore.currentWorkspace?.name ?? ''"
        :desk="currentSubDeskSetting"
        :parent="mapSubDeskIdToParent[activeId]"
        @close="editSubDeskSlideOverCtrl.close"
        @submit="editSubDeskSlideOverCtrl.submit"
        @delete="editSubDeskSlideOverCtrl.delete"
      />
    </DraggableGroupProvider>
    <MigratorUserDialog
      v-if="scraperToken"
      v-model="showMigratorUserDialog"
      :desks="desksQueryResult?.desks"
      :client-id="clientID"
      :scraper-token="scraperToken"
    />
  </NotificationProvider>
</template>

<style lang="scss">
body > div[aria-live='assertive'] {
  z-index: 999999;
}
.left-hand-nav-panel::after {
  @apply absolute left-[calc(100%+1px)] top-0 z-20 h-full w-8 bg-stone-100 transition-opacity;
}
.left-hand-nav-panel::before {
  @apply absolute left-[calc(100%+1px+2rem-10px)] top-0 z-20 h-full w-[30px] transition-opacity;
  background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
}
</style>

<route lang="yaml">
meta:
  layout: home-layout
  searchInputType: Article # Article | Member | Schedule
  searchPlaceholder: Search articles…
</route>
