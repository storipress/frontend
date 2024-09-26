<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useConditionRedirect } from '~/hooks/useRedirect'

const route = useRoute()
useConditionRedirect(() => /^\/home\/(?:P|S|D)/.test(route.path), route.fullPath.replace(/^\/home/, ''), '/workspaces')
</script>

<template>
  <div />
</template>
