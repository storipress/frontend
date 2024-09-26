<!--- heading section of a form without right hand form (Custom Domain, tables, etc.) --->
<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: '',
  },
)
</script>

<template>
  <div>
    <div class="flex items-center justify-between border-b border-stone-200">
      <div class="text-pageheading mb-4 pt-1.5 text-stone-800">
        {{ title }}
      </div>
      <div class="flex items-center">
        <slot name="sectionRight" />
      </div>
    </div>
    <slot />
  </div>
</template>
