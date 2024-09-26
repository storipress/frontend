<script lang="ts" setup>
import { debounce, noop } from 'lodash-es'
import { MenuButton } from '@headlessui/vue'
import {
  Destructive as DestructiveModal,
  Dropdowns,
  HoverHint,
  Icon,
  MenuItem,
  Pagination,
  Buttons as SpButton,
  Table as SpTable,
} from '@storipress/core-component'
import type { IColumnInfo } from './definition'
import { SubscriptionTypeMap } from './definition'
import MemberDetail from './MemberDetail.vue'
import ActivityChips from './ActivityChips.vue'
import { dayjs } from '~/lib/dayjs'
import { LoadingWrap } from '~/components/Loading'
import Avatar from '~/components/Navbar/Avatar.vue'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'
import {
  AssignSubscriberSubscriptionDocument,
  DeleteSubscribersDocument,
  ExportSubscribersDocument,
  GetSiteDocument,
  ImportSubscribersFromCsvFileDocument,
  QuerySubscribersSearchSortByColumn,
  RevokeSubscriberSubscriptionDocument,
  SortOrder,
  SubscribeSubscribersDocument,
  SubscribersDocument,
  UnsubscribeSubscribersDocument,
} from '~/graphql-operations'
import { useWorkspaceStore } from '~/stores/workspace'
import { useSearchConditionStore } from '~/stores/search-condition'
import SlideOver from '~/components/SlideOver'
import { usePublicationPermission } from '~/composables/permission/publication'
import { useNotification } from '~/composables'

defineOptions({
  name: 'MembersTableArea',
})
const emit = defineEmits<(event: 'error', type?: 'default' | 'subscription' | 'import') => void>()
const workspaceStore = useWorkspaceStore()
const searchConditionStore = useSearchConditionStore()

const searchMode = computed(() => Boolean(searchConditionStore.text))

const { canManageSubscribers } = usePublicationPermission()

const pageItemQuantity = 50
const currentPage = ref(1)

const { result: siteResult, loading: loadingSite } = useQuery(GetSiteDocument)
const {
  result: subscribersResult,
  refetch: refetchSubscribers,
  loading: loadingSubscribers,
} = useQuery(SubscribersDocument, {
  first: pageItemQuantity,
  page: currentPage.value,
})

const members = computed(() => {
  return (
    subscribersResult.value?.subscribers?.data?.map((subscriber) => {
      const currency = siteResult.value?.site.currency ?? 'US'
      function getActivity() {
        if (subscriber.bounced) return -2
        if (!subscriber.newsletter) return -1
        return subscriber.activity
      }
      function getSubscriptionType(): SubscriptionTypeMap {
        const interval = subscriber.subscription?.interval
        if (interval === 'lifetime') return SubscriptionTypeMap.PaidManual
        if (subscriber.subscription_type === 'subscribed') return SubscriptionTypeMap.Paid
        if (subscriber.subscription_type === 'free') return SubscriptionTypeMap.Free

        return SubscriptionTypeMap.Unsubscribed
      }

      return {
        id: subscriber.id,
        avatar: subscriber.avatar,
        subscriber: subscriber.email as string,
        subscriptionType: getSubscriptionType(),
        activity: getActivity(),
        subscriptionDate: dayjs(subscriber.created_at).format('MMMM Do, YYYY'),
        revenue: `${currency}$${subscriber.revenue.replace(/\B(?=\d{2}$)/, '.')}`,
        bounced: subscriber.bounced,
        newsletter: subscriber.newsletter,
      }
    }) ?? []
  )
})
type Member = (typeof members.value)[number]

const columnsInfo = computed(() => {
  const sortable = members.value.length > 0
  return [
    {
      key: 'subscriber',
      title: 'Subscriber',
      sortable,
    },
    {
      key: 'subscriptionType',
      title: 'Type',
      sortable,
    },
    {
      key: 'activity',
      title: 'Activity',
      sortable,
    },
    {
      key: 'subscriptionDate',
      title: 'Subscription date',
      sortable,
    },
    {
      key: 'revenue',
      title: 'Revenue',
      sortable,
    },
    { key: 'extra' },
  ] as IColumnInfo[]
})

const paginatorInfo = computed(() => ({
  total: subscribersResult.value?.subscribers?.paginatorInfo?.total ?? 0,
}))

const sortData = ref<{ column: QuerySubscribersSearchSortByColumn; order: SortOrder }[]>()
const subscribersVariables = computed(() => {
  if (searchMode.value) {
    return { sortBy: sortData.value, search: searchConditionStore.text }
  }
  return { sortBy: sortData.value, search: undefined }
})
watch(currentPage, (newPage) => {
  refetchSubscribers({
    ...subscribersVariables.value,
    first: pageItemQuantity,
    page: newPage,
  })
})
watch(
  () => searchConditionStore.text,
  debounce(() => {
    currentPage.value = 1
    refetchSubscribers({
      ...subscribersVariables.value,
      first: pageItemQuantity,
      page: 1,
    })
  }, 800),
)

