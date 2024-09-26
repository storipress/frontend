<script lang="ts" setup>
import { useConfirmDialog } from '@vueuse/core'
import {
  Buttons,
  Checkbox,
  Destructive,
  Dropdowns as Dropdown,
  HoverHint,
  Icon,
  Inputs,
  MenuItem,
  NavbarSave,
  Select as SpSelect,
  Table as SpTable,
  Toggles,
  mergeTailwind,
} from '@storipress/core-component'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { logicNot } from '@vueuse/math'
import { useForm } from 'vee-validate'
import type { DeskSettingDataInterface, MemberDataInterface } from './definition'
import type { UserType } from '~/components/UserSelectTypeahead/definition'
import { UserStatus } from '~/components/UserSelectTypeahead/definition'
import UserSelectTypeahead from '~/components/UserSelectTypeahead'
import SlideOver from '~/components/SlideOver'
import Avatar from '~/components/Navbar/Avatar.vue'
import { useConfirmFunction } from '~/components/ConfirmModalProvider'
import { getAvatarURL } from '~/lib/avatar'
import DesksPopover from '~/components/MemberTable/DesksPopover.vue'
import { useDesks } from '~/composables/desks'
import { RolesTitleMap, useRoles } from '~/composables/roles'
import { useMe } from '~/composables/me'
import { usePublicationPermission } from '~/composables/permission/publication'
import { desksSorter, roleSorter, useSort } from '~/composables/sort'
import type { RoleKeys } from '~/utils/definition'
import { useCheckoutDialog } from '~/hooks/useCheckoutDialog'
import { ChangeUserRoleDocument } from '~/graphql-operations'
import type { ChangeRoleInput, UserStatus as UserStatusType } from '~/graphql-operations'
import { permissionList } from '~/pages/[clientID]/preferences/publication/team/data'
import { createDeskNameSchema } from '~/composables/is-reversed-desk-name'
import { HelpButton, HelpCategories } from '~/components/HelpButton'

defineOptions({
  name: 'EditDeskSettingsSlideOver',
})
const props = withDefaults(
  defineProps<{
    show?: boolean
    loading?: boolean
    workspaceName?: string
    deskSetting: DeskSettingDataInterface
  }>(),
  {
    show: false,
    loading: false,
    workspaceName: '',
    deskSetting: () => ({
      id: '',
      name: '',
      openAccess: false,
      description: '',
      members: [],
    }),
  },
)
const emit = defineEmits(['close', 'submit', 'delete'])
const { canUpdateDesk, canDeleteDesk } = usePublicationPermission()
const canUpdateDeskSetting = canUpdateDesk(computed(() => props.deskSetting))
function copyDeskSetting(setting: DeskSettingDataInterface) {
  return {
    ...setting,
    members: [...setting.members.filter((item) => item.status !== 'suspended')],
  }
}
const draftSetting = ref<DeskSettingDataInterface>({
  id: '',
  name: '',
  description: '',
  openAccess: false,
  members: [],
})
const sortRule = {
  desks: desksSorter,
  role: roleSorter,
}
const members = computed({
  get: () => draftSetting.value.members,
  set: (val) => (draftSetting.value.members = val),
})
const { sortMap, sortby: sortMembers } = useSort(members, { sortRule })
const isChanged = ref(false)
const selectedMemberIds = ref<Set<string>>(new Set())
const transferDesk = ref()
const transferArticles = ref(true)
const invalidDesk = ref(false)
const readyDeleteDeskDialog = ref(false)
const reset = function () {
  draftSetting.value = copyDeskSetting(props.deskSetting)
  isChanged.value = false
  sortMap.value = {}
  transferDesk.value = undefined
  readyDeleteDeskDialog.value = false
}
onMounted(reset)
watch(
  () => [props.show, props.deskSetting],
  () => props.show && reset(),
)

const convertedOpenAccess = computed({
  get: () => {
    return draftSetting.value.openAccess ? 'Yes' : 'No'
  },
  set: (val) => {
    if ((val === 'Yes') !== props.deskSetting.openAccess) isChanged.value = true

    draftSetting.value.openAccess = val === 'Yes'
  },
})

