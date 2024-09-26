<!-- comment parent (background) -->

<script lang="ts" setup>
import { OpenTransition } from '../../Transitions'

withDefaults(
  defineProps<{
    id?: string
    alwaysTop?: boolean
    offset?: number
    top?: number
    transition?: boolean
  }>(),
  {
    alwaysTop: false,
    offset: 0,
    top: 0,
  },
)

const root = ref()
</script>

<template>
  <OpenTransition appear>
    <section
      ref="root"
      class="layer-2 mb-4 ml-[3vw] hidden w-[17rem] rounded-md bg-stone-50 outline-none focus-within:z-30 dark:bg-stone-800 lg:block"
      :class="alwaysTop ? 'z-30' : 'z-1'"
      :data-id="id"
      :data-top="top"
      tabindex="-1"
      :style="
        top
          ? {
              top: `calc(${top}px + var(--editor-top, 0px))`,
            }
          : {}
      "
    >
      <slot />
    </section>
  </OpenTransition>
</template>

<style lang="scss" scoped>
// comment width: 266.625px
// $width: 270px;

// .comment-box {
//   right: calc(80px - v-bind(offset) * #{$width});
// }
</style>
