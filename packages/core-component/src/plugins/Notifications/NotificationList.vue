<script lang="ts">
import { defineComponent, inject } from 'vue'
import Notifications from './Notifications.vue'
import { NOTIFICATION_INNER_KEY } from './index'

export default defineComponent({
  components: { Notifications },
  setup() {
    const state = inject(NOTIFICATION_INNER_KEY)
    return {
      list: state?.list ?? [],
    }
  },
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="notification"
      aria-live="assertive"
      class="pointer-events-none fixed inset-0 flex flex-col justify-end gap-4 p-4"
    >
      <Notifications v-for="(item, index) of list" :key="index" v-bind="item" />
    </div>
  </Teleport>
</template>
