<script lang="ts">
export default defineComponent({
  props: {
    open: {
      type: Boolean,
    },
    openClass: {
      type: String,
      default: 'block',
    },
  },
})
</script>

<template>
  <Teleport to="body">
    <div class="size-full" :class="open ? openClass : 'hidden'">
      <slot />
    </div>
  </Teleport>
</template>
