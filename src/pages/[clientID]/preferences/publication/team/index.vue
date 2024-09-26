<script lang="ts" setup>
import { Avatar, Buttons, Checkbox, Destructive, Dropdowns, MenuItem, SubMenu, Table } from '@storipress/core-component'
import * as Sentry from '@sentry/vue'
import { permissionList } from './data'
import type { EditUserDesksInput, MemberDataInterface } from './definition'
import DesksPopover from '~/components/MemberTable/DesksPopover.vue'
import { useMeStore } from '~/stores/me'
import { useWorkspaceStore } from '~/stores/workspace'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'
import type { ChangeRoleInput, ListDesksQuery, ListInvitationsQuery } from '~/graphql-operations'
import {
  AssignUserToDeskDocument,
  ChangeUserRoleDocument,
  DeleteUserDocument,
  ListDesksDocument,
  ListInvitationsDocument,
  ListSimpleUsersDocument,
  ResendInvitationDocument,
  RevokeInvitationDocument,
  RevokeUserFromDeskDocument,
  SuspendUserDocument,
  UnsuspendUserDocument,
  UserStatus,
  UserStatus as UserStatusType,
} from '~/graphql-operations'
import { RolesTitleMap, desksSorter, roleSorter, useNotification, useRoles, useSort } from '~/composables'
import { useCheckoutDialog } from '~/hooks/useCheckoutDialog'

const meStore = useMeStore()
const workspaceStore = useWorkspaceStore()
useHead({
  title: computed(() => `${workspaceStore.currentWorkspace?.name ?? ''} - Publication details - Storipress`),
})

const { result: usersResult } = useQuery(ListSimpleUsersDocument)
const { result: invitationsResult } = useQuery(ListInvitationsDocument)
const { result: desksQueryResult } = useQuery(ListDesksDocument)

const userInfo = computed(() => {
  return {
    id: meStore.me?.id ?? '',
    role: meStore.me?.role ?? '',
  }
})

const usersList = computed(() => {
  const users = usersResult.value?.users ?? []
  const invitations = invitationsResult.value?.invitations ?? []

  const usersData = users.map((user) => {
    return {
      ...user,
      name: user.full_name,
      status: user.suspended ? UserStatus.Suspended : UserStatus.Active,
    }
  })
  const invitationsData = invitations.map((invitation) => {
    return {
      ...invitation,
      name: invitation.email,
      status: UserStatus.Invited,
    }
  })
  return [...usersData, ...invitationsData]
})

const sortRule = {
  desks: desksSorter,
  role: roleSorter,
}
const { sortMap, sortby } = useSort(usersList, { sortRule })
const { roles } = useRoles()

const desks = computed(() => {
  return desksQueryResult.value?.desks ?? ([] as ListDesksQuery['desks'])
})

const permission = computed(() => {
  const hasPermissions = permissionList[userInfo.value.role]
  return hasPermissions || new Set([])
})
const rolesList = computed(() => (userRole: string) => {
  return roles.value.filter(({ name }) => name !== userRole && permission.value.has(`${name}Update`))
})

const { create: notifications } = useNotification()
const { mutate: mutateAssignUserToDesk } = useMutation(AssignUserToDeskDocument)
const { mutate: mutateRevokeUserFromDesk } = useMutation(RevokeUserFromDeskDocument)
const { mutate: mutateChangeUserRole } = useMutation(ChangeUserRoleDocument)
const { onDone: onDoneDeleteUser, mutate: mutateDeleteUser } = useMutation(DeleteUserDocument)
const { mutate: mutateRevokeInvitation } = useMutation(RevokeInvitationDocument)
const { mutate: mutateResendInvitation } = useMutation(ResendInvitationDocument)

function assignUserToDesk({ result, input }: EditUserDesksInput) {
  mutateAssignUserToDesk(input, {
    optimisticResponse: {
      __typename: 'Mutation',
      assignUserToDesk: {
        __typename: 'User',
        id: input.userId,
        desks: result,
      },
    },
  })
}
function revokeUserFromDesk({ result, input }: EditUserDesksInput) {
  mutateRevokeUserFromDesk(input, {
    optimisticResponse: {
      __typename: 'Mutation',
      revokeUserFromDesk: {
        __typename: 'User',
        id: input.userId,
        desks: result,
      },
    },
  })
}

