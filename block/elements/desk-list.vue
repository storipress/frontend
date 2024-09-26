<script lang="ts">
import { defineComponent } from 'vue'

import SiteInfo from './site-info.vue'

export default defineComponent({
  components: { SiteInfo },
})
</script>

<template>
  <SiteInfo v-slot="{ desks }">
    <slot :desks="desks" />
  </SiteInfo>
</template>
