<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
import type { RouteLocationRaw } from 'vue-router'
import { cn } from '~/lib/cn'

withDefaults(
  defineProps<{
    id?: string
    text?: string
    iconName?: string
    highlight?: boolean
    isTarget?: boolean
    hasSubdesks?: boolean
    isSubItem?: boolean
    to?: RouteLocationRaw
  }>(),
  {
    text: '',
    iconName: '',
    highlight: false,
    isTarget: false,
    hasSubdesks: false,
    isSubItem: false,
    to: '',
  },
)

defineEmits(['click'])
</script>

<template>
  <div class="relative flex">
    <span :class="cn(['absolute h-8 w-1 rounded-r-sm transition-all', { 'bg-emerald-700': isTarget }, $attrs.class])" />
    <RouterLink v-slot="{ navigate }" custom :to="to">
      <button
        :class="
          cn([
            'text-button flex h-8 w-full items-center rounded-r pl-0.5 text-stone-600 transition-all hover:bg-stone-800/5',
            { 'text-emerald-700': isTarget || highlight },
            { 'bg-stone-800/5': isTarget || highlight },
            { 'font-normal opacity-75': isSubItem },
          ])
        "
        @click="navigate(), $emit('click', id)"
      >
        <Icon class="ml-4 w-[1.125rem] translate-x-1 text-[1.125rem]" :icon-name="iconName" />
        <span class="ml-4 grow truncate text-left">
          {{ text }}
        </span>
        <Icon
          v-if="hasSubdesks"
          class="ml-auto mr-4 scale-50 transform text-[1rem]"
          :icon-name="highlight || isTarget ? 'chevron_down' : 'chevron_up'"
        />
      </button>
    </RouterLink>
  </div>
</template>
