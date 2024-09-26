<script setup lang="ts">
import { planInfo, roleInfo } from './definition'
</script>

<template>
  <div class="flex w-full flex-col items-end space-y-4">
    <ol
      class="layer-2 pointer-events-auto grid w-auto grid-cols-2 gap-x-6 gap-y-4 rounded-md border border-gray-100 bg-white p-4 md:w-[28.5rem]"
    >
      <li v-for="(item, plan) in roleInfo" :key="plan" class="text-base font-bold leading-5 text-black">
        {{ planInfo[plan] }}
        <ul class="mt-2 grid gap-y-4">
          <li v-for="(role, index) in item" :key="index">
            <p class="text-button mb-1 text-stone-800">
              {{ role.name }}
            </p>
            <span class="text-body text-stone-400">{{ role.info }}</span>
          </li>
        </ul>
      </li>
    </ol>
  </div>
</template>

<style scoped></style>
