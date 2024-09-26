<script setup lang="ts">
import type { PropType } from 'vue'
import { useVModel } from '@vueuse/core'
import type { TabDataInterface } from '../definitions'
import { key } from '../definitions'

const props = defineProps({
  modelValue: {
    type: [String, Number],
  },
  tabList: {
    type: Array as PropType<TabDataInterface[]>,
    default: () => [],
    require: true,
  },
})
const emit = defineEmits<(event: 'update:modelValue', value: string | number) => void>()
const activeTab = useVModel(props, 'modelValue', emit)

function onChangeTab(key: string | number) {
  activeTab.value = key
}

const currentTeb = toRef(props, 'modelValue')
provide(key, currentTeb)
</script>

<template>
  <div class="w-full">
    <ul class="relative -mb-px flex overflow-hidden border-b border-gray-300 px-1" aria-label="Tabs" role="tablist">
      <li
        v-for="tab in tabList"
        :key="tab.tabKey"
        class="text-body flex cursor-pointer items-center justify-center whitespace-nowrap after:transition after:duration-300 after:ease-in-out"
        :class="[
          activeTab === tab.tabKey
            ? 'text-black after:absolute after:bottom-0 after:h-1 after:w-24 after:rounded-t after:bg-emerald-700 md:after:w-[6.4rem]'
            : 'text-black/50 transition duration-200 hover:text-black',
        ]"
        @click="onChangeTab(tab.tabKey)"
      >
        <div class="px-2.5 py-4 md:px-5" role="tab">
          {{ tab.name }}
          <span v-if="tab.count > -1" class="text-body ml-1 inline-block rounded-xl bg-gray-200 px-2 py-0.5 text-black">
            {{ tab.count }}
          </span>
        </div>
      </li>
    </ul>

    <div class="tab-content">
      <slot />
    </div>
  </div>
</template>
