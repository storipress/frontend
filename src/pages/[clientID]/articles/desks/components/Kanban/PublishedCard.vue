<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'
import { Dropdowns, HoverHint, Icon, MenuItem, SubMenu } from '@storipress/core-component'
import { MenuButton } from '@headlessui/vue'
import { dayjs } from '~/lib/dayjs'
import { GetSiteDocument } from '~/graphql-operations'
import { usePublicationPermission } from '~/composables/permission/publication'
import type { ListDesksQuery } from '~/graphql-operations'

const props = defineProps<{
  id: string
  title: string
  desk: string
  featured: boolean
  publishedAt: Date
  avatars: {
    name: string
    src: string
  }[]
  disabled: boolean
  desks: ListDesksQuery['desks']
}>()

defineEmits<{
  (event: 'unpublish', data: { id: string }): void
  (event: 'updateFeature', data: { id: string; value: boolean }): void
  (event: 'delete', data: { id: string }): void
  (event: 'duplicate', data: { id: string }): void
  (event: 'click', data: { id: string }): void
  (event: 'changeDesk', data: { deskId: string }): void
}>()
const { result } = useQuery(GetSiteDocument)
const timezone = computed<string | undefined>(() => result.value?.site.timezone)
const publishedAtDayJS = computed<dayjs.Dayjs>(() => dayjs(props.publishedAt).tz(timezone.value))
const { canUnpublishedArticle } = usePublicationPermission()
</script>

<template>
  <div
    :data-testId="`card-${id}`"
    class="group layer-1 w-[33rem] cursor-pointer select-none rounded-sm border-white bg-white p-2.5"
    @click="$emit('click', { id })"
  >
    <div class="flex justify-between">
      <!-- Card Left  -->
      <div class="mr-2 flex w-[70%] flex-col">
        <div class="mb-2 flex items-center">
          <span class="text-body truncate break-words text-stone-800">{{ title }}</span>
          <Icon class="ml-1.5 inline-block scale-75 text-yellow-500" :class="{ hidden: !featured }" icon-name="star" />
        </div>
        <div class="relative flex items-center text-stone-500" :class="{ invisible: timezone === undefined }">
          <HoverHint>
            <div class="flex items-center">
              <Icon class="mr-1.5 w-4 scale-75" icon-name="calendar-done" />
              <span class="tooltip text-caption mr-4 leading-tight text-stone-500">
                {{ publishedAtDayJS.format('DD/MM/YY @ HH:mm A') }}
              </span>
            </div>
            <template #content>
              <span class="text-body text-white">Published at</span>
            </template>
          </HoverHint>
          <Icon class="mr-1.5 w-4 scale-75" icon-name="desk" />
          <span class="text-caption leading-tight text-stone-500">{{ desk }}</span>
        </div>
      </div>
      <!-- Card right  -->

      <div class="flex items-center">
        <span class="relative z-10 mr-[0.875rem] flex items-center -space-x-3">
          <div v-for="(avatar, index) in avatars.slice(0, 3)" :key="avatar.name" class="flex items-center">
            <HoverHint>
              <img
                :src="avatar.src"
                class="tooltip relative size-9 rounded-full border-2 border-white object-cover"
                :style="{ 'z-index': 3 - index }"
              />
              <template #content>
                <span class="text-body text-white">{{ avatar.name }}</span>
              </template>
            </HoverHint>
          </div>
        </span>
        <Dropdowns
          class="menu -mr-1.5 ml-1"
          :class="{ 'pointer-events-none invisible': disabled }"
          @click.stop.prevent=""
        >
          <template #button="{ open }">
            <MenuButton
              aria-label="open-dropdown"
              class="text-body inline-flex w-full justify-start rounded-full bg-white p-1.5 text-stone-800 transition-opacity hover:bg-gray-50 focus:outline-none group-hover:opacity-100 group-hover:duration-75"
              :class="open ? 'opacity-100 ' : 'opacity-0 '"
            >
              <Icon icon-name="dots_horizontal" class="cursor-pointer text-[1.125rem] text-stone-500" />
            </MenuButton>
          </template>
          <MenuItem v-if="canUnpublishedArticle" @click.prevent="$emit('unpublish', { id })">Unpublish</MenuItem>
          <MenuItem @click.prevent="$emit('updateFeature', { id, value: !featured })">{{
            featured ? 'Unfeature' : 'Feature'
          }}</MenuItem>
          <MenuItem @click.prevent="$emit('delete', { id })"> Delete article </MenuItem>
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
  </div>
</template>

<style lang="scss" scoped></style>
