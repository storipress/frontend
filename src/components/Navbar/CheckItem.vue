<script lang="ts">
import { defineComponent } from 'vue'
import { Checkbox, mergeTailwind } from '@storipress/core-component'
import type { EventClickTextDataInterface } from './definition'

export default defineComponent({
  name: 'NavbarCheckItem',
  components: {
    Checkbox,
  },
  props: {
    checked: Boolean,
    text: {
      type: String,
      required: true,
    },
  },
  emits: ['clickText'],
  setup(props, { emit }) {
    return {
      handleClickText() {
        emit('clickText', {
          text: props.text,
          checked: props.checked,
        } as EventClickTextDataInterface)
      },
      mergeTailwind,
    }
  },
})
</script>

<template>
  <li :class="mergeTailwind(['text-body mb-3 last:mb-0', $attrs.class])">
    <Checkbox
      class="rounded-full border border-solid border-stone-200 bg-gray-100 checked:border-stone-200"
      disabled
      :model-value="checked"
    />
    <span
      class="text-body cursor-pointer text-stone-800 underline decoration-solid transition-colors duration-75 hover:text-stone-400"
      @click="handleClickText"
    >
      {{ text }}
    </span>
  </li>
</template>
