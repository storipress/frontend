<script lang="ts" setup>
import { useRedirectPortal } from '~/composables'

const ready = useTimeout(100)
const portal = useRedirectPortal()
const { query } = useRoute()
portal(query)
</script>

<template>
  <div v-show="!ready">redirecting...</div>
</template>
