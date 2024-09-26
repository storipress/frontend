<script setup lang="ts">
import { captureException } from '@sentry/vue'
// This page is unused based on data in Metabase, add redirect just for ensuring
const router = useRouter()
router.replace('/auth/completion/checkout')

captureException(new Error('access /auth/checkout'))
</script>

<template>
  <div />
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
