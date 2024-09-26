<route lang="yaml">
meta:
  layout: workspaces
</route>

<script setup lang="ts">
import { Buttons } from '@storipress/core-component'
import publicationLogo from '@assets/group-2.svg'

useHead({
  title: 'Create first publication - Storipress',
})
</script>

<template>
  <div class="mx-auto flex w-[24.125rem] flex-col items-center">
    <img :src="publicationLogo" class="mb-[2.625rem] mt-8" />

    <div class="text-display-medium mb-4 text-stone-800">Create your first online publication</div>
    <div class="text-body mb-6 text-center text-stone-500">
      Experiment with different topics and designs until you learn what works
    </div>

    <router-link v-slot="{ navigate }" to="/workspaces/create-publication" custom>
      <Buttons type="main" color="primary" is-shadow @click="navigate">Create publication</Buttons>
    </router-link>
  </div>
</template>

<style scoped></style>
