<script setup lang="ts">
import { Popover, Toggles } from '@storipress/core-component'
import { truncate } from 'lodash'
import type { EditUserDesksInput, MemberDataInterface } from './definition'
import type { GetRolesQuery, ListDesksQuery } from '~/graphql-operations'

const props = defineProps<{
  desks: ListDesksQuery['desks']
  roles: GetRolesQuery['roles']
  user: MemberDataInterface
  currentRole: string
  havePermission: boolean
}>()
const emit = defineEmits<{
  (event: 'revokeUserFromDesk', input: EditUserDesksInput): void
  (event: 'assignUserToDesk', input: EditUserDesksInput): void
}>()

const DEFAULT_HAS_ALL_DESK = new Set(['owner', 'admin'])
const hasPermissions = computed(() => (role: string) => {
  const DESKS_PERMISSIONS_ROLES = ['owner', 'admin', 'editor']
  return DESKS_PERMISSIONS_ROLES.includes(role)
})

const user = computed(() => {
  // only root desk is selectable, sub-desk is not selectable and not displayed
  const filterRootDesks = props.user.desks.filter((desk) => desk.desk === null)
  return { ...props.user, desks: filterRootDesks }
})

function onClickToggle(deskId: string) {
  const { desks, id } = props.user
  const result = []
  result.push(...desks)
  if (!hasPermissions.value(props.currentRole) || props.user.role === 'owner') return
  if (desks.some((desk) => desk.id === deskId)) {
    const index = result.findIndex((desk) => desk.id === deskId)
    result.splice(index, 1)

    emit('revokeUserFromDesk', { result, input: { userId: id, deskId } })
  } else {
    const response = props.desks.find((desk) => desk.id === deskId)!
    result.push({ id: response.id, name: response.name })
    emit('assignUserToDesk', { result, input: { userId: id, deskId } })
  }
}
const toggleValue = computed(() => (deskId: string) => {
  const { desks, role } = props.user
  return desks.some((desk) => desk.id === deskId) || DEFAULT_HAS_ALL_DESK.has(role)
})

const desksResult = computed(() => {
  const { role, desks } = user.value
  const isAllDesks = desks.length === props.desks.length
  if (DEFAULT_HAS_ALL_DESK.has(role) || desks.length === 0 || isAllDesks) {
    if (DEFAULT_HAS_ALL_DESK.has(role) || isAllDesks) return 'All'
    return 'None'
  } else {
    const userDesks = desks.map((desk) => desk.name)
    const result = truncate(userDesks.join(', '), {
      length: 45,
      separator: /, ? +/,
      omission: ', __TRUNCATE__',
    }).split(',')
    const lastItem = result.at(-1)
    if (lastItem === ' __TRUNCATE__') {
      result.splice(-1, 1, `+${userDesks.length - (result.length - 1)} more`)
    }
    return result.join(', ')
  }
})
</script>

<template>
  <Popover placement="bottom-start">
    <div class="rounded p-1.5 transition-colors duration-100 hover:bg-gray-200">
      {{ desksResult }}
    </div>

    <template #content>
      <div class="max-h-[28rem] w-44 overflow-scroll p-3 pb-4">
        <div class="text-subheading mb-1 text-stone-800">desk permissions</div>
        <div v-for="(desk, index) in desks" :key="index" class="mt-3 flex justify-between">
          <span class="text-body max-w-[6.5rem] truncate">
            {{ desk.name }}
          </span>
          <Toggles
            :disabled="!havePermission"
            :checked="toggleValue(desk.id)"
            type="short"
            @on-click="onClickToggle(desk.id)"
          />
        </div>
      </div>
    </template>
  </Popover>
</template>

<style scoped></style>
