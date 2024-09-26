<script setup lang="ts">
import { useRolePermissions } from '~/hooks/useRedirect'
import { useAccountPermission } from '~/composables/permission/account'

const route = useRoute()

const { ready, canUseBilling } = useAccountPermission()
useRolePermissions(canUseBilling, route.fullPath.replace(/[/]billing.*$/, '/profile'), ready)
</script>

<template>
  <router-view />
</template>

<style scoped></style>