const isTyping = ref(false)
const endTyping = debounce(() => (isTyping.value = false), 1000)
watch(
  () => searchConditionStore.text,
  () => {
    isTyping.value = true
    endTyping()
  },
)

const pageLength = computed(() => {
  const dataLength = paginatorInfo.value.total
  if (pageItemQuantity <= 0 || dataLength <= 0) return 0
  return Math.ceil(dataLength / pageItemQuantity)
})

const uploadRef = ref<HTMLInputElement>(document.createElement('input'))
const exportRef = ref<HTMLElement>(document.createElement('a'))
const tableRef = ref()

const {
  onDone: onDoneImport,
  mutate: mutateImport,
  onError: onErrorImport,
} = useMutation(ImportSubscribersFromCsvFileDocument)
const { create: notifications } = useNotification()
onDoneImport(() => {
  notifications({
    title: 'Subscribers uploaded.',
    type: 'primary',
    iconName: 'refresh',
    content: 'Subscribers upload in progress. This may up to an hour.',
  })
  if (currentPage.value !== 1) return (currentPage.value = 1)
  refetchSubscribers({
    ...subscribersVariables.value,
    first: pageItemQuantity,
    page: 1,
  })
})
onErrorImport(() => emit('error', 'import'))

async function upload(event: Event) {
  const target = event?.target as HTMLInputElement
  if (!target?.files) return
  const file = target.files?.[0]
  await mutateImport({ file })
  uploadRef.value.value = ''
}

const { onDone: onDoneExport, mutate: mutateExport, onError: onErrorExport } = useMutation(ExportSubscribersDocument)
onDoneExport(({ data }) => {
  const csvContent = `data:text/csv;charset=utf-8,${data?.exportSubscribers ?? ''}`
  exportRef.value.setAttribute('href', encodeURI(csvContent))
  exportRef.value.setAttribute(
    'download',
    `${workspaceStore.currentWorkspace?.name ?? 'Storipress'}_Subscribers_${dayjs().format('YYYY-MM-DD')}.csv`,
  )
  exportRef.value.click()
})
onErrorExport(() => emit('error'))

const memberDetailId = ref<string | null>(null)
function onItemClick(rowIndex: number) {
  memberDetailId.value = members.value[rowIndex].id
}

const selectedIdList = ref<Set<string>>(new Set())
function onSelected(selected: Set<string>) {
  selectedIdList.value = selected
}

const selectedSubscriber = ref('')
const [confirmDeleteUser, confirmAssignSubscription, confirmRevokeSubscription] = useConfirmFunction(
  computed(() => [
    {
      type: 'info',
      title: 'Unsubscribe Subscriber(s)',
      description:
        'These subscribers will no longer receive emails from you. You will retain their profile information, and you can resubscribe them at any time.',
      okText: 'Unsubscribe',
    },
    {
      type: 'info',
      title: 'Assign subscription',
      description: `You will assign the subscription to this subscriber${
        selectedSubscriber.value ? ` ${selectedSubscriber.value}` : '(s)'
      }.`,
      okText: 'Assign',
    },
    {
      type: 'info',
      title: 'Revoke subscription',
      description: `You will revoke the subscription to this subscriber${
        selectedSubscriber.value ? ` ${selectedSubscriber.value}` : '(s)'
      }.`,
      okText: 'Revoke',
    },
  ]),
)

const destructiveModalOpen = ref(false)
const needRemovedID = ref<string | null>(null)
function setModalOpen(toOpen: boolean, row?: any) {
  if (!toOpen) {
    needRemovedID.value = null
    destructiveModalOpen.value = toOpen
    return
  }
  needRemovedID.value = row?.id ?? null
  destructiveModalOpen.value = toOpen
}

const { mutate: mutateDeleteSubscribers, onError: onErrorDelete } = useMutation(DeleteSubscribersDocument)
onErrorDelete(() => emit('error'))
async function removeItem() {
  if (needRemovedID.value) {
    await mutateDeleteSubscribers({ ids: [needRemovedID.value] })
  } else {
    await mutateDeleteSubscribers({ ids: [...selectedIdList.value] })
  }
  refetchSubscribers({
    ...subscribersVariables.value,
    first: pageItemQuantity,
    page: currentPage.value,
  })
  tableRef?.value?.clearSelected()
  destructiveModalOpen.value = false
}

enum MutateType {
  Subscribe = 'Subscribe',
  Unsubscribe = 'Unsubscribe',
}

