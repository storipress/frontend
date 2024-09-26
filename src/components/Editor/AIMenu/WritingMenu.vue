<script lang="ts" setup>
import { P, match } from 'ts-pattern'
import type { Editor, Range } from '@tiptap/core'
import AIMenuShell from './AIMenuShell.vue'
import { ModifyMenuShell } from './ModifyMenuShell'
import { useScrollableList } from './scrollable-list'
import type { Item } from './write-menu-items'
import { Action, actionItems, items } from './write-menu-items'
import { askAI } from './ask-ai'
import { useAIMenuStore } from './store'
import { WriteMenuPluginKey, menuPlaceholder, promptEnum } from './setting'
import { customInsertContent, transMarkdownContentToHtml } from './utils'
import type { RetryWritingMeta } from './writing-menu-plugin'
import { MenuButton } from '.'
import { OpenTransition } from '~/components/Transitions'

const props = defineProps<{
  editor: Editor
  range: Range
  state: 'idle' | 'loading'
  modify: boolean
  command: (props: any) => void
}>()

const promptList = [
  { title: 'promptBlock', blocks: items },
  { title: 'actionBlock', blocks: actionItems },
]
const aiMenuOptions = ref(null)
const isLoading = ref(false)
const promptFlat = computed(() => promptList.flatMap((group) => group.blocks))
const { selectedIndex, itemRefs, selectedItem, onKeyDown } = useScrollableList({
  items: promptFlat,
  onSubmit: selectItem,
})

const AIStore = useAIMenuStore()

function addItemRefs(ref: HTMLElement | ComponentPublicInstance | null) {
  const el = unrefElement(ref)
  if (!el || !(el instanceof HTMLElement)) return
  itemRefs.value.push(el)
}

async function retry() {
  const { editFrom } = AIStore
  isLoading.value = true
  AIStore.bufferContent = ''
  AIStore.ABORT_CONTROLLER()
  props.editor.commands.deleteRange({ from: editFrom, to: props.editor.state.selection.to })
  props.editor.commands.command(({ tr, dispatch }) => {
    const next = tr.setMeta(WriteMenuPluginKey, {
      type: 'retry',
      from: editFrom,
    } as RetryWritingMeta)
    if (dispatch) dispatch(next)
    return true
  })
  await askAI({
    editor: props.editor,
    range: { from: editFrom, to: props.editor.state.selection.to },
    prompt: AIStore.prompt,
    promptType: AIStore.promptType,
    clearRange: false,
    requestSource: 'next-step',
  })
  isLoading.value = false
}

function selectItem(item: Item) {
  if (props.state === 'loading') return
  const { bufferContent, editFrom } = AIStore

  match(item)
    .with({ type: 'prompt' }, ({ prompt }) => {
      if (prompt === (promptEnum.continueArticle || promptEnum.longer)) {
        props.editor.commands.insertContent(' ')
        AIStore.bufferContent += ' '
      }
      askAI({
        editor: props.editor,
        range: props.range,
        prompt,
        promptType: item.promptType,
        clearRange: false,
        requestSource: 'next-step',
      })
    })
    .with({ action: P.union(Action.Close, Action.Done) }, () => {
      props.editor.commands.deleteRange({ from: editFrom, to: props.editor.state.selection.from })
      try {
        customInsertContent(editFrom, props.editor, transMarkdownContentToHtml(bufferContent))
      } finally {
        AIStore.bufferContent = ''
        props.editor.commands.closeAIMenu()
      }
    })
    .with({ action: Action.Retry }, () => {
      retry()
    })
    .exhaustive()
}

onKeyStroke(['ArrowUp', 'ArrowDown', 'Enter', 'Escape', 'r', 'R'], (e) => {
  if (props.state === 'idle') {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'Enter') {
      e.preventDefault()
      onKeyDown({ event: e })
    }
  } else if (!props.modify) {
    if (e.code === 'Escape') {
      AIStore.ABORT_CONTROLLER()
      AIStore.responseEnd = true
    } else if (e.code === 'KeyR') {
      retry()
    } else {
      onKeyDown({ event: e })
    }
  }
})

onBeforeUpdate(() => {
  itemRefs.value = []
})

onClickOutside(aiMenuOptions, (e) => {
  if (e.target instanceof HTMLElement && e.target.closest('.tippy-content') && e.target.tagName === 'INPUT') return
  AIStore.ABORT_CONTROLLER()

  const { bufferContent, editFrom, editTo } = AIStore
  props.editor.commands.deleteRange({ from: editFrom, to: editTo })
  customInsertContent(editFrom, props.editor, transMarkdownContentToHtml(bufferContent))
  AIStore.bufferContent = ''
  props.editor.commands.closeAIMenu()
})
</script>

<template>
  <ModifyMenuShell v-if="modify" :editor="editor" :range="range" :placeholder="menuPlaceholder" />
  <AIMenuShell
    v-else
    :editor="editor"
    :command="command"
    :has-prompt="state === 'idle' && !isLoading"
    placeholder="Tell Storipress AI what to do next..."
  >
    <template #prompt>
      <div class="text-body flex">
        <span class="text-sky-700">Storipress AI is writing...</span>
        <div
          class="ml-auto cursor-pointer"
          @click="selectItem({ type: 'action', title: 'Retry', action: Action.Retry, icon: 'refresh' })"
        >
          <span class="mr-1.5 text-stone-500">Try again</span>
          <span class="text-subheading text-stone-400">R</span>
        </div>
        <div class="ml-6 cursor-pointer" @click="AIStore.ABORT_CONTROLLER">
          <span class="mr-1.5 text-stone-500">Stop</span>
          <span class="text-subheading text-stone-400">ESC</span>
        </div>
      </div>
    </template>
    <OpenTransition>
      <template v-if="state === 'idle' && !isLoading">
        <div ref="aiMenuOptions" class="layer-2 w-[13rem] rounded border border-gray-100 bg-stone-100">
          <div class="flex max-h-[28rem] flex-col overflow-y-auto">
            <div v-for="(item, blockIndex) in promptList" :key="item.title" class="bg-white">
              <MenuButton
                v-for="block in item.blocks"
                :key="block.title"
                :ref="addItemRefs as any"
                :block-title="block.title"
                :icon="block.icon"
                :now-title="selectedItem.item.title"
                @mouseover="selectedIndex = promptFlat.findIndex((item) => item.title === block.title)"
                @click="selectItem(block)"
              />
              <div v-if="blockIndex <= promptList.length - 2" class="my-1 h-[1px] w-full bg-stone-100" />
            </div>
          </div>
        </div>
      </template>
    </OpenTransition>
  </AIMenuShell>
</template>

<style>
.tippy-box[data-inertia][data-animation='scale'][data-state='hidden'] {
  @apply scale-95 transform opacity-0 ease-in;
  transition-duration: 75ms !important;
}

.tippy-box[data-inertia][data-animation='scale'][data-state='visible'] {
  @apply scale-100 transform opacity-100 ease-out;
  transition-duration: 75ms !important;
}
</style>
