<script lang="ts" setup>
import {
  Buttons,
  Checkbox,
  Dropdowns as Dropdown,
  Inputs,
  MenuItem,
  Select as SpSelect,
  Table as SpTable,
} from '@storipress/core-component'
import { useForm } from 'vee-validate'
import type { DeskSettingDataInterface, MemberDataInterface } from './definition'
import { cn } from '~/lib/cn'
import type { UserType } from '~/components/UserSelectTypeahead/definition'
import { UserStatus } from '~/components/UserSelectTypeahead/definition'
import UserSelectTypeahead from '~/components/UserSelectTypeahead'
import SlideOver from '~/components/SlideOver'
import Avatar from '~/components/Navbar/Avatar.vue'
import { getAvatarURL } from '~/lib/avatar'
import DesksPopover from '~/components/MemberTable/DesksPopover.vue'
import { useDesks } from '~/composables/desks'
import { RolesTitleMap, useRoles } from '~/composables/roles'
import { useMe } from '~/composables/me'
import { desksSorter, roleSorter, useSort } from '~/composables/sort'
import type { RoleKeys } from '~/utils/definition'
import { createDeskNameSchema } from '~/composables/is-reversed-desk-name'
import { HelpButton, HelpCategories } from '~/components/HelpButton'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
    default: false,
  },
  loading: {
    type: Boolean,
    required: true,
    default: false,
  },
  defaultMembers: {
    type: Array as PropType<MemberDataInterface[]>,
    required: true,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'submit'])

const draftSetting = ref<DeskSettingDataInterface>({
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
const selectedMemberIds = ref<Set<string>>(new Set())
const reset = function () {
  draftSetting.value = {
    name: '',
    description: '',
    openAccess: false,
    members: [...props.defaultMembers.filter((item) => item.status !== 'suspended')],
  }
  sortMap.value = {}
}
watch(
  () => [props.show],
  () => {
    if (props.show) reset()
  },
)

const convertedOpenAccess = computed({
  get: () => {
    return draftSetting.value.openAccess ? 'Yes' : 'No'
  },
  set: (val) => {
    draftSetting.value.openAccess = val === 'Yes'
  },
})

const columnDefs = computed(() => [
  { key: 'name', title: 'Name', sortable: true, width: '17.625rem' },
  { key: 'status', title: 'Status', sortable: true, width: '10.312rem' },
  { key: 'role', title: 'Role', sortable: true, width: '12.062rem' },
  { key: 'desks', title: 'Desks', sortable: true, width: '16.625rem' },
  { key: 'extra' },
])

const inviteUsers = ref<UserType[]>([])

const memberIdSet = computed(() => {
  return new Set(draftSetting.value.members.map(({ id }) => id))
})

const { desks } = useDesks()
const { roles } = useRoles()
const me = useMe()

const { handleSubmit } = useForm({
  validationSchema: createDeskNameSchema('name'),
})
const submit = handleSubmit(() => {
  const name = draftSetting.value.name.trim()
  draftSetting.value.name = name

  emit('submit', draftSetting.value)
})

function clickDeleteButton() {
  draftSetting.value.members = draftSetting.value.members.filter((member) => !selectedMemberIds.value.has(member.id))
  selectedMemberIds.value.clear()
}

function clickDeleteItem(row: MemberDataInterface, index: number) {
  selectedMemberIds.value.delete(row.id)
  draftSetting.value.members.splice(index, 1)
}

function clickInvite() {
  const newMembers = inviteUsers.value.map(
    (user: UserType): MemberDataInterface => ({
      id: user.id,
      name: user.full_name!,
      avatar: user.avatar ?? getAvatarURL(user.full_name),
      status:
        (() => {
          if (UserStatus.Active === user.status) return 'Active'
          if (UserStatus.Suspended === user.status) return 'Suspended'
        })() ?? '',
      role: user.role ?? '',
      desks: user.desks,
    }),
  )
  draftSetting.value.members.push(...newMembers)
  inviteUsers.value = []
}

function showRolesTitle({ role }: { role: RoleKeys }) {
  return RolesTitleMap[role]
}
</script>

<template>
  <SlideOver
    class="add-desk-slide-over"
    :show="show"
    title="Create New Desk"
    :click-outside-to-close="!loading"
    @close="$emit('close')"
    @submit="!loading && submit()"
  >
    <div class="relative flex-shrink flex-grow overflow-auto">
      <SectionContent
        class="mb-12"
        sub-title="Desk settings"
        content="Control permissions by adding team members to this desk. The desk name is used in your live site for section headings and navigation."
      >
        <template #content>
          <div class="flex items-end">
            <Inputs
              v-model="draftSetting.name"
              class="mr-4 basis-[11rem]"
              label="Desk name"
              html-type="text"
              html-name="name"
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
                    Open Access removes desk permissions and allows your entire team to join and create articles in this
                    desk.
                  </HelpButton>
                </template>
              </SpSelect>
            </span>
          </div>
          <div class="mt-4">
            <Inputs
              v-model="draftSetting.description"
              label="Desk description"
              html-type="text"
              html-name="description"
            />
          </div>
          <hr class="-mx-5 mb-[1.375rem] mt-4 border-stone-200" />
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
        </template>
      </SectionContent>
      <Section class="relative mb-[5.375rem] flex-shrink flex-grow" title="Desk team">
        <template v-if="selectedMemberIds.size !== 0" #sectionRight>
          <Buttons color="warning" html-type="button" @click="clickDeleteButton"> Remove from desk </Buttons>
        </template>
        <hr class="border-t border-solid border-stone-200" />
        <div class="overflow-scroll py-4">
          <SpTable
            v-if="draftSetting.members.length"
            row-key="id"
            :columns="columnDefs"
            :data="draftSetting.members"
            :sort-map="sortMap"
            class="min-w-[66rem]"
            selectable
            @select-all="draftSetting.members.forEach(({ id, role }) => role !== 'admin' && selectedMemberIds.add(id))"
            @deselect-all="selectedMemberIds.clear()"
            @select-row="({ row: { id } }) => selectedMemberIds.add(id)"
            @deselect-row="({ row: { id } }) => selectedMemberIds.delete(id)"
            @sortby="({ column, sortby }) => sortMembers({ column, sortby })"
          >
            <template #row-checkbox="{ row, rowIndex, handleClickSelectRow }">
              <td class="px-4">
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
                <span class="text-button inline-block truncate">
                  {{ row.name }}
                </span>
              </div>
            </template>
            <template #data-1="{ row, column }">
              <div
                :class="
                  cn([
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
            <template #data-4="{ row, column, rowIndex }">
              <Dropdown v-if="row.role !== 'admin'" :style="{ width: column.width }" placement="bottom-start">
                <MenuItem @click="clickDeleteItem(row, rowIndex)"> Remove from desk </MenuItem>
              </Dropdown>
            </template>
          </SpTable>
          <div
            v-if="!draftSetting.members.length"
            class="layer-1 text-medium flex h-40 items-center justify-center rounded-lg border bg-white text-black/25"
          >
            Invite your teammates to this desk
          </div>
        </div>
      </Section>
    </div>
    <template #footer>
      <Buttons type="main" color="primary" html-type="submit" :is-loading="loading"> Create new desk </Buttons>
    </template>
  </SlideOver>
</template>

<style lang="scss">
.add-desk-slide-over {
  .slide-over__footer {
    @apply justify-end;
  }
  div[data-popper-placement] {
    @apply z-10;
  }
}
</style>
