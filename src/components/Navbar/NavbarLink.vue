<!--- Manager app buttons (article, schedule, members etc.) --->

<script lang="ts" setup>
import { mergeTailwind } from '@storipress/core-component'
import { RouterLink } from 'vue-router'

defineOptions({
  name: 'NavbarLink',
})

const props = defineProps<{
  to?: string
  href?: string
  highlight?: boolean
}>()

defineEmits(['click'])

const linkProps = computed(() => {
  return props.href
    ? { href: props.href }
    : {
        to: props.to,
      }
})
</script>

<template>
  <component
    :is="href ? 'a' : RouterLink"
    v-bind="linkProps"
    :class="
      mergeTailwind([
        'text-button mr-3 h-full p-5 px-1 text-center font-normal text-black opacity-50 transition-opacity duration-150 hover:opacity-100',
        { 'border-b-[0.15rem] border-solid border-black pb-[1.05rem] pt-5 font-semibold opacity-100': highlight },
        $attrs.class,
      ])
    "
    @click="$emit('click', $event)"
  >
    <slot />
  </component>
</template>
