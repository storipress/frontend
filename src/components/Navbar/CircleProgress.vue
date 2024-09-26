<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'NavbarCircleProgress',
  props: {
    denominator: {
      type: Number,
      default: 100,
    },
    value: {
      type: Number,
      default: 0,
      required: true,
    },
    classBgStrokeColor: {
      type: String,
      default: 'stroke-stone-200',
    },
    classBarStrokeColor: {
      type: String,
      default: 'stroke-sky-600',
    },
  },
  setup(props) {
    return {
      task: computed(() => props.denominator - props.value),
      strokeDashoffset: computed(() => {
        return ((props.denominator - props.value) / props.denominator) * Math.PI * 14 * 2
      }),
    }
  },
})
</script>

<template>
  <div
    class="flex animate-pulse items-center gap-x-2 rounded-lg px-2 py-1 transition-colors duration-200 hover:bg-black/5"
  >
    <svg width="32" height="32" view-box="0 0 16 16">
      <circle
        r="14"
        cx="16"
        cy="16"
        fill="transparent"
        stroke-dasharray="87.96459"
        stroke-dashoffset="0"
        stroke-width="4px"
        :class="classBgStrokeColor"
      ></circle>
      <circle
        id="bar"
        r="14"
        cx="16"
        cy="16"
        fill="transparent"
        stroke-dasharray="87.96459"
        :stroke-dashoffset="strokeDashoffset"
        stroke-width="4px"
        transform="rotate(-90 16 16)"
        class="transition delay-300"
        :class="[classBarStrokeColor]"
      ></circle>
      <text x="50%" y="52%" text-anchor="middle" stroke-width="2px" dy=".3em" class="text-button">{{ task }}</text>
    </svg>
    <div class="flex min-w-[78px] flex-col justify-start">
      <span class="text-body font-semibold text-sky-600">Quick Start</span>
      <span class="text-caption text-left leading-none">{{ task }} still to go</span>
    </div>
  </div>
</template>
