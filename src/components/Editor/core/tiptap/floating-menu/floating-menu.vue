<script lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { ComponentPublicInstance, PropType } from 'vue'
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Instance, Props } from 'tippy.js'
import { unrefElement } from '@vueuse/core'
import tippy from 'tippy.js'
import type { BlockType, EmbedType } from '../../utils'
import { BlockType as BlockTypeEnum, editorBlockSendTrack } from '../../utils'

// import { getBoundary, listenToViewport } from '~/components/Editor/virtual-viewport/tippy-integration'
import type { Format } from './action-list'
import { FloatingMenu } from './floating-menu'
import { useSlashMenuStore } from '~/components/Editor/SlashMenu/utils/store'
import { customBlockItems } from '~/components/Editor/SlashMenu/custom-blocks'
import { CommandsList, Suggestion, slashMenuItems } from '~/components/Editor/SlashMenu'

export default defineComponent({
  components: {
    FloatingMenu,
    CommandsList,
  },

  props: {
    editor: {
      required: true,
      // Editor is just a interface, so we can't use it as type validation
      type: Object as PropType<Editor>,
    },
  },

  setup(props) {
    const button = ref<HTMLElement>()
    const card = ref<ComponentPublicInstance>()
    const mq = window.matchMedia('(max-width: 375px')
    let offset: [number, number] = mq.matches ? [0, 10] : [0, 18]
    const isActive = ref(false)
    const slashStore = useSlashMenuStore()
    const isMobile = useMediaQuery('(max-width: 768px)')
    const customBlocks = customBlockItems()
    const menuItems = computed(() => [...slashMenuItems({ query: '' }), customBlocks.value])

    watch(customBlocks, (val) => slashStore.SET_CUSTOM_BLOCKS(val))
    const tippyOptions: Partial<Props> = {
      offset: () => offset,
      duration: 100,
      arrow: false,
      placement: 'left',
      zIndex: 1,
      moveTransition: 'transform 0.2s ease-out',
      popperOptions: {
        modifiers: [
          {
            name: 'flip',
            enabled: false,
          },
        ],
      },
      onHide() {
        closeMenu()
      },
      onMount(instance) {
        instance.popper.firstElementChild!.classList.add('transition-opacity', 'editor-menu-effect')
      },
    }

    const rightCardTippyOptions: Partial<Props> = {
      placement: 'right-start',
      popperOptions: {
        modifiers: [
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['right', 'right-end'],
            },
          },
        ],
      },
    }

    const bottomCardTippyOptions: Partial<Props> = {
      placement: 'bottom',
      popperOptions: {
        modifiers: [
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['bottom'],
              // boundary,
            },
          },
        ],
      },
    }

    let tp: Instance

    function applyOn(format: Format): boolean {
      const { key } = format
      const blockKey = key as BlockType | EmbedType
      let customBlock = {}
      if (format.key === BlockTypeEnum.custom) {
        const { options } = format as { options: { id?: string; blockName: string } }
        customBlock = { ...(options?.id && { id: options.id }), name: options.blockName }
      }
      editorBlockSendTrack('floating_menu', { key: blockKey, options: { ...customBlock } })

      return props.editor.commands[format.action](format.options as any)
    }

    function toggleMenu() {
      isActive.value = !isActive.value
    }

    function closeMenu(): void {
      isActive.value = false
    }

    function updateOffset() {
      offset = mq.matches ? [0, 10] : [0, 18]
    }

    watch(isActive, (val) => {
      if (val) {
        tp.show()
        document.body.classList.add('no-tooltip')
      } else {
        tp.hide()
        document.body.classList.remove('no-tooltip')
      }
    })

    watch(isMobile, (nowIsMobile) => {
      if (tp) {
        if (nowIsMobile) {
          tp.setProps(bottomCardTippyOptions)
        } else {
          tp.setProps(rightCardTippyOptions)
        }
      }
    })

    onMounted(() => {
      document.body.addEventListener('click', closeMenu, { passive: true })
      mq.addEventListener('change', updateOffset)

      // const boundary = getBoundary()
      // invariant(boundary instanceof HTMLElement, 'boundary is not virtual viewport')

      // some extension will change our tippy style, we should set our default style
      tippy.setDefaultProps({ theme: 'transparent', arrow: false })
      tp = tippy(button.value as HTMLElement, {
        ...(isMobile.value ? bottomCardTippyOptions : rightCardTippyOptions),
        duration: 150,
        arrow: false,
        hideOnClick: 'toggle',

        interactive: true,
        onMount(instance) {
          instance.popper.firstElementChild!.classList.add('transition-opacity', 'editor-menu-effect')
        },
        trigger: 'manual',
        content: unrefElement(card.value) as HTMLElement,
      })

      // listenToViewport(tp)
    })

    onBeforeUnmount(() => {
      document.body.removeEventListener('click', closeMenu)
      mq.removeEventListener('change', updateOffset)
    })

    return {
      button,
      card,

      isActive,
      tippyOptions,
      Suggestion,
      customBlocks,
      menuItems,

      toggleMenu,
      closeMenu,
      applyOn,
      applyCommand(format: Format) {
        applyOn(format)
        isActive.value = false
      },
    }
  },
})
</script>

<template>
  <FloatingMenu
    class="outline-none"
    tabindex="-1"
    :editor="editor"
    :tippy-options="tippyOptions"
    @blur="closeMenu"
    @hide="isActive = false"
  >
    <div class="z-20">
      <button
        ref="button"
        class="flex size-5 items-center justify-center rounded-sm transition-colors hover:bg-black/5 dark:bg-white/5"
        data-floating-menu-trigger=""
        @click.stop="toggleMenu"
      >
        <span class="icon-plus text-sm leading-none text-black/25 dark:text-white/50" />
      </button>
      <CommandsList ref="card" :items="menuItems" :editor="editor" :command="applyCommand" />
    </div>
  </FloatingMenu>
</template>

<style>
.tippy-box {
  @apply outline-none;
  div {
    @apply visible;
  }
}

.tippy-box[data-theme~='transparent'] {
  background-color: transparent;
}
</style>
