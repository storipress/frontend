import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { PluginKey } from 'prosemirror-state'

import type { FloatingMenuPluginProps } from './floating-menu-plugin'
import { FloatingMenuPlugin } from './floating-menu-plugin'

const FloatingMenuKey = new PluginKey('floatingMenu')
export interface FloatingMenuInterface {
  tippyOptions: FloatingMenuPluginProps['tippyOptions']
  editor: FloatingMenuPluginProps['editor']
}

export const FloatingMenu = defineComponent({
  name: 'FloatingMenu',

  props: {
    editor: {
      type: Object as PropType<FloatingMenuPluginProps['editor']>,
      required: true,
    },

    tippyOptions: {
      type: Object as PropType<FloatingMenuPluginProps['tippyOptions']>,
      default: () => ({}),
    },
  },

  setup() {
    const isMobile = useMediaQuery('(max-width: 768px)')
    return { isMobile }
  },

  watch: {
    editor: {
      immediate: true,
      handler(editor: FloatingMenuPluginProps['editor']) {
        if (!editor) {
          return
        }

        this.$nextTick(() => {
          editor.registerPlugin(
            FloatingMenuPlugin({
              pluginKey: FloatingMenuKey,
              editor,
              element: this.$el as HTMLElement,
              tippyOptions: { ...this.tippyOptions, placement: this.isMobile ? 'top' : 'left' },
              shouldShow: null,
            }),
          )
        })
      },
    },
  },

  beforeUnmount() {
    this.editor?.unregisterPlugin(FloatingMenuKey)
  },

  render() {
    // debugger
    return h('div', { style: { visibility: 'hidden' } }, this.$slots.default?.())
  },
})
