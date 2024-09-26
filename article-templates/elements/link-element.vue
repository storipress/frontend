<script lang="ts" setup>
defineProps({
  href: {
    type: String,
  },
})
</script>

<template>
  <a @click.prevent><slot /></a>
</template>
