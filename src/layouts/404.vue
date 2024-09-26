<script setup lang="ts">
const router = useRouter()
const { t } = useI18n()

// it is hack method, ref:https://stackoverflow.com/a/70965943
function handleBack() {
  const lastPath = router?.options?.history?.state?.back
  return lastPath ? router.back() : router.push('/workspaces')
}
</script>

<template>
  <main class="px-4 py-10 text-center text-teal-700 dark:text-gray-200">
    <router-view />
    <div>
      <button class="btn m-3 mt-8 text-sm" @click="handleBack">
        {{ t('button.back') }}
      </button>
    </div>
  </main>
</template>
