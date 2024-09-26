<script setup lang="ts">
import { defineProps } from 'vue'
import { useConditionRedirect } from '~/hooks/useRedirect'

const props = defineProps<{ clientID: string }>()
useConditionRedirect(() => Boolean(props.clientID), `/${props.clientID}/articles/desks/all`, '/workspaces')
</script>

<template>
  <div />
</template>
