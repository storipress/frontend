<script lang="ts">
import { defineComponent, ref } from 'vue'
import SelectTypeahead from '../SelectTypeahead.vue'

export default defineComponent({
  components: { SelectTypeahead },
  setup() {
    const desks = [
      'World',
      'Business',
      'Opinion',
      'Tech',
      'Science',
      'Health',
      'Sports',
      'Arts',
      'Books',
      'Style',
      'Food',
      'Video',
    ]
    const selected = ref([])
    return { desks, selected }
  },
})
</script>

<template>
  <SelectTypeahead v-model="selected" :items="desks" placeholder="Tags" />
</template>

<style lang="scss" scoped>
:deep .typeahead {
  &-wrap {
    @apply w-56 rounded-none border-0 border-b border-stone-200 bg-white/[.1] p-1.5 text-white outline-none;
    font-size: 0.75rem;
    line-height: 1rem;
    &-padding {
      @apply pb-0.5;
    }
  }
  &-label {
    @apply text-white/75;
  }
  &-tag {
    @apply mr-0.5 bg-white/25 pl-1.5 pr-1 text-white;
  }
}
</style>
