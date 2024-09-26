<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useWorkspaceStore } from '~/stores/workspace'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const workspaceStore = useWorkspaceStore()

const { redirectTo } = route.query

if (redirectTo !== 'billing') {
  if (authStore.isAuth) {
    workspaceStore.prepareForUsing().then(() => {
      router.replace('/workspaces')
    })
  } else {
    router.replace('/auth/login')
  }
}
</script>
