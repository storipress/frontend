<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, reactive } from 'vue'
import Icon from '../Icon/index.vue'
import { classname } from './classname'
import type { SnackbarType } from './definition'

export default defineComponent({
  name: 'Snackbar',
  components: {
    Icon,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'tick_circle',
    },
    buttonText: {
      type: String,
      default: '',
    },
    buttonIcon: {
      type: String,
      default: 'arrow_right',
    },
    type: {
      type: String as PropType<SnackbarType>,
      default: '',
      validator: (value: string) => {
        return ['', 'primary', 'info', 'warning'].includes(value)
      },
    },
  },
  emits: ['buttonClick'],
  setup(props) {
    props = reactive(props)
    const backgroundColor = computed(() => {
      return props.type ? classname[props.type].backgroundColor : classname.default.backgroundColor
    })
    const textColor = computed(() => {
      return props.type ? classname[props.type].textColor : classname.default.textColor
    })
    const textHover = computed(() => {
      return props.type ? classname[props.type].textHover : classname.default.textHover
    })
    return {
      classname,
      backgroundColor,
      textColor,
      textHover,
    }
  },
})
</script>

<template>
  <div class="fixed inset-x-0 bottom-0 z-50 flex items-end p-4 pointer-events-none">
    <div class="flex w-full flex-col items-center space-y-4">
      <div class="layer-2 w-fit min-w-[33rem] rounded-lg border border-stone-100 bg-stone-50 overflow-hidden">
        <div class="flex items-center justify-center px-4 py-2.5" :class="backgroundColor">
          <div class="flex-shrink-0">
            <slot name="icon">
              <Icon :icon-name="icon" :class="textColor" />
            </slot>
          </div>
          <div class="ml-3 flex-1 md:flex md:justify-between">
            <p class="text-body" :class="textColor">
              {{ title }}
            </p>
            <button
              v-if="buttonText"
              type="button"
              class="pointer-events-auto text-body mt-3 whitespace-nowrap md:ml-6 md:mt-0"
              :class="[textColor, textHover]"
              @click="$emit('buttonClick')"
            >
              {{ buttonText }}
              <Icon :icon-name="buttonIcon" class="ml-1.5 text-[0.7rem]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
