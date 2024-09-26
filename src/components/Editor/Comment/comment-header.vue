<!-- comment author + profile picture -->

<script lang="ts" setup>
import { Dropdowns, HoverHint, Icon, MenuItem } from '@storipress/core-component'
import { MenuButton } from '@headlessui/vue'
import type { User } from './definitions'

withDefaults(
  defineProps<{
    profile: User
    displayTime: string
    time?: string
    showResolve?: boolean
    showMore?: boolean
    loading?: boolean
  }>(),
  {
    showResolve: false,
    showMore: false,
    loading: false,
  },
)

defineEmits<{
  (event: 'resolve'): void
  (event: 'edit'): void
  (event: 'remove'): void
}>()
</script>

<template>
  <section class="mb-2.5 ml-4 mr-3 mt-4 flex items-center">
    <!-- profile picture -->
    <img class="mr-2 inline-block size-10 rounded-full" :src="profile.avatar" :alt="profile.name" />

    <article class="grow leading-none dark:text-stone-100">
      <div class="text-heading line-clamp-1 text-stone-800 dark:text-stone-100">
        {{ profile.name }}
      </div>
      <time class="text-caption text-stone-400 dark:text-stone-100" :time="time">{{ displayTime }}</time>
    </article>

    <HoverHint :disabled="!showResolve" placement="top">
      <template #default>
        <button
          class="flex size-7 items-center justify-center rounded transition-colors duration-75 ease-in-out hover:bg-stone-200 dark:hover:bg-stone-700"
          :class="!showResolve && 'invisible'"
          @click="$emit('resolve')"
          @click.stop
        >
          <Icon icon-name="check" class="text-sky-600 dark:text-sky-500" />
        </button>
      </template>
      <template #content>Mark as Resolved</template>
    </HoverHint>

    <Dropdowns :class="!showMore && 'invisible'">
      <template #button>
        <MenuButton
          class="inline-flex size-7 items-center justify-center rounded transition-colors duration-75 ease-in-out hover:bg-stone-200 focus:outline-none dark:hover:bg-stone-700"
          @click.stop
        >
          <Icon v-if="loading" icon-name="refresh" class="animate-spin dark:text-stone-100" />
          <Icon v-else icon-name="dots_vertical" class="dark:text-stone-100" />
        </MenuButton>
      </template>

      <template #default>
        <MenuItem @click.prevent="$emit('edit')">Edit</MenuItem>
        <MenuItem v-if="!showResolve" @click.prevent="$emit('remove')">Delete</MenuItem>
      </template>
    </Dropdowns>
  </section>
</template>
