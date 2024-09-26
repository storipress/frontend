<script lang="ts" setup>
import { useCurrentElement } from '@vueuse/core'
import { HEADLINE_WRAPPER } from './definition'

const root = useCurrentElement()
provide(HEADLINE_WRAPPER, root)
</script>

<template>
  <div ref="root"><slot /></div>
</template>