const { openDialog, checkPaidRole, refetchBilling, loading: loadingCheckout, isFreePlan } = useCheckoutDialog()
async function changeUserRole({ input }: { input: ChangeRoleInput }) {
  await until(loadingCheckout).not.toBeTruthy()
  if (isFreePlan.value && checkPaidRole(input.role_id)) {
    const checkoutDone = await openDialog()
    if (!checkoutDone) return
    await refetchBilling()
  }
  await mutateChangeUserRole({ input })
}
async function resendInvitation(id: string) {
  const result = await mutateResendInvitation({ id })
  if (result?.data?.resendInvitation) {
    notifications({
      title: 'Invite successfully resent',
      type: 'primary',
      content: 'Resent invitation email. Ask the user to check inbox.',
    })
  }
}
async function revokeInvitation(id: string) {
  try {
    const result = await mutateRevokeInvitation(
      { id },
      {
        update(cache, { data }) {
          if (!data || !data.revokeInvitation) {
            return
          }
          cache.updateQuery({ query: ListInvitationsDocument }, (query): ListInvitationsQuery | void => {
            if (!query || !query.invitations) {
              return
            }

            const { invitations } = query
            return {
              __typename: 'Query',
              invitations: [...invitations.filter((invitation) => invitation.id !== id)],
            }
          })
        },
      },
    )
    if (result?.data?.revokeInvitation) {
      notifications({
        title: 'Invite revoked',
        type: 'primary',
        content: 'The invite will no longer be valid.',
      })
    }
  } catch (error) {
    Sentry.captureException(error)
  }
}

const selectedMemberIds = ref<Set<string>>(new Set())

const columnsInfo = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'status', title: 'Status', sortable: true },
  { key: 'role', title: 'Role', sortable: true },
  { key: 'desks', title: 'Desks', sortable: true },
  { key: 'extra', title: '', sortable: false },
]

const statusResult = computed(() => (row: MemberDataInterface) => {
  const result = { text: '', color: '' }
  switch (row.status) {
    case 'active':
      result.text = 'Active'
      break
    case 'invited':
      result.color = 'text-sky-700'
      result.text = 'Invited'
      break
    case 'suspended':
      result.color = 'text-stone-400'
      result.text = 'Suspended'
      break
  }
  return result
})

const hasAllPermissions = computed(() => {
  const ALL_DESKS_ROLES = ['owner', 'admin']
  return ALL_DESKS_ROLES.includes(userInfo.value.role)
})
const hasSelfPermissions = computed(() => (user: MemberDataInterface) => {
  return permission.value.has(`${user.role}SelfUpdate`) && userInfo.value.id === user.id
})
function hasSelectable({ status, role }: { status?: UserStatusType | null; role?: string | null }) {
  return status !== 'invited' && role !== 'owner'
}
const isInvitedStatus = computed(() => (status: UserStatusType) => status === 'invited')

const [confirmSuspendUser, confirmUnsuspendUser] = useConfirmFunction([
  {
    type: 'info',
    title: 'Suspend user(s)',
    description:
      'Suspending a user removes their ability to access your publication and edit or create articles but retains their articles so that they remain live.',
    okText: 'Suspend',
    cancelText: 'Cancel',
  },
  {
    type: 'info',
    title: 'Unsuspend user(s)',
    description:
      'Suspending a user removes their ability to access your publication and edit or create articles but retains their articles so that they remain live.',
    okText: 'Unsuspend',
    cancelText: 'Cancel',
  },
])
const { onDone: onDoneMutateSuspendUser, mutate: mutateSuspendUser } = useMutation(SuspendUserDocument)
const { onDone: onDoneMutateUnsuspendUser, mutate: mutateUnsuspendUser } = useMutation(UnsuspendUserDocument)
const userStatusContent = computed(() => (status: UserStatusType) => {
  return status === 'suspended'
    ? 'This user has been suspended and will no longer have access to this publication. All their articles are still live.'
    : 'This user has been unsuspended and will have access to this publication.'
})
function userStatusNotification(status: UserStatusType) {
  selectedMemberIds.value.clear()
  notifications({
    title: `User ${status}`,
    type: 'primary',
    content: userStatusContent.value(status),
  })
}
onDoneMutateSuspendUser(({ data }) => {
  if (data?.suspendUser) {
    for (const item of data.suspendUser) {
      userStatusNotification(item.status ?? UserStatusType.Suspended)
    }
  }
})
onDoneMutateUnsuspendUser(({ data }) => {
  if (data?.unsuspendUser) {
    for (const item of data.unsuspendUser) {
      userStatusNotification(item.status ?? UserStatusType.Active)
    }
  }
})
async function clickChangeUserStatus(row: MemberDataInterface) {
  if (row.suspended) {
    if (await confirmUnsuspendUser()) {
      mutateUnsuspendUser({ ids: [row.id] })
    }
  } else {
    if (await confirmSuspendUser()) {
      mutateSuspendUser({ ids: [row.id] })
    }
  }
}
async function onOpenSuspendUser() {
  if (await confirmSuspendUser()) {
    mutateSuspendUser({ ids: [...selectedMemberIds.value] })
  }
}

const visible = ref(false)
const draftDeleteUser = ref([] as string[])
async function onOpenRemoveUser(userId: string | Set<string>) {
  typeof userId === 'string' ? draftDeleteUser.value.push(userId) : draftDeleteUser.value.push(...userId)
  visible.value = true
}
function onModalClose() {
  draftDeleteUser.value = []
  visible.value = false
}
onDoneDeleteUser(() => {
  selectedMemberIds.value.clear()
  draftDeleteUser.value = []
  visible.value = false
  notifications({
    title: 'User deleted',
    type: 'primary',
    content: 'User and their articles deleted permanently.',
  })
})
function onClickDelete() {
  draftDeleteUser.value.forEach((id, index) => {
    mutateDeleteUser(
      { id },
      draftDeleteUser.value.length - index === 1
        ? {
            refetchQueries: [ListSimpleUsersDocument],
          }
        : undefined,
    )
  })
}
</script>

