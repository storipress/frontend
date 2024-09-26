<script setup lang="ts">
import { Icon } from '@storipress/core-component'

const props = defineProps<{ href?: string; icon: string }>()
const rootElement = computed(() => (props.href ? 'a' : 'div'))
const rootProps = computed(() =>
  props.href ? { href: props.href, target: '_blank', rel: 'noopener noreferrer' } : { role: 'button' },
)
</script>

<template>
  <component
    :is="rootElement"
    v-bind="rootProps"
    class="flex cursor-pointer items-center rounded-sm bg-white py-2 pl-4 pr-8 no-underline transition-colors duration-75 hover:bg-gray-100 [.has-dark_&]:dark:bg-stone-800 [.has-dark_&]:dark:hover:bg-stone-700"
  >
    <Icon :icon-name="icon" />
    <span class="ml-3 text-sm font-light text-stone-800 [.has-dark_&]:dark:text-white">
      <slot />
    </span>
  </component>
</template>
