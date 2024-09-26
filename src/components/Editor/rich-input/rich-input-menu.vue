<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3'
import type { Props } from 'tippy.js'
import { hasProtocol, withHttps } from 'ufo'
import type { ComponentInstance } from 'vue'
import { LinkEdit } from './link-edit'
import { formats } from './definitions'
import type { NodeState } from './use-node-state'
import MenuLink from '~/components/Manager/MenuLink'
import type { RichMenuCommands } from '~/components/Editor/core/tiptap/menu/definitions'
import { linkFormat } from '~/components/Editor/core/tiptap/menu/definitions'
import { fadeInOut, preventPopperHide } from '~/components/Editor/core/tiptap/menu/utils'
import MenuButton from '~/components/Editor/core/tiptap/menu/menu-button.vue'

const props = defineProps<{
  editor: Editor
  linkMode: boolean
  nodeState: NodeState
}>()

const emit = defineEmits<{
  'update:linkMode': [linkMode: boolean]
  updateNodeState: []
  setLink: [href: string]
  toggleLink: []
  applyFormat: [name: RichMenuCommands]
}>()

const menuLinkRef = ref<ComponentInstance<typeof MenuLink>>()
const modelLinkMode = useModel(props, 'linkMode')

const tippyOptions: Partial<Props> = {
  duration: 0,
  arrow: false,
  interactive: true,
  plugins: [preventPopperHide, fadeInOut],
  onHide() {
    modelLinkMode.value = false
  },
  onShow: () => emit('updateNodeState'),
}

function formattedLink($event: Event) {
  const value = ($event.target as HTMLInputElement | undefined)?.value ?? ''
  if (!value) {
    return ''
  }

  return !hasProtocol(value) ? withHttps(value) : value
}

watch(
  () => props.linkMode,
  async (val) => {
    if (val) {
      await nextTick()
      menuLinkRef.value?.forceFocus()
    }
  },
)
</script>

<template>
  <BubbleMenu
    class="layer-1 flex h-8 rounded-sm bg-white [.has-dark_&]:dark:bg-stone-800 [.has-dark_&]:dark:text-white"
    :editor="editor"
    :tippy-options="tippyOptions"
  >
    <MenuButton
      click.stop
      :node-state="nodeState"
      :format="linkFormat"
      aria-label="Toggle Link"
      @apply-format="$emit('toggleLink')"
    />
    <div class="h-full w-px bg-black bg-opacity-[15]" />
    <MenuButton
      v-for="format in formats"
      :key="format.name"
      click.stop
      :node-state="nodeState"
      :format="format"
      :aria-label="`Toggle ${format.name}`"
      @apply-format="$emit('applyFormat', format.action)"
    />
    <!-- this div is required to let it place at correct position -->
    <div>
      <MenuLink
        v-if="linkMode"
        ref="menuLinkRef"
        :blur-change="false"
        class="fixed left-0 top-16 z-10"
        @change="$emit('setLink', formattedLink($event))"
        @delete="$emit('setLink', '')"
      />
    </div>
    <LinkEdit :editor="editor" @set-link="$emit('setLink', $event)" />
  </BubbleMenu>
</template>
