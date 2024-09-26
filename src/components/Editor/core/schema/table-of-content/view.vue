<script lang="ts" setup>
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { NodeViewProps } from '@tiptap/vue-3'
import { Dropdowns, Icon, MenuItem } from '@storipress/core-component'
import { MenuButton } from '@headlessui/vue'
import { TextSelection } from '@tiptap/pm/state'
import { toRef } from 'vue'
import { useUpdateTableOfContent } from './update-table-of-content'
import { useEditorStore } from '~/stores/editor'

const props = defineProps<NodeViewProps>()
const editorStore = useEditorStore()
const showDropdown = ref(false)

function onItemClick(e: MouseEvent, id: string) {
  const { editor } = props
  e.preventDefault()

  if (editor) {
    const element = editor.view.dom.querySelector(`[data-toc-id="${id}"`)
    if (!element) return
    const pos = editor.view.posAtDOM(element, 0)

    // set focus
    const tr = editor.view.state.tr

    tr.setSelection(new TextSelection(tr.doc.resolve(pos)))

    editor.view.dispatch(tr)

    editor.view.focus()

    if (history.pushState) {
      history.pushState(null, '', `#${id}`)
    }

    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 36,
      behavior: 'smooth',
    })
  }
}
const id = computed(() => props.node?.attrs.id)

useUpdateTableOfContent({
  items: toRef(editorStore, 'tocItems'),
  updateItems: (tocItems) => {
    props.updateAttributes({
      tocItems,
    })
  },
})
</script>

<template>
  <NodeViewWrapper :id="id" class="interactive-node ml-2" data-format="tableOfContent" :data-sapling-ignore="true">
    <div class="size-full" @mouseleave="showDropdown = false">
      <div class="absolute right-0">
        <Dropdowns v-if="showDropdown" is-vertical class="z-[2] h-fit cursor-pointer">
          <template #button>
            <MenuButton
              class="inline-flex size-7 items-center justify-center rounded-sm transition-colors duration-75 ease-in-out hover:bg-gray-100 focus:outline-none"
              @click.stop
            >
              <Icon icon-name="dots_horizontal" />
            </MenuButton>
          </template>
          <template #default>
            <MenuItem class="text-caption" @click="deleteNode">Delete</MenuItem>
          </template>
        </Dropdowns>
      </div>
      <div
        v-if="editorStore.tocItems.length === 0"
        class="text-body text-stone-500/50"
        @mouseover="showDropdown = true"
      >
        Add headings to create a table of contents.
      </div>
      <div v-else @mouseover="showDropdown = true">
        <div v-for="item in editorStore.tocItems" :key="item.textContent" :style="`--level: ${item.level};`">
          <a
            class="toc-item block cursor-pointer rounded text-stone-500 hover:bg-gray-100"
            @click="(e) => onItemClick(e, item.id)"
          >
            {{ item.textContent }}
          </a>
        </div>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<style lang="scss" scoped>
.toc-item {
  padding-left: calc(1rem * (var(--level) - 1));
}
</style>
