<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
import type { IntegrationsData } from '../utils/types'
import type { TWuser } from '~/pages/[clientID]/articles/[id]/edit/types'

defineProps<{
  title: string
  slug: string
  imgUrl: string
  text: string
  user: IntegrationsData | TWuser
  list: IntegrationsData[] | TWuser[]
}>()
</script>

<template>
  <div
    class="layer-2 absolute z-10 my-4 flex w-[23rem] overflow-hidden whitespace-normal break-words rounded-lg bg-white p-4 md:my-0 md:ml-4 md:w-[23rem]"
  >
    <img class="mr-3 mt-0.5 size-10 rounded-full" :src="user?.thumbnail || list[0]?.thumbnail" />
    <div class="flex w-[17.5rem] flex-col space-y-3">
      <div class="w-full space-y-1.5">
        <div class="flex items-center">
          <span class="mr-2 text-sm font-bold text-stone-900">{{ user?.name }}</span>
          <span class="text-sm text-stone-600">@handle · 3m</span>
          <span class="ml-auto"><Icon icon-name="dots_horizontal" /></span>
        </div>
        <div class="whitespace-pre-wrap text-sm text-stone-800">{{ text }}</div>
      </div>
      <div class="w-full rounded-lg border">
        <div class="h-[7.125rem] bg-white">
          <span class="h-[7.125rem]">
            <img v-if="imgUrl" :src="imgUrl" class="size-full rounded-t-lg object-cover" />
          </span>
        </div>
        <div class="space-y-0.5 rounded-sm p-3">
          <div class="line-clamp-1 text-sm text-stone-500">
            {{ slug }}
          </div>
          <p class="text-sm text-stone-800">{{ title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
