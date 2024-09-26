<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'
import { Dropdowns, HoverHint, Icon, MenuItem, SubMenu } from '@storipress/core-component'
import { MenuButton } from '@headlessui/vue'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CardStatus } from './definition'
import { dayjs } from '~/lib/dayjs'
import { GetSiteDocument } from '~/graphql-operations'
import { usePublicationPermission } from '~/composables/permission/publication'
import type { ListDesksQuery } from '~/graphql-operations'

const props = defineProps<{
  id: string
  title: string
  desk: string
  status: CardStatus
  featured: boolean
  editedAt: Date
  publishedAt?: Date
  avatars: {
    name: string
    src: string
  }[]
  disabled: boolean
  desks: ListDesksQuery['desks']
}>()

defineEmits<{
  (event: 'publishNow', data: { id: string }): void
  (event: 'unpublish', data: { id: string }): void
  (event: 'updateFeature', data: { id: string; value: boolean }): void
  (event: 'delete', data: { id: string }): void
  (event: 'duplicate', data: { id: string }): void
  (event: 'click', data: { id: string }): void
  (event: 'changeDesk', data: { deskId: string }): void
}>()

dayjs.extend(relativeTime)

const isEdit = computed<boolean>(() => props.status === CardStatus.Edit)
const { result } = useQuery(GetSiteDocument)
const timezone = computed<string | undefined>(() => result.value?.site.timezone)
const editedAtDayJS = computed<dayjs.Dayjs>(() => {
  return dayjs(props.editedAt).tz(timezone.value)
})
const publishedAtDayJS = computed<dayjs.Dayjs | undefined>(
  () => props.publishedAt && dayjs(props.publishedAt).tz(timezone.value),
)
const isEditedThreeDaysAgo = computed<boolean>(() => dayjs().diff(editedAtDayJS.value, 'day') > 3)

const { canPublishedArticle } = usePublicationPermission()
</script>

<template>
  <div
    :data-testId="`card-${id}`"
    class="group layer-1 relative w-64 cursor-pointer select-none rounded-sm border-white bg-white px-2.5 pb-[0.375rem] pt-2.5"
    @click="$emit('click', { id })"
  >
    <div class="flex">
      <!-- Card Left  -->
      <div class="flex w-[85%] flex-col">
        <div class="mb-2 flex items-start">
          <span
            class="text-body h-10 overflow-hidden text-ellipsis text-stone-800"
            style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical"
          >
            {{ title }}
          </span>
          <span class="ml-1.5 inline-flex h-5 w-3 items-center">
            <Icon class="inline-block scale-75 text-yellow-500" :class="{ hidden: !featured }" icon-name="star" />
          </span>
        </div>
        <div class="grid gap-1 text-stone-500">
          <div class="flex" :class="{ invisible: timezone === undefined }">
            <HoverHint>
              <span v-if="isEdit" class="flex items-center">
                <Icon class="mr-1.5 scale-75" icon-name="clock" />
                <span class="tooltip text-caption leading-tight text-stone-500">
                  {{ isEditedThreeDaysAgo ? editedAtDayJS?.format('DD/MM/YY @ HH:mm A') : editedAtDayJS.fromNow() }}
                </span>
              </span>
              <span v-else class="flex items-center">
                <Icon class="mr-1.5 scale-75" icon-name="schedule" />
                <span class="tooltip text-caption leading-tight text-stone-500">
                  {{ publishedAtDayJS?.format('DD/MM/YY @ HH:mm A') }}
                </span>
              </span>
              <template #content>
                <span v-if="isEdit" class="text-body text-white">Last edited</span>
                <span v-else class="text-body text-white">Scheduled for</span>
              </template>
            </HoverHint>
          </div>
          <div class="flex">
            <Icon class="mr-1.5 scale-75" icon-name="desk" />
            <span class="text-caption leading-tight text-stone-500">{{ desk }}</span>
          </div>
        </div>
      </div>
      <!-- Card right  -->
      <div class="-mr-1.5 -mt-1.5 ml-auto">
        <Dropdowns
          class="menu ml-1"
          :class="{ 'pointer-events-none invisible': disabled }"
          class-items="z-20"
          @click.stop.prevent=""
        >
          <template #button="{ open }">
            <MenuButton
              aria-label="open-dropdown"
              class="text-body inline-flex w-full justify-start rounded-full bg-white p-1.5 text-stone-800 transition-opacity hover:bg-gray-50 focus:outline-none group-hover:opacity-100 group-hover:duration-75"
              :class="open ? 'opacity-100 ' : 'opacity-0 '"
            >
              <Icon icon-name="dots_vertical" class="cursor-pointer text-[1.125rem] text-stone-500" />
            </MenuButton>
          </template>
          <MenuItem v-if="canPublishedArticle" @click.prevent="$emit('publishNow', { id })">Publish now</MenuItem>
          <MenuItem v-if="canPublishedArticle && publishedAt !== undefined" @click.prevent="$emit('unpublish', { id })"
            >Unschedule</MenuItem
          >
          <MenuItem @click.prevent="$emit('updateFeature', { id, value: !featured })">{{
            featured ? 'Unfeature' : 'Feature'
          }}</MenuItem>
          <MenuItem @click.prevent="$emit('delete', { id })">Delete article</MenuItem>
          <MenuItem @click.prevent="$emit('duplicate', { id })">Duplicate</MenuItem>
          <SubMenu title="Move to desk" placement="left">
            <template v-for="item in desks" :key="item.id">
              <SubMenu v-if="item.desks.length" :title="item.name">
                <MenuItem
                  v-for="subDesk in item.desks"
                  :key="subDesk.id"
                  @click="$emit('changeDesk', { deskId: subDesk.id })"
                >
                  {{ subDesk.name }}
                </MenuItem>
              </SubMenu>
              <MenuItem v-else @click="$emit('changeDesk', { deskId: item.id })">{{ item.name }}</MenuItem>
            </template>
          </SubMenu>
        </Dropdowns>
      </div>
    </div>

    <!-- Show avatars on bottom if not published -->
    <div class="absolute bottom-0.5 right-2.5">
      <div class="relative flex -space-x-3">
        <div v-for="(avatar, index) in avatars.slice(0, 3)" :key="avatar.name">
          <HoverHint popup-class="z-20">
            <img
              :src="avatar.src"
              class="tooltip relative size-[2.125rem] rounded-full border-2 border-white object-cover"
              :style="{ 'z-index': 3 - index }"
            />
            <template #content>
              <span class="text-body text-white">{{ avatar.name }}</span>
            </template>
          </HoverHint>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