const columnDefs = computed(() => [
  { key: 'name', title: 'Name', sortable: true, width: '17.625rem' },
  { key: 'status', title: 'Status', sortable: true, width: '10.312rem' },
  { key: 'role', title: 'Role', sortable: true, width: '12.062rem' },
  { key: 'desks', title: 'Desks', sortable: true, width: '16.625rem' },
  ...(canUpdateDeskSetting.value ? [{ key: 'extra' }] : []),
])

const inviteUsers = ref<UserType[]>([])

const memberIdSet = computed(() => {
  return new Set(draftSetting.value.members.map(({ id }) => id))
})

const [confirmDeleteUser] = useConfirmFunction([
  {
    type: 'warning',
    title: 'Remove user(s) from desk',
    description:
      'This user will no longer have edit or view permissions to this desk. The articles they have authored are preserved.',
    okText: 'Delete',
  },
])

const {
  isRevealed: isRevealedOfDeleteDeskDialog,
  reveal: revealOfDeleteDeskDialog,
  confirm: confirmOfDeleteDeskDialog,
  cancel: cancelOfDeleteDeskDialog,
} = useConfirmDialog()
const readyLoadClass = ref(false)

whenever(logicNot(isRevealedOfDeleteDeskDialog), () => {
  invalidDesk.value = false
  transferArticles.value = true
})

const { desks } = useDesks()
const { roles } = useRoles()
const me = useMe()

const router = useRouter()

const { mutate: mutateChangeUserRole } = useMutation(ChangeUserRoleDocument)
const { openDialog, checkPaidRole, isFreePlan, refetchBilling, loading: loadingCheckout } = useCheckoutDialog()
async function changeUserRole({ input }: { input: ChangeRoleInput }) {
  await until(loadingCheckout).not.toBeTruthy()
  if (isFreePlan.value && checkPaidRole(input.role_id)) {
    const checkoutDone = await openDialog()
    if (!checkoutDone) return
    await refetchBilling()
  }
  await mutateChangeUserRole({ input })
}

const permission = computed(() => {
  const hasPermissions = permissionList[me.value?.role ?? '']
  return hasPermissions || new Set([])
})

const rolesList = computed(() => (userRole: string) => {
  return roles.value.filter(({ name }) => name !== userRole && permission.value.has(`${name}Update`))
})

const isInvitedStatus = computed(() => (status: UserStatusType) => status === 'invited')

const hasSubdesk = computed(() => Boolean(desks.value.find((desk) => desk.id === props.deskSetting.id)?.desks.length))

function afterEnter() {
  readyLoadClass.value = true
}

const { handleSubmit, errors } = useForm({
  validationSchema: createDeskNameSchema('name'),
})
const submit = handleSubmit(() => {
  emit('submit', copyDeskSetting(draftSetting.value))
})

async function clickDeleteButton() {
  if (await confirmDeleteUser()) {
    draftSetting.value.members = draftSetting.value.members.filter((member) => !selectedMemberIds.value.has(member.id))
    selectedMemberIds.value.clear()
    isChanged.value = true
  }
}

async function clickDeleteItem(row: MemberDataInterface, index: number) {
  if (await confirmDeleteUser()) {
    selectedMemberIds.value.delete(row.id)
    draftSetting.value.members.splice(index, 1)
    isChanged.value = true
  }
}

function clickInvite() {
  if (!inviteUsers.value.length) return
  const newMembers = inviteUsers.value.map(
    (user: UserType): MemberDataInterface => ({
      id: user.id,
      name: user.full_name ?? '',
      avatar: user.avatar ?? getAvatarURL(user.full_name),
      status: (() => {
        if (UserStatus.Active === user.status) return 'Active'
        if (UserStatus.Suspended === user.status) return 'Suspended'
        return ''
      })(),
      role: user.role ?? '',
      desks: user.desks,
      suspended: Boolean(user.suspended),
    }),
  )
  draftSetting.value.members.push(...newMembers)
  inviteUsers.value = []
  isChanged.value = true
}

function onDeleteDesk() {
  if (transferArticles.value && !transferDesk.value) {
    invalidDesk.value = true
    return
  }
  confirmOfDeleteDeskDialog()
}

function onCloseDeleteDeskDialog() {
  cancelOfDeleteDeskDialog()
}

