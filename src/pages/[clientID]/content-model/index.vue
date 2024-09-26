<script setup lang="ts">
const props = defineProps<{ clientID: string }>()
const router = useRouter()
router.replace(`/${props.clientID}/content-model/all`)
</script>

<template>
  <div />
</template>