<template>
  <div class="w-full">
    <Section title="Your content team">
      <template v-if="selectedMemberIds.size !== 0" #sectionRight>
        <div class="text-body mr-6 text-stone-600">{{ selectedMemberIds.size }} selected</div>
        <Buttons
          type="main"
          color="default"
          class="mr-2 bg-stone-600 text-white hover:bg-stone-700"
          @click="onOpenSuspendUser"
          >Suspend</Buttons
        >
        <Buttons type="main" color="warning" @click="onOpenRemoveUser(selectedMemberIds)">Remove user</Buttons>
      </template>
      <Table
        :columns="columnsInfo"
        :data="usersList"
        :sort-map="sortMap"
        :selectable="hasAllPermissions"
        row-key="id"
        class="mt-4"
        @sortby="sortby"
        @select-all="
          usersList.forEach(({ id, status, role }) => hasSelectable({ status, role }) && selectedMemberIds.add(id))
        "
        @deselect-all="selectedMemberIds.clear()"
        @select-row="({ row: { id } }) => selectedMemberIds.add(id)"
        @deselect-row="({ row: { id } }) => selectedMemberIds.delete(id)"
      >
        <template #row-checkbox="{ row, rowIndex, handleClickSelectRow }">
          <td v-if="hasAllPermissions" class="px-4">
            <Checkbox
              v-if="hasSelectable(row)"
              :model-value="selectedMemberIds.has(row.id)"
              @update:model-value="(isChecked) => handleClickSelectRow(isChecked, row, rowIndex)"
              @click.stop
            />
          </td>
        </template>
        <template #data-0="{ row }">
          <div class="flex max-w-[10rem] items-center" data-testid="team-table-name-column">
            <div
              v-if="row.status === 'invited'"
              class="size-6 flex-none rounded-full border border-stone-900/10 bg-black/25"
            />
            <div v-else class="flex flex-none items-center">
              <Avatar :src="row.avatar" class-size="size-6" />
            </div>
            <span class="ml-3 truncate text-stone-800">
              {{ row.name }}
            </span>
          </div>
        </template>
        <template #data-1="{ row }">
          <div :class="statusResult(row).color">
            {{ statusResult(row).text }}
          </div>
        </template>
        <template #data-2="{ row }: { row: MemberDataInterface }">
          {{ RolesTitleMap[row.role] }}
        </template>
        <template #data-3="{ row }">
          <div class="w-80">
            <DesksPopover
              :desks="desks"
              :roles="roles"
              :user="row"
              :current-role="userInfo.role"
              :have-permission="
                (!isInvitedStatus(row.status) && permission.has(`${row.role}DesksUpdate`)) || hasSelfPermissions(row)
              "
              @assign-user-to-desk="assignUserToDesk"
              @revoke-user-from-desk="revokeUserFromDesk"
            />
          </div>
        </template>
        <template #data-4="{ row }">
          <Dropdowns v-if="permission.has(`${row.role}Update`) || hasSelfPermissions(row)" placement="left-start">
            <MenuItem
              v-if="!isInvitedStatus(row.status) && permission.has('suspendUpdate')"
              @click.prevent="clickChangeUserStatus(row)"
            >
              {{ row.suspended ? 'Unsuspend user' : 'Suspend user' }}
            </MenuItem>
            <MenuItem
              v-if="!isInvitedStatus(row.status) && permission.has('usersDelete')"
              @click.prevent="onOpenRemoveUser(row.id)"
            >
              Delete user
            </MenuItem>
            <SubMenu v-if="!isInvitedStatus(row.status)" title="Change role">
              <MenuItem
                v-for="role in rolesList(row.role)"
                :key="role.id"
                @click.prevent="changeUserRole({ input: { id: row.id, role_id: role.id } })"
              >
                {{ role.title }}
              </MenuItem>
            </SubMenu>
            <MenuItem v-if="isInvitedStatus(row.status)" @click.prevent="revokeInvitation(row.id)">
              Revoke invitation
            </MenuItem>
            <MenuItem v-if="isInvitedStatus(row.status)" @click.prevent="resendInvitation(row.id)">
              Resend invitation
            </MenuItem>
          </Dropdowns>
        </template>
      </Table>
    </Section>
  </div>
  <Destructive
    :visible="visible"
    title="Delete user(s): Are you absolutely sure?"
    :confirm-value="`${workspaceStore.currentWorkspace?.name}/Delete-User`"
    button-text="delete user(s)"
    @on-modal-close="onModalClose"
    @on-click-delete="onClickDelete"
  >
    <span> This will permanently delete the user(s) as well as all their articles from our servers forever. </span>
    <br />
    <br />
    <span> If you want to retain the user’s articles but remove access to your publication suspend them instead. </span>
  </Destructive>
</template>
