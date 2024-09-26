<script lang="ts" setup>
import { Icon, Toggles, mergeTailwind } from '@storipress/core-component'
import { MenuItem as HMenuItem } from '@headlessui/vue'

const props = defineProps({
  iconName: { type: String, default: '' },
  iconClass: { type: String, default: 'text-white/50' },
  text: {
    type: String,
    required: true,
  },
  textClass: { type: String, default: '' },
  href: { type: String, default: undefined },
  switchStatus: { type: Boolean, default: false },
  hasSwitch: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const emits = defineEmits<{
  (event: 'click'): void
  (event: 'toggle'): void
}>()

function handleClick(e: Event) {
  if (props.disabled) {
    e.stopPropagation()
  } else {
    emits('click')
  }
}
</script>

<template>
  <HMenuItem v-slot="{ active }: any">
    <a :href="href" :target="href ? '_blank' : ''">
      <div
        :class="
          mergeTailwind([
            'inline-flex w-full items-center rounded',
            iconName ? 'px-2 py-[0.625rem]' : 'p-2',
            !disabled && 'cursor-pointer',
            active && !disabled && 'bg-white/[.15]',
            $attrs.class,
          ])
        "
        @click="handleClick"
      >
        <Icon v-if="iconName" :class="mergeTailwind(['mr-4 text-base', iconClass])" :icon-name="iconName" />
        <div class="flex flex-1 overflow-hidden">
          <span
            :class="
              mergeTailwind([
                'text-body mr-auto overflow-hidden text-ellipsis whitespace-nowrap leading-normal text-white text-opacity-80',
                textClass,
              ])
            "
          >
            {{ text }}
          </span>
          <Toggles
            v-if="hasSwitch"
            :model-value="switchStatus"
            type="short"
            color="bg-emerald-600"
            @update:model-value="$emit('toggle')"
          />
        </div>
      </div>
    </a>
  </HMenuItem>
</template>
