<script lang="ts">
import { defineComponent } from 'vue'
import { useVModel } from '@vueuse/core'
import { mergeTailwind } from '../../plugins/MergeTailwindPlugin'

export default defineComponent({
  name: 'Checkbox',

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    checkboxId: {
      type: String,
      default: '',
    },
  },

  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const checked = useVModel(props, 'modelValue', emit)
    const autoCheckboxId = randstr('checkbox-')
    function randstr(prefix: string) {
      return Math.random()
        .toString(36)
        .replace('0.', prefix || '')
    }

    return {
      checked,
      autoCheckboxId,
      mergeTailwind,
    }
  },
})
</script>

<template>
  <input
    :id="checkboxId || autoCheckboxId"
    v-model="checked"
    :class="
      mergeTailwind([
        'form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-stone-400 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-emerald-700 checked:bg-sky-700 focus:outline-none',
        $attrs.class,
      ])
    "
    type="checkbox"
    value=""
    :disabled="disabled"
  />
</template>

<style lang="scss" scoped>
input[type='checkbox']:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}
</style>
