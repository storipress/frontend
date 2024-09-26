<script lang="ts" setup>
import spLogo from '@storipress/core-component/assets/images/icons/settings/sp-logo-white.svg'
</script>

<template>
  <div class="flex h-screen bg-stone-50">
    <div class="min-w-full overflow-y-scroll py-12 md:min-w-fit md:basis-[39%] md:px-14 md:py-[5.5rem]">
      <main class="mx-auto w-auto md:w-[28.5rem]">
        <img :src="spLogo" class="mb-12 px-4 md:mx-0 md:mb-24" />
        <router-view />
      </main>
    </div>

    <div
      class="hidden size-full basis-[61%] items-center justify-center border-0 bg-[url('@assets/landing-abstract.svg')] bg-cover bg-center bg-no-repeat md:flex"
    />
  </div>
</template>
