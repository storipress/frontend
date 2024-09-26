<script lang="ts">
import { defineComponent } from 'vue'
import { MenuItem as HMenuItem } from '@headlessui/vue'
import { RouterLink } from 'vue-router'
import { Icon, mergeTailwind } from '@storipress/core-component'

export default defineComponent({
  name: 'NavbarMenuLinkItem',
  components: {
    HMenuItem,
    Icon,
    RouterLink,
  },
  props: {
    iconName: String,
    iconClass: String,
    text: {
      type: String,
      required: true,
    },
    textClass: String,
    textContainerClass: String,
    hint: String,
    to: String,
    href: String,
    showIndicator: Boolean,
  },
  emits: ['click'],
  setup(_) {
    return {
      mergeTailwind,
    }
  },
})
</script>

<template>
  <HMenuItem v-slot="{ active }: any">
    <component
      :is="href ? 'a' : 'RouterLink'"
      v-bind="href ? { href } : { to }"
      :class="
        mergeTailwind([
          'inline-flex w-full items-center rounded',
          iconName ? 'px-2 py-[0.625rem]' : 'p-2',
          { 'bg-white/[.15] transition-colors duration-100': active },
          $attrs.class,
        ])
      "
      @click="$emit('click')"
    >
      <Icon v-if="iconName" :class="mergeTailwind(['mr-4 text-base', iconClass])" :icon-name="iconName" />
      <div :class="mergeTailwind(['flex flex-col overflow-hidden', textContainerClass])">
        <span class="flex items-center">
          <span
            :class="
              mergeTailwind([
                'text-body overflow-hidden text-ellipsis whitespace-nowrap leading-normal text-white text-opacity-80',
                textClass,
              ])
            "
          >
            {{ text }}
          </span>
          <span v-if="showIndicator" class="ml-auto flex size-4 items-center justify-center">
            <span class="absolute inline-flex size-3 animate-ping rounded-full bg-emerald-600 opacity-50"></span>
            <span class="relative inline-flex size-[0.625rem] rounded-full bg-emerald-600"></span>
          </span>
        </span>
        <span v-if="hint" class="truncate text-sm leading-normal text-white text-opacity-50">
          {{ hint }}
        </span>
      </div>
    </component>
  </HMenuItem>
</template>
