<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu, getMarkRange, getMarkType, isMarkActive } from '@tiptap/vue-3'
import { isNodeSelection } from 'prosemirror-utils'
import type { Props } from 'tippy.js'
import invariant from 'tiny-invariant'
import * as Sentry from '@sentry/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useEventListener } from '@vueuse/core'
import { editorBlockSendTrack } from '../../utils'
import MenuCard from './menu-card.vue'
import { isMenuType, preventPopperHide } from './utils'
import type { ActionFormat, ActionableFormat } from './definitions'
import {
  LINK_MODIFIER,
  MODIFIER,
  NODE_STATE_KEYS,
  STATE_DIALOG,
  blockFormats,
  linkFormat,
  nodeIsActives,
} from './definitions'

const props = defineProps<{
  editor: Editor
}>()

const state = ref<string | null>(null)
const activeBlock = ref('text')
const isActive = ref(false)
const isEmptySelection = ref(false)
const nodeState = ref<Record<string, boolean>>({
  bold: false,
  italic: false,
  underline: false,
  link: false,
  comment: false,
})

const tippyOptions: Partial<Props> = {
  duration: 0,
  arrow: false,
  interactive: true,
  plugins: [preventPopperHide],
  // check status before menu show
  onShow: handleSelectionUpdate,
  onShown: handleShow,
  onHide: handleHide,
  onMount(instance) {
    instance.popper.firstElementChild!.classList.add('transition-opacity', 'editor-menu-effect')
  },
}

const dialog = computed(() => (state.value ? STATE_DIALOG[state.value] : null))

useEventListener('keydown', (event) => {
  if (!isActive.value) {
    return
  }
  if (MODIFIER.some((modifier) => LINK_MODIFIER[modifier] !== event[modifier]) || event.key !== 'k') {
    return
  }
  event.preventDefault()
  applyFormat(linkFormat)
})

onMounted(() => {
  props.editor.on('selectionUpdate', handleSelectionUpdate)
  props.editor.on('update', handleSelectionUpdate)
})

onBeforeUnmount(() => {
  props.editor.off('selectionUpdate', handleSelectionUpdate)
  props.editor.off('update', handleSelectionUpdate)
})

function isFormatActive(maybeFormat: ActionFormat | string): boolean {
  let key
  let options: Record<string, unknown> | undefined = {}
  if (typeof maybeFormat === 'string') {
    key = maybeFormat
  } else {
    key = maybeFormat.formatName || maybeFormat.key
    options = maybeFormat.options
  }
  return nodeIsActives[key]?.(props.editor) ?? props.editor.isActive(key, options) ?? false
}

async function applyFormat(format: ActionableFormat) {
  if (format.type === 'state') {
    // first set as null to fix value doesn't update bug
    state.value = null
    await nextTick()
    state.value = format.state
    return
  }
  editorBlockSendTrack('bubble_menu', { key: format.key, options: { action: format.action } })

  const { state: editorState } = props.editor
  const isEmptySelection = editorState.selection.empty
  // Don't switch state if we are editing a link
  if (!isEmptySelection) {
    state.value = null
  }

  const commands = props.editor.chain()
  // HACK: expand selection if selection is empty for editing link
  if (isEmptySelection) {
    invariant(format.key === 'link', 'format.key must be link')
    invariant(format.actionType !== 'block', "it's not possible to do block action with empty selection")
    // TODO: `getMarkType` may throw error, we should handle it
    const range = getMarkRange(editorState.selection.$head, getMarkType(format.key, editorState.schema))
    if (range) {
      commands.setTextSelection(range)
    }
  }

  // https://storipress-media.atlassian.net/jira/software/projects/SPMVP/boards/1?selectedIssue=SPMVP-3866
  // If change block to text will have bug, only clear nodes to resolve this problem

  if (format.actionType === 'block' && format.formatName === 'paragraph') {
    commands.clearNodes().focus().run()
    return
  }

  // we are change block type, it should always have selection
  if (format.actionType === 'block') {
    commands.clearNodes()
  }

  const { action, options } = format

  if (!isMenuType(action)) {
    Sentry.captureException(new Error('Menu applied format is not defined'), (scope) => {
      scope.setContext('format', { format })
      return scope
    })
  }
  commands[action](options as never)
    .focus()
    .run()
}

function handleShow() {
  document.body.classList.add('no-tooltip')
  isActive.value = true
}

function handleHide() {
  state.value = null
  document.body.classList.remove('no-tooltip')
  isActive.value = false
}

function collectTextState() {
  const text: Record<string, boolean> = {}
  for (const key of NODE_STATE_KEYS) {
    text[key] = isFormatActive(key)
  }

  nodeState.value = {
    ...nodeState.value,
    ...text,
  }
}

function handleSelectionUpdate() {
  const { state } = props.editor
  const { selection } = state

  if (isNodeSelection(selection)) {
    return
  }

  collectTextState()
  for (const format of Object.values(blockFormats)) {
    // because text is always match and it's first one, so here can make sure only select the correct block
    if (isFormatActive(format)) {
      activeBlock.value = format.key
    }
  }

  if (selection.empty) {
    isEmptySelection.value = true

    // If selection is empty and cursor is on link, we should show link dialog
    if (isMarkActive(state, 'link')) {
      applyFormat(linkFormat)
    }
  } else {
    isEmptySelection.value = false
  }
}
</script>

<template>
  <BubbleMenu :editor="editor" :tippy-options="tippyOptions">
    <MenuCard
      :editor="editor"
      :active-block="activeBlock"
      :node-state="nodeState"
      :is-empty-selection="isEmptySelection"
      :dialog="dialog"
      @apply-format="applyFormat"
    />
  </BubbleMenu>
</template>
