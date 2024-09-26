<script setup lang="ts">
import spLogo from '@storipress/core-component/assets/images/icons/settings/sp-logo-white.svg'
import { Buttons as SpButton } from '@storipress/core-component'
import wordpressLogo from '@assets/icons-wordpress.svg'
import { useUploadOtherCMS } from '~/composables'

const props = defineProps<{ clientID: string }>()

const router = useRouter()
const hasClickWpPlugin = ref(false)

const { isLoading, uploadInputRef, uploadOtherCMS, onDone } = useUploadOtherCMS()

onDone(() => router.replace({ path: `/${props.clientID}/articles/desks/all` }))
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-stone-50">
    <router-link :to="`/${clientID}/`" class="absolute left-[3.5rem] top-[5.5rem]">
      <img :src="spLogo" alt="Storipress logo" class="h-8" />
    </router-link>
    <div class="w-[32.938rem]">
      <p class="text-display-small mb-4 text-stone-800">Step 1: Install our WordPress migration plugin</p>
      <div role="button" @click="hasClickWpPlugin = true">
        <a
          href="https://wordpress.org/plugins/storipress/"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center rounded-lg bg-white px-4 py-5 shadow-1-layer"
        >
          <img :src="wordpressLogo" alt="Chrome Icon" class="mr-4 block size-8" />
          <p class="text-xl text-stone-600">Go to the our WordPress plugin page</p>
        </a>
      </div>
      <p class="text-display-small mb-4 mt-16 text-stone-800" :class="{ 'opacity-50': !hasClickWpPlugin }">
        Step 2: Follow the plugin instructions and upload the file downloaded from the plugin to Storipress
      </p>
      <input ref="uploadInputRef" type="file" accept=".ndjson" class="hidden" @change="uploadOtherCMS" />
      <SpButton
        is-shadow
        color="primary"
        html-type="button"
        class="w-20"
        :disabled="!hasClickWpPlugin"
        :is-loading="isLoading"
        @click="uploadInputRef?.click()"
      >
        Import
      </SpButton>
    </div>
  </div>
</template>
