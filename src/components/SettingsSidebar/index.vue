<script lang="ts">
import { defineComponent } from 'vue'
import { Icon } from '@storipress/core-component'

interface NavigationList {
  name: string
  icon: string
  path: string
}

export default defineComponent({
  components: { Icon },
  props: {
    list: {
      type: Array as () => NavigationList[],
      default: () => [],
    },
  },
})
</script>

<template>
  <div class="z-10 h-min overflow-y-auto border border-black/[.05] bg-stone-100">
    <div class="h-20 border-b border-black/[.05] bg-stone-50 px-5 pt-4">
      <slot />
    </div>
    <div class="flex flex-grow flex-col">
      <nav class="flex-1 space-y-1 bg-white/95" aria-label="Sidebar">
        <router-link
          v-for="item in list"
          :key="item.name"
          :to="{ path: item.path }"
          replace
          class="group text-button relative flex h-11 cursor-pointer items-center px-5 py-2 text-stone-600 hover:bg-gray-50"
        >
          <Icon :icon-name="item.icon" class="mr-3 flex size-6 items-center text-lg" />

          {{ item.name }}
        </router-link>
      </nav>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.router-link-active {
  @apply text-emerald-700 before:absolute before:left-0 before:h-8 before:w-1 before:rounded-r-sm before:bg-emerald-700;
}
</style>
