<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
onMounted(() => {
  const token = route.query.token
  if (token && !Array.isArray(token)) {
    authStore.token = token
  }
  router.replace('/workspaces')
})
</script>

<template>
  <div>redirect...</div>
</template>
