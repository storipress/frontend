<script lang="ts">
import { defineComponent } from 'vue'

import SearchButton from './search-button.vue'

export default defineComponent({
  name: 'Search',
  components: { SearchButton },
})
</script>

<template>
  <div>
    <SearchButton><slot /></SearchButton>
  </div>
</template>
