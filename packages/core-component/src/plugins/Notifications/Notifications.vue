<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, onMounted } from 'vue'
import Icon from '../../AppComponents/Icon/index.vue'
import { classname } from './classname'
import type { NotificationType } from './definition'

export default defineComponent({
  components: {
    Icon,
  },
  props: {
    title: {
      type: String,
      default: 'Successfully saved! ',
    },
    okText: {
      type: String,
      default: '',
    },
    cancelText: {
      type: String,
      default: '',
    },
    type: {
      type: String as PropType<NotificationType>,
      default: '',
      validator: (value: string) => {
        return ['', 'primary', 'info', 'warning'].includes(value)
      },
    },
    iconName: {
      type: String,
      default: 'tick_circle',
    },
    content: {
      type: String,
    },
    timeout: {
      type: Number,
      default: 5000,
    },
    closeNotification: {
      type: Function,
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close', 'ok', 'cancel', 'timeout'],

  setup(props, { emit }) {
    const classes = computed(() => {
      return props.type ? classname[props.type] : classname.default
    })

    function close() {
      props.closeNotification()
    }
    onMounted(() => {
      setTimeout(() => {
        close()
        emit('timeout')
      }, props.timeout)
    })

    return {
      classes,
      buttonClicked(button: 'ok' | 'cancel' | 'close') {
        emit(button)
        close()
      },
    }
  },
})
</script>

<template>
  <transition
    appear
    enter-active-class="transition duration-700 ease-out transform"
    enter-from-class="opacity-0 translate-y-96 translate-x-96 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-x-0 translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition duration-75 ease-in"
    leave-from-class="translate-x-0 translate-y-0 opacity-100 sm:translate-x-0"
    leave-to-class="opacity-0 translate-y-96 translate-x-96 sm:translate-y-0 sm:translate-x-2"
  >
    <div v-if="show" class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <div class="layer-2 pointer-events-auto w-96 overflow-hidden rounded-xl bg-white">
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <slot name="icon">
                <Icon :icon-name="iconName" :class="classes" />
              </slot>
            </div>
            <div class="ml-3 w-0 flex-1">
              <p class="text-headings text-stone-800">
                {{ title }}
              </p>
              <p class="text-body mt-1.5 text-stone-400">
                <slot />
                {{ content }}
              </p>
              <div v-if="okText || cancelText" class="mt-4 flex space-x-7">
                <button
                  v-if="okText"
                  type="button"
                  class="text-button rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                  :class="classes"
                  @click="buttonClicked('ok')"
                >
                  {{ okText }}
                </button>
                <button
                  v-if="cancelText"
                  type="button"
                  class="text-button rounded-md bg-white text-stone-800 hover:text-stone-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
                  @click="buttonClicked('cancel')"
                >
                  {{ cancelText }}
                </button>
              </div>
            </div>
            <div class="ml-4 flex flex-shrink-0">
              <button
                class="inline-flex rounded-md bg-white text-stone-400 hover:text-stone-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
                @click="buttonClicked('close')"
              >
                <span class="sr-only">Close</span>
                <Icon icon-name="cross_thin" class="text-[0.8rem] text-stone-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