async function deleteDesk() {
  readyDeleteDeskDialog.value = true
  await nextTick()
  const { isCanceled } = await revealOfDeleteDeskDialog()
  if (!isCanceled) emit('delete', transferDesk.value)
  readyDeleteDeskDialog.value = false
}

function showRolesTitle({ role }: { role: RoleKeys }) {
  return RolesTitleMap[role]
}

function clickToInvitePage() {
  router.push(`/${router.currentRoute.value.params.clientID}/preferences/publication/team`)
}
</script>

<template>
  <SlideOver
    class="edit-desk-slide-over"
    :show="show"
    :click-outside-to-close="false"
    :title="`Desk Settings for ${draftSetting.name}`"
    @close="$emit('close')"
    @after-enter="afterEnter"
  >
    <transition
      v-if="canUpdateDeskSetting"
      enter-active-class="transition duration-100 ease-out origin-top"
      enter-from-class="transform scale-y-95 opacity-0"
      enter-to-class="transform scale-y-100 opacity-100"
      leave-active-class="transition duration-75 ease-in origin-top"
      leave-from-class="transform scale-y-100 opacity-100"
      leave-to-class="transform scale-y-95 opacity-0"
    >
      <Teleport to="body">
        <NavbarSave
          class="fixed right-0 top-0 z-[35] w-screen"
          :show="isChanged"
          @on-discard="reset"
          @on-save="!loading && submit()"
        />
      </Teleport>
    </transition>
    <div class="relative flex-shrink flex-grow overflow-auto">
      <SectionContent
        sub-title="Desk settings"
        content="Control permissions by adding team members to this desk. The desk name is used in your live site for section headings and navigation."
        :class="{ 'opacity-50': !canUpdateDeskSetting }"
      >
        <div
          class="layer-1 relative h-fit w-[34rem] rounded-lg bg-white p-5"
          :class="[
            {
              'after:absolute after:left-0 after:top-0 after:size-full after:content-[\'&nbsp;\']':
                !canUpdateDeskSetting,
            },
            { 'transition-end': readyLoadClass },
          ]"
          :data-intercom-target="readyLoadClass ? 'Desk settings' : null"
        >
          <div class="flex items-end">
            <Inputs
              v-model="draftSetting.name"
              class="mr-4 basis-[11rem]"
              label="Desk name"
              html-type="text"
              html-name="name"
              :show-error="Boolean(errors.name)"
              @input="isChanged = true"
            />
            <span class="basis-[9.875rem]">
              <SpSelect
                v-model="convertedOpenAccess"
                label="Open Access"
                :items="['Yes', 'No']"
                :float-options="{ strategy: 'fixed' }"
              >
                <template #suffix>
                  <HelpButton :to="HelpCategories.GettingStarted.Desks">
                    Open Access removes desk permisisons and allows your entire team to join and create articles in this
                    desk.
                  </HelpButton>
                </template>
              </SpSelect>
            </span>
            <HoverHint :disabled="!hasSubdesk" reference-class="ml-auto">
              <Buttons
                :disabled="!canDeleteDesk || hasSubdesk"
                :is-border="true"
                html-type="button"
                data-intercom-target="Delete Desk Button"
                @click="deleteDesk()"
              >
                Delete desk
              </Buttons>
              <template #content>Root desk deletion not allowed when subdesks are present</template>
            </HoverHint>
          </div>
          <div class="mt-4">
            <Inputs
              v-model="draftSetting.description"
              label="Desk description"
              html-type="text"
              html-name="description"
              @change="isChanged = true"
            />
          </div>
          <hr class="mx-[-1.25rem] mb-[1.375rem] mt-4 border-stone-200" />
          <div class="flex items-end">
            <UserSelectTypeahead
              v-model="inviteUsers"
              class="mr-4 flex-grow"
              label="Invite users"
              placeholder="Start typing the name of a user ..."
              :filter-option="
                (item) =>
                  !memberIdSet.has(item.id) &&
                  item.role !== 'owner' &&
                  item.role !== 'admin' &&
                  item.status !== 'suspended'
              "
            />
            <Buttons class="ml-auto" type="main" color="primary" html-type="button" @click="clickInvite">
              Invite
            </Buttons>
          </div>
        </div>
      </SectionContent>
      <Section class="relative mb-[5.375rem] flex-shrink flex-grow" title="Desk team">
        <template v-if="selectedMemberIds.size !== 0" #sectionRight>
          <Buttons color="warning" html-type="button" @click="clickDeleteButton"> Remove from desk </Buttons>
        </template>
        <div class="overflow-scroll py-4">
          <SpTable
            v-if="draftSetting.members.length"
            row-key="id"
            :selectable="canUpdateDeskSetting"
            :columns="columnDefs"
            :data="draftSetting.members"
            :sort-map="sortMap"
            class="min-w-[66rem]"
            @select-all="draftSetting.members.forEach(({ id, role }) => role !== 'admin' && selectedMemberIds.add(id))"
            @deselect-all="selectedMemberIds.clear()"
            @select-row="({ row: { id } }) => selectedMemberIds.add(id)"
            @deselect-row="({ row: { id } }) => selectedMemberIds.delete(id)"
            @sortby="({ column, sortby }) => sortMembers({ column, sortby })"
          >
            <template #row-checkbox="{ row, rowIndex, handleClickSelectRow }">
              <td v-if="canUpdateDeskSetting" class="px-4">
                <Checkbox
                  v-if="row.role !== 'admin'"
                  :model-value="selectedMemberIds.has(row.id)"
                  @update:model-value="(isChecked: boolean) => handleClickSelectRow(isChecked, row, rowIndex)"
                  @click.stop
                />
              </td>
            </template>
            <template #data-0="{ row, column }">
              <div class="flex items-center" :style="{ width: column.width }">
                <Avatar class="mr-3 flex-shrink-0 flex-grow-0" :src="row.avatar" class-size="w-6 h-6" />
                <span
                  :class="mergeTailwind('text-button inline-block overflow-hidden text-ellipsis whitespace-nowrap')"
                >
                  {{ row.name }}
                </span>
              </div>
            </template>
            <template #data-1="{ row, column }">
              <div
                :class="
                  mergeTailwind([
                    'text-body overflow-hidden text-ellipsis whitespace-nowrap',
                    { 'text-black': row.status === 'Active' },
                    { 'text-sky-700': row.status === 'Invited' },
                    { 'text-stone-400': row.status === 'Suspended' },
                  ])
                "
                :style="{ width: column.width }"
              >
                {{ row.status }}
              </div>
            </template>
            <template #data-2="{ row }">
              {{ showRolesTitle(row) }}
            </template>
            <template #data-3="{ row }">
              <div class="w-80">
                <DesksPopover
                  :desks="desks"
                  :roles="roles"
                  :user="row"
                  :current-role="me?.role ?? ''"
                  :have-permission="false"
                />
              </div>
            </template>
            <template v-if="canUpdateDeskSetting" #data-4="{ row, column, rowIndex }">
              <Dropdown
                v-if="row.role !== 'admin'"
                :style="{ width: column.width }"
                placement="bottom-start"
                class-items="divide-y"
              >
                <div v-if="!isInvitedStatus(row.status) && rolesList(row.role).length">
                  <div class="text-subheading mb-0.5 ml-4 mt-2 text-stone-400">Change role</div>
                  <MenuItem
                    v-for="role in rolesList(row.role)"
                    :key="role.id"
                    @click.prevent="changeUserRole({ input: { id: row.id, role_id: role.id } })"
                  >
                    {{ role.title }}
                  </MenuItem>
                </div>
                <MenuItem @click="clickDeleteItem(row, rowIndex)"> Remove from desk </MenuItem>
              </Dropdown>
            </template>
          </SpTable>
          <div
            v-if="!draftSetting.members.length"
            :class="
              mergeTailwind(
                'layer-1 text-medium flex h-40 items-center justify-center rounded-lg border bg-white text-black/25',
              )
            "
          >
            Invite your teammates to this desk
          </div>
        </div>
      </Section>
    </div>
    <template #footer>
      <span :class="mergeTailwind('text-small')"> Earn $20 credit for each new invited Admin </span>
      <Buttons type="main" color="primary" html-type="button" @click="clickToInvitePage">
        Invite people to your team
      </Buttons>
    </template>
    <Destructive
      v-if="readyDeleteDeskDialog"
      :visible="isRevealedOfDeleteDeskDialog"
      title="Delete Desk: Are you sure?"
      button-text="delete desk"
      :confirm-value="`${workspaceName}/${deskSetting.name}`"
      @on-click-delete="onDeleteDesk"
      @on-modal-close="onCloseDeleteDeskDialog"
    >
      <template v-if="transferArticles">
        This will permanently delete this desk. This action is irreversible.
      </template>
      <template v-else> This will permanently delete the desk and its articles. This action is irreversible. </template>
      <div class="text-subheading mt-6 flex items-center justify-between">
        <span>Transfer existing articles to another desk</span>
        <Toggles
          :checked="transferArticles"
          type="simple"
          color="bg-green-600"
          @click="
            () => {
              transferArticles = !transferArticles
              invalidDesk = false
            }
          "
        />
      </div>
      <div v-if="transferArticles" class="mt-1.5">
        <span class="text-body text-stone-800"
          >Choose <strong>a desk or subdesk</strong> to move this desk's articles to when deleted.</span
        >
        <Listbox v-model="transferDesk">
          <div class="relative mt-1 h-[2.375rem]">
            <ListboxButton
              class="text-inputs relative size-full cursor-default rounded-md border bg-white pb-[0.312rem] pl-3 pr-10 pt-1.5 text-left"
              :class="
                invalidDesk && !transferDesk
                  ? 'border-red-700 opacity-50 focus:border-red-700 focus:ring-red-700'
                  : 'border-gray-400 focus:border-sky-300 focus:outline-none focus:ring-1 focus:ring-sky-300'
              "
            >
              <span :class="transferDesk ? 'block truncate' : 'text-black/25'">
                {{ transferDesk ?? 'Select a desk or a subdesk' }}
              </span>
            </ListboxButton>
            <span
              class="absolute inset-y-0 right-1 flex items-center pr-2"
              :class="{ 'pointer-events-none': !transferDesk }"
            >
              <Icon
                :icon-name="transferDesk ? 'cross_thin' : 'selector'"
                :class="
                  transferDesk
                    ? 'cursor-pointer text-xs text-stone-400 transition duration-75 ease-in hover:text-stone-500'
                    : 'text-stone-500'
                "
                @click="transferDesk = undefined"
              />
            </span>
            <span
              v-if="invalidDesk && !transferDesk"
              class="text-caption absolute bottom-[calc(-1.5_*_1em)] left-0 text-red-700"
            >
              Select a desk or a subdesk is required
            </span>
            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="layer-2 text-body absolute z-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 focus:outline-none"
              >
                <template
                  v-for="desk in desks.flatMap((item) =>
                    item.id === deskSetting.id ? [] : [{ ...item, toString: () => item.name }],
                  )"
                >
                  <template v-if="desk.desks.length">
                    <ul :key="desk.id" class="flex justify-between py-2 pl-4 pr-[1.625rem] text-stone-800/50">
                      <span>{{ desk }}</span>
                      <Icon icon-name="chevron_down" class="scale-75 transform text-xs" />
                    </ul>
                    <ListboxOption
                      v-for="subdesk in desk.desks.map((item) => ({ ...item, toString: () => item.name }))"
                      :key="subdesk.id"
                      v-slot="{ active, selected }"
                      :value="subdesk"
                    >
                      <span
                        class="relative block cursor-default select-none truncate py-2 pl-9 pr-[1.625rem] text-stone-800/75"
                        :class="[selected ? 'font-semibold' : 'font-normal', { 'bg-gray-100': active }]"
                      >
                        {{ subdesk }}
                      </span>
                    </ListboxOption>
                  </template>
                  <ListboxOption v-else v-slot="{ active, selected }" :key="desk.id" :value="desk">
                    <span
                      class="relative block cursor-default select-none truncate py-2 pl-4 pr-[1.625rem] text-stone-800/75"
                      :class="[selected ? 'font-semibold' : 'font-normal', { 'bg-gray-100': active }]"
                    >
                      {{ desk }}
                    </span>
                  </ListboxOption>
                </template>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>
    </Destructive>
  </SlideOver>
</template>

<style lang="scss">
.edit-desk-slide-over {
  .slide-over__footer {
    @apply justify-between;
  }
  div[data-popper-placement] {
    @apply z-10;
  }
}
</style>
