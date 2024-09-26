<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
import { OpenTransition } from '~/components/Transitions'

const reference = ref()

const isHovered = useElementHover(reference)
</script>

<template>
  <div ref="reference" class="relative">
    <Icon class="text-yellow-500" icon-name="warning" />
    <OpenTransition>
      <div
        v-if="isHovered"
        class="layer-2 text-body absolute left-0 top-8 z-50 w-60 rounded-lg bg-white p-2 text-stone-500"
      >
        <span class="font-bold">A Karbon module is not connected to this block.</span>
        Editor preview is unavailable and content here may not appear on your site. Contact your developer for
        assistance.
      </div>
    </OpenTransition>
  </div>
</template>