function getMutateType(newsletter: boolean) {
  return newsletter ? MutateType.Unsubscribe : MutateType.Subscribe
}

const mutateType = computed(() => {
  const selectedIsAllUnsubscribe = [...selectedIdList.value].every(
    (id) => !members.value.find((member) => member.id === id)?.newsletter,
  )
  if (selectedIsAllUnsubscribe) return MutateType.Subscribe
  return MutateType.Unsubscribe
})

const { mutate: mutateSubscribe, onError: onErrorSubscribe } = useMutation(SubscribeSubscribersDocument)
const { mutate: mutateUnsubscribe, onError: onErrorUnsubscribe } = useMutation(UnsubscribeSubscribersDocument)
onErrorSubscribe(() => emit('error'))
onErrorUnsubscribe(() => emit('error'))
async function updateItemSubscriptionType(type: MutateType, id?: string) {
  const confirm = type === MutateType.Subscribe ? () => Promise.resolve(true) : confirmDeleteUser
  const mutate = type === MutateType.Subscribe ? mutateSubscribe : mutateUnsubscribe

  if (!(await confirm())) return
  if (id) {
    await mutate({ ids: [id] })
  } else {
    await mutate({ ids: [...selectedIdList.value] })
  }
  refetchSubscribers({
    ...subscribersVariables.value,
    first: pageItemQuantity,
    page: currentPage.value,
  })
  tableRef?.value?.clearSelected()
}

const { mutate: mutateAssignSubscription, onError: onErrorAssignSubscription } = useMutation(
  AssignSubscriberSubscriptionDocument,
)
const { mutate: mutateRevokeSubscription, onError: onErrorRevokeSubscription } = useMutation(
  RevokeSubscriberSubscriptionDocument,
)
onErrorAssignSubscription(() => emit('error', 'subscription'))
onErrorRevokeSubscription(() => emit('error', 'subscription'))

async function updateSubscriptionMode(member: Member) {
  const { id, subscriptionType: type, subscriber } = member
  selectedSubscriber.value = subscriber

  const confirm = type === SubscriptionTypeMap.Free ? confirmAssignSubscription : confirmRevokeSubscription
  const mutate = type === SubscriptionTypeMap.Free ? mutateAssignSubscription : mutateRevokeSubscription

  if (!(await confirm()) || !id) return

  await mutate({ id })
  refetchSubscribers({
    ...subscribersVariables.value,
    first: pageItemQuantity,
    page: currentPage.value,
  })
  selectedSubscriber.value = ''
}

const sortMap = ref<Record<string, 'ASC' | 'DESC'>>({
  subscriptionType: 'ASC',
})
interface onClickSortParams {
  column: IColumnInfo
  sortby: 'ASC' | 'DESC'
}

function sortby({ column, sortby }: onClickSortParams) {
  sortMap.value = { [column.key]: sortby }

  const getColumnKey = (key: string) => {
    switch (key) {
      case 'activity':
        return QuerySubscribersSearchSortByColumn.Activity
      case 'revenue':
        return QuerySubscribersSearchSortByColumn.Revenue
      case 'subscriptionDate':
        return QuerySubscribersSearchSortByColumn.CreatedAt
      case 'subscriptionType':
      default:
        return QuerySubscribersSearchSortByColumn.SubscribedAt
    }
  }
  const getOrder = (sortby: 'ASC' | 'DESC') => {
    switch (sortby) {
      case 'ASC':
        return SortOrder.Asc
      case 'DESC':
      default:
        return SortOrder.Desc
    }
  }

  const sortBy = [{ column: getColumnKey(column.key), order: getOrder(sortby) }]
  sortData.value = sortBy
  refetchSubscribers({
    sortBy,
    search: searchMode.value ? searchConditionStore.text : undefined,
    first: pageItemQuantity,
    page: currentPage.value,
  })
}

const queryLoading = computed<boolean>(() => loadingSite.value || loadingSubscribers.value)
</script>

