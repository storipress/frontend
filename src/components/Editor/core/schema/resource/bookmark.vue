<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    meta: {
      type: Object,
      required: true,
    },
  },
})
</script>

<template>
  <div class="relative w-full">
    <div v-if="meta.thumbnail" class="bg-white" v-html="meta.html" />
    <div v-else class="bookmark">
      <div class="bookmark__info">
        <div class="bookmark__headline">{{ meta.title }}</div>
        <div v-if="meta.description" class="bookmark__description">
          <div class="bookmark__content">{{ meta.description }}</div>
        </div>
        <div class="bookmark__meta">
          <img
            v-if="meta.icon"
            class="bookmark__icon"
            :src="meta.icon"
            alt="icon"
            onerror="this.style.display = 'none'"
          />
          <template v-if="meta.author">
            <span class="bookmark__author">{{ meta.author }}</span>
            <span class="bookmark__dot">•</span>
          </template>
          <span>{{ meta.publisher }}</span>
        </div>
      </div>
    </div>
    <div class="absolute inset-0 size-full" />
  </div>
</template>
