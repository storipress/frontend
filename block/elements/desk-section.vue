<script lang="ts">
import { computed, defineComponent, inject, provide } from 'vue'

import { useElement } from './base-element'

export default defineComponent({
  props: {
    /**
     * this is the desk order display in builder. It must be an unique number for each desk in same block
     */
    order: Number,
  },

  setup(props) {
    const $element = useElement()
    const blockId = inject('blockId', '')
    const desk = computed(() => {
      return $element.value.blockStates?.[blockId]?.desks?.[props?.order || 0] ?? 'latest'
    })

    provide('desk', desk)
    $element.value.addDesk({ id: blockId, order: props.order || 0 })

    const deskInfo = computed(
      () =>
        $element.value.desks.find(({ slug }) => slug === desk.value) || {
          name: desk.value,
          slug: desk.value,
          url: '#',
        },
    )

    return {
      url: computed(() => deskInfo.value.url),
      desk: computed(() => deskInfo.value.name),
    }
  },
})
</script>

<template>
  <div>
    <!--
      @slot desk content
      @binding {string} desk desk name
    -->
    <slot :desk="desk" :url="url" />
  </div>
</template>