<template>
  <div class="flex pt-5">
    <h2 class="text-pageheading mr-6 py-5 text-stone-800">All subscribers ({{ paginatorInfo.total }})</h2>
    <div v-if="canManageSubscribers" class="flex flex-1 items-center gap-2">
      <input ref="uploadRef" type="file" class="hidden" accept="text/csv" @change="upload" />
      <SpButton is-shadow type="main" color="primary" @click="uploadRef.click()">Import subscribers</SpButton>
      <a ref="exportRef" class="hidden" />
      <SpButton is-shadow @click="mutateExport">Export</SpButton>
      <div class="flex-1" />
      <p v-if="selectedIdList.size" class="text-style-2 mr-4 text-stone-600">{{ selectedIdList.size }} selected</p>
      <SpButton
        v-if="selectedIdList.size"
        is-shadow
        class="bg-stone-600 text-white hover:bg-stone-700"
        @click="updateItemSubscriptionType(mutateType)"
      >
        {{ mutateType === MutateType.Subscribe ? 'Subscribe' : 'Unsubscribe' }}
      </SpButton>
      <SpButton v-if="selectedIdList.size" is-shadow color="warning" @click="setModalOpen(true)">
        Remove from list
      </SpButton>
    </div>
  </div>
  <hr class="mb-4 h-px bg-stone-200" />
  <LoadingWrap :loading="queryLoading || isTyping">
    <template #loading>
      <p class="text-display-large py-24 text-center text-stone-400">Loading Subscribers…</p>
    </template>
    <SpTable
      id="sp-table"
      ref="tableRef"
      :columns="columnsInfo"
      :data="members"
      :sort-map="sortMap"
      :selectable="canManageSubscribers"
      row-key="id"
      @item-click="onItemClick($event)"
      @selected="onSelected($event)"
      @sortby="sortby"
    >
      <template #data-0="{ row }">
        <div class="flex w-max items-center">
          <Avatar :src="row.avatar" class-size="w-6 h-6" />
          <span class="ml-3 text-stone-800">{{ row.subscriber }}</span>
        </div>
      </template>
      <template #data-2="{ row }">
        <ActivityChips :bounced="row.bounced" :newsletter="row.newsletter" :activity="row.activity" />
      </template>
      <template v-if="canManageSubscribers" #data-5="{ row }">
        <Dropdowns placement="left" class="h-fit flex-1 outline-0">
          <template #button>
            <MenuButton
              class="text-body inline-flex justify-center rounded-full bg-white text-stone-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              @click.stop="noop"
            >
              <Icon icon-name="dots_vertical" class="cursor-pointer px-1 text-xl text-stone-500" />
            </MenuButton>
          </template>
          <template #default>
            <MenuItem
              v-if="row.activity !== -1 && row.subscriptionType !== SubscriptionTypeMap.Paid"
              @click.prevent.stop="updateSubscriptionMode(row)"
            >
              {{ row.subscriptionType === SubscriptionTypeMap.Free ? 'Upgrade to paid' : 'Downgrade to free' }}
            </MenuItem>

            <HoverHint :disabled="row.newsletter" reference-class="w-full">
              <MenuItem @click.prevent.stop="updateItemSubscriptionType(getMutateType(row.newsletter), row.id)">
                {{ row.newsletter ? 'Unsubscribe' : 'Resubscribe' }}
              </MenuItem>
              <template #content>On resubscribe, then you can upgrade to paid</template>
            </HoverHint>

            <MenuItem @click.prevent.stop="setModalOpen(true, row)">Remove from list</MenuItem>
          </template>
        </Dropdowns>
      </template>
      <template #tfoot>
        <tfoot v-if="Boolean(pageItemQuantity) && Boolean(members?.length)">
          <tr>
            <td :colspan="(columnsInfo?.length ?? 1) + 1">
              <div class="flex items-center bg-white px-8 py-[0.813rem]">
                <p class="text-body text-stone-600">
                  Showing
                  <span class="font-bold">
                    {{ (currentPage - 1) * pageItemQuantity + 1 }}
                  </span>
                  to
                  <span class="font-bold">
                    {{ currentPage === pageLength ? paginatorInfo.total : currentPage * pageItemQuantity }}
                  </span>
                  of
                  <span class="font-bold">{{ paginatorInfo.total }}</span>
                  results
                </p>
                <div class="flex-1" />
                <Pagination v-model="currentPage" :page-length="pageLength" />
              </div>
            </td>
          </tr>
        </tfoot>
      </template>
    </SpTable>
  </LoadingWrap>
  <DestructiveModal
    title="Subs"
    :confirm-value="`${workspaceStore.currentWorkspace?.name}/Delete-Members`"
    button-text="member(s)"
    :visible="destructiveModalOpen"
    @on-modal-close="setModalOpen(false)"
    @on-click-delete="removeItem"
  >
    You've selected {{ needRemovedID == null ? selectedIdList.size : 1 }} email.
    <p class="my-6">
      This will remove this user and their associated profile data from your email list forever. If any of these emails
      have paid subscriptions, they will be issued a pro-rated refund before being removed from the list. Free
      subscribers will simply be removed from your email list.
    </p>

    <p>If you want to preserve user data, unsubscribe the user instead.</p>
  </DestructiveModal>
  <SlideOver
    class="add-desk-slide-over z-50"
    :show="!!memberDetailId"
    title="Member profile"
    @close="memberDetailId = null"
  >
    <MemberDetail v-if="memberDetailId" :id="memberDetailId" />
  </SlideOver>
</template>

<style scoped lang="postcss">
:deep(#sp-table thead) {
  @apply select-none;
}
</style>
