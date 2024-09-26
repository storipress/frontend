<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority'
import type { ClassValue } from 'clsx'
import { sectionContentBlock } from './section-content-block'
import { cn } from '~/lib/cn'

type SectionContentBlockVariants = VariantProps<typeof sectionContentBlock>
interface Props {
  class?: ClassValue
  variant?: SectionContentBlockVariants['variant']
}

const props = defineProps<Props>()
</script>
<template>
  <div :class="cn(sectionContentBlock(props), props.class)">
    <slot />
  </div>
</template>
