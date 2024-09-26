<script lang="ts" setup>
import { defineProps } from 'vue'
import { Icon } from '@storipress/core-component'
import type { BaseFormat } from './definitions'

defineProps<{
  format: BaseFormat
}>()
</script>

<template>
  <component :is="format.component" v-if="format.component" />
  <Icon v-else :icon-name="format.icon as string" />
</template>
