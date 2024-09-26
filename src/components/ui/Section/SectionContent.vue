<script lang="ts" setup>
import SectionContentBlock from './SectionContentBlock.vue'

defineProps({
  subTitle: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div>
    <div class="flex justify-between py-4">
      <!-- section title wrapper -->
      <div class="w-[17rem] pt-4">
        <!-- title -->
        <div class="text-heading pb-4 pr-2 text-stone-800">
          <slot name="title">
            {{ subTitle }}
          </slot>
        </div>
        <!-- descriptipn -->
        <div class="text-body text-stone-500">
          <slot name="description">
            {{ content }}
          </slot>
        </div>
      </div>
      <!-- right hand form -->
      <slot>
        <SectionContentBlock variant="thin">
          <slot name="content" />
        </SectionContentBlock>
      </slot>
    </div>
  </div>
</template>
