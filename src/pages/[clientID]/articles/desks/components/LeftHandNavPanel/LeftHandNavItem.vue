<!-- nav buttons -->
<script lang="ts">
import { defineComponent } from 'vue'
import { HoverHint, Icon, mergeTailwind } from '@storipress/core-component'
import { DragHandle } from '@storipress/vue-slicksort'

export default defineComponent({
  name: 'LeftHandNavItem',
  components: { Icon, DragHandle, HoverHint },
  props: {
    id: {
      type: String,
      default: '',
    },
    text: String,
    iconName: {
      type: String,
      default: '',
    },
    highlight: Boolean,
    isTarget: Boolean,
    isDraggingItemHover: Boolean,
    hasSubdesks: Boolean,
    isSubItem: Boolean,
    canControlDesk: {
      type: Boolean,
      default: false,
    },
    canAccessDesk: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isDropping: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  setup() {
    return { mergeTailwind }
  },
})
</script>

<template>
  <HoverHint :disabled="canAccessDesk" reference-class="w-full">
    <template #default>
      <div v-bind="$attrs" :id="id" class="relative flex">
        <span
          :class="
            mergeTailwind([
              'absolute h-8 w-1 rounded-r-sm transition-all',
              { 'bg-emerald-700': !canControlDesk && isTarget },
              { 'bg-sky-600': isTarget && isDraggingItemHover },
              $attrs.class,
            ])
          "
        ></span>

        <button
          :class="
            mergeTailwind([
              'text-button flex h-8 w-full items-center rounded-r text-stone-600 transition-colors duration-100 focus:outline-none',
              { 'cursor-not-allowed opacity-25': disabled },
              { 'cursor-not-allowed opacity-50': !canAccessDesk },
              { 'hover:bg-stone-800/5': !isDropping && canAccessDesk },
              { 'text-emerald-700': isTarget || highlight },
              { 'bg-stone-800/5': isTarget },
              { 'font-normal opacity-75': isSubItem },
              { 'bg-sky-600/5 text-sky-600': isDraggingItemHover },
            ])
          "
          :disabled="disabled || !canAccessDesk"
          @click="$emit('click', id)"
        >
          <DragHandle
            class="transition delay-200 duration-100 ease-in-out"
            :class="[
              canControlDesk && isSubItem ? 'ml-[1.6rem] mr-2' : '',
              canControlDesk ? 'visible opacity-100' : 'invisible opacity-0',
            ]"
          >
            <Icon class="w-[1.125rem] cursor-grab text-[1.125rem] text-stone-600/75" icon-name="drag-handle" />
          </DragHandle>
          <Icon
            v-if="!canControlDesk || (canControlDesk && iconName)"
            class="w-[1.125rem] text-[1.125rem] transition duration-300 ease-out"
            :class="[{ 'translate-x-1': !canControlDesk }, { 'translate-x-2': canControlDesk && iconName }]"
            :icon-name="iconName"
          />
          <span class="flex-grow truncate text-left" :class="canControlDesk && isSubItem ? 'm-0' : 'ml-4'">
            {{ text }}
          </span>
          <Icon
            v-if="!canControlDesk && hasSubdesks"
            class="ml-auto mr-4 scale-50 transform text-base"
            :icon-name="isTarget || highlight ? 'chevron_down' : 'chevron_up'"
          />
        </button>
      </div>
    </template>
    <template #content>Desk access requires invite</template>
  </HoverHint>
</template>
