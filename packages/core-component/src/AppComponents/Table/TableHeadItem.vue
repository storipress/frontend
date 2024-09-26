<script setup lang="ts">
defineProps<{
  sortable?: boolean
}>()
</script>

<template>
  <th
    scope="col"
    class="text-button px-4 text-left tracking-wider text-stone-600"
    :class="{ 'cursor-pointer': sortable }"
  >
    <slot />
  </th>
</template>
