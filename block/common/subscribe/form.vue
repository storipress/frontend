<script lang="ts">
import { noop } from 'lodash'

export default defineComponent({
  data: () => ({ result: '', message: '', raw: '', clear: noop }),
  methods: {
    submit: noop,
  },
})
</script>

<template>
  <form @submit.prevent>
    <slot :result="result" :message="message" :raw="raw" :clear="clear" />
  </form>
</template>
