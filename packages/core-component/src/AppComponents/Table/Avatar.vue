<script lang="ts">
import { defineComponent } from 'vue'
import { mergeTailwind } from '../../plugins/MergeTailwindPlugin'

export default defineComponent({
  name: 'ForDemoAvatar',
  props: {
    isBorder: {
      type: Boolean,
      default: false,
    },
    classSize: {
      type: String,
      default: 'w-8 h-8',
    },
    src: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      mergeTailwind,
    }
  },
})
</script>

<template>
  <div
    :class="
      mergeTailwind(['inline-block overflow-hidden rounded-full', { 'border-2 border-solid': isBorder }, $attrs.class])
    "
  >
    <img :src="src" :class="classSize" />
  </div>
</template>
