<script setup lang="ts">
import spLogo from '@storipress/core-component/assets/images/icons/settings/sp-logo-white.svg'

defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  cardWidth: {
    type: String,
    default: 'w-screen md:w-[33rem]',
  },
  marginTop: {
    type: String,
    default: 'mt-8 ',
  },
  marginButton: {
    type: String,
    default: 'mb-14 ',
  },
})

const supportList = [
  { name: 'Help', link: 'https://help.storipress.com' },
  { name: 'Privacy', link: 'https://storipress.com/legal/global-privacy-policy' },
  { name: 'Terms', link: 'https://storipress.com/legal/terms' },
]
</script>

<template>
  <main :class="cardWidth" class="rounded-lg bg-white pb-10 pl-8 pr-10 pt-16 shadow-3-layer">
    <div class="relative mb-14 flex justify-between">
      <img :src="spLogo" class="w-[8.75rem]" />
      <slot name="logo" />
    </div>

    <h1 class="text-display-medium mb-1.5 text-stone-800">
      {{ title }}
    </h1>
    <slot name="description">
      <span class="text-body text-stone-500">
        {{ description }}
      </span>
    </slot>

    <div :class="[marginTop, marginButton]">
      <slot />
    </div>

    <div class="flex justify-end">
      <template v-for="item in supportList" :key="item.name">
        <div role="button" class="text-body ml-4 text-stone-500">
          <a :href="item.link" target="_blank" rel="noopener noreferrer">{{ item.name }}</a>
        </div>
      </template>
    </div>
  </main>
</template>

<style scoped></style>
