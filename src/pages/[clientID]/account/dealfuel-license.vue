<script setup lang="ts">
import LicensePage from '~/components/LicensePage.vue'
import { DEALFUEL } from '~/composables'
</script>

<template>
  <LicensePage :source="DEALFUEL" />
</template>
