<script setup lang="ts">
import { Buttons, LoadingSpinner, Select } from '@storipress/core-component'
import { useWebflowSite } from '../composables'
import { PullWebflowCollectionsDocument } from '~/graphql-operations'

const emit = defineEmits<(event: 'clickNext') => void>()

const { mutate: mutatePullWebflowCollections, loading: loadingPullWebflowCollections } =
  useMutation(PullWebflowCollectionsDocument)

const { sites, domains, selectedSite, selectedDomain, loading: isLoading, updateInfo, pullSites } = useWebflowSite()

const loading = computed(() => isLoading.value || loadingPullWebflowCollections.value)

async function onNext() {
  await updateInfo()
  if (sites.value.length > 1) {
    await mutatePullWebflowCollections({ refresh: true })
  }
  emit('clickNext')
}
</script>

<template>
  <div class="flex flex-col">
    <LoadingSpinner v-if="loading" show spin-width="w-8" class="absolute left-1/2 top-1/2 z-10" />
    <div class="layer-1 m-5 rounded-lg bg-gray-100/75" :class="{ 'opacity-40': loading }">
      <div class="border-b border-stone-200 p-5">
        <div class="text-subheading mb-4 uppercase">1. Select Site</div>
        <Select
          v-model="selectedSite"
          name="webflowSiteId"
          :items="sites"
          label="Select site"
          placeholder="Select your Webflow site"
          option-label-prop="displayName"
          :disabled="isLoading"
          class="w-full"
        />
        <div class="text-caption mt-1 text-stone-400">
          Haven't seen your site?
          <button class="text-sky-700" @click="pullSites">click here to refresh</button>
        </div>
      </div>

      <div class="border-stone-200 p-5">
        <div class="text-subheading mb-4 uppercase">2. Select Domain</div>
        <Select
          v-model="selectedDomain"
          name="webflowDomainId"
          :items="domains"
          label="Select domain"
          placeholder="Select your Webflow domain"
          :disabled="isLoading || domains.length === 0"
          class="w-full"
        />
      </div>
    </div>

    <hr class="border border-stone-200" />

    <Buttons
      is-shadow
      type="main"
      color="primary"
      :disabled="loading || !selectedDomain"
      class="m-5 self-end"
      @click="onNext"
    >
      Next
    </Buttons>
  </div>
</template>
