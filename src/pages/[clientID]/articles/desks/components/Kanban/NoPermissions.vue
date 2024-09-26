<script setup lang="ts">
import publicationLogo from '@assets/group-2.svg'
</script>

<template>
  <div class="bg-stone-100 p-6">
    <div class="h-full rounded-2xl bg-[#a7a7a7]/5 pt-36">
      <img :src="publicationLogo" alt="Publication Logo" class="mx-auto mb-8" />
      <div class="text-center">
        <p class="text-display-large mb-4 text-stone-800">You do not have permissions to any desks</p>
        <p class="text-display-small text-stone-600">Ask an Admin to invite you to a desk</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
