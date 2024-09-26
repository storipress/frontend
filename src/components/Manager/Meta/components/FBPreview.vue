<script lang="ts" setup>
import type { IntegrationsData } from '../utils/types'
import type { LinkedInAuthors } from '~/graphql-operations'
import type { FBuser } from '~/pages/[clientID]/articles/[id]/edit/types'

defineProps<{
  title: string
  slug: string
  imgUrl: string
  text: string
  description: string
  user: IntegrationsData | LinkedInAuthors | FBuser
  list: IntegrationsData[] | LinkedInAuthors[] | FBuser[]
}>()
</script>

<template>
  <div
    class="layer-2 absolute z-10 my-4 w-[23rem] overflow-hidden whitespace-normal break-words rounded-lg bg-stone-200 md:my-0 md:ml-4"
  >
    <div class="bg-white px-2.5 pb-2 pt-3.5">
      <div class="mb-3 flex items-center">
        <img class="mr-2 w-10 rounded-full" :src="user?.thumbnail || list[0]?.thumbnail || ''" />
        <div>
          <div class="text-sm font-bold text-stone-600">{{ user?.name }}</div>
          <div class="text-xs text-stone-600">October 28, 2021 at 7:29 PM</div>
        </div>
      </div>
      <div class="whitespace-pre-wrap text-sm text-stone-600">{{ text }}</div>
    </div>
    <div class="h-48 rounded-sm bg-white">
      <span class="absolute h-48 w-full">
        <img v-if="imgUrl" :src="imgUrl" class="size-full object-cover" />
      </span>
    </div>
    <div class="space-y-0.5 rounded-sm p-3">
      <div class="line-clamp-1 text-xs text-stone-600">
        {{ slug }}
      </div>
      <p class="text-sm font-bold text-stone-800">{{ title }}</p>
      <p class="line-clamp-2 text-xs text-stone-500">{{ description }}</p>
    </div>
  </div>
</template>
