<script lang="ts" setup>
import { unrefElement } from '@vueuse/core'
import type { Editor } from '@tiptap/core'
import type { ComponentPublicInstance } from 'vue'
import { useFuse } from '@vueuse/integrations/useFuse'
import { promptEnum } from './setting'
import type { BlockItem } from './setting'
import { createMenu } from './write-menu-items'
import AIMenuShell from './AIMenuShell.vue'
import { useScrollableList } from './scrollable-list'
import { useAIMenuStore } from './store'
import { checkScrollY, focusOrSubmit } from './utils'
import { MenuButton } from '.'
import OpenTransition from '~/components/Transitions/open-transition.vue'

const props = defineProps<{
  command: (props: any) => void
  editor: Editor
}>()

const userPrompt = ref('')
// https://github.com/storipress/cf-workers/blob/main/gpt-assistant-v2/src/app.ts
const promptType = ref('')
const AIStore = useAIMenuStore()
const options = {
  fuseOptions: {
    keys: ['title'],
    threshold: 0.1,
  },
  matchAllWhenSearchEmpty: true,
}
const menuItems = computed(() => {
  const { results } = useFuse(userPrompt.value.toLowerCase(), createMenu, options)
  return [
    {
      title: 'Create',
      blocks: results.value.map((item) => item.item),
    },
  ]
})
const searchResult = computed(() => {
  return menuItems.value.reduce((acc, item) => acc + item.blocks.length, 0)
})

const filterNotFoundBlocks = computed(() => {
  return menuItems.value.filter((item) => item.blocks.length > 0)
})

const itemsFlat = computed(() => menuItems.value.flatMap((group) => group.blocks))

const input = ref<{ focus: () => void }>()
const aiMenuOptions = ref<HTMLElement>()
const { itemRefs, onKeyDown, selectedItem, selectedIndex } = useScrollableList({
  items: itemsFlat,
  onSubmit: selectItem,
})

onMounted(async () => {
  const initScrollY = window.scrollY
  input.value?.focus()
  if (initScrollY > 0) {
    checkScrollY()
  }
  await nextTick()
  if (initScrollY > 0) {
    checkScrollY()
  }
  itemRefs.value[itemRefs.value.length - 1]?.scrollIntoView({ block: 'nearest' })
})

onBeforeUpdate(() => {
  itemRefs.value = []
})

function addItemRefs(ref: HTMLElement | ComponentPublicInstance | null) {
  const el = unrefElement(ref)
  if (!el || !(el instanceof HTMLElement)) return
  itemRefs.value.push(el)
}

function selectItem(block: BlockItem) {
  AIStore.isRangedContent =
    !block || (block.prompt !== promptEnum.continueArticle && block.prompt !== promptEnum.longer)

  if (!block) {
    AIStore.prompt = userPrompt.value
    AIStore.promptType = promptType.value

    props.command({
      prompt: userPrompt.value,
      promptType: promptType.value,
    })
    return
  }

  if (block.shouldAskUser) {
    promptType.value = block.promptType
    userPrompt.value = `${block.prompt} `
    input.value?.focus()
    return
  }

  if (userPrompt.value) {
    AIStore.prompt = userPrompt.value
    props.command({
      ...block,
      prompt: userPrompt.value,
    })
    return
  }

  AIStore.prompt = block.prompt
  AIStore.promptType = block.promptType

  props.command(block)
}

function focusCurrent() {
  props.editor.commands.focus()
  props.editor.commands.setTextSelection({
    from: props.editor.state.selection.from - 1,
    to: props.editor.state.selection.to,
  })
  props.editor.commands.deleteSelection()
}

focusOrSubmit(focusCurrent, onKeyDown, userPrompt)

watch(menuItems, () => {
  selectedIndex.value = 0
})

watch(userPrompt, (nowPrompt) => {
  if (!nowPrompt) {
    promptType.value = ''
    AIStore.promptType = ''
  }
})

onClickOutside(aiMenuOptions, (e) => {
  if (e.target instanceof HTMLElement && e.target.closest('.tippy-content') && e.target.tagName === 'INPUT') return
  if (e.target instanceof HTMLElement && e.target.closest('.tippy-content')) {
    focusCurrent()
  } else {
    props.editor.commands.setTextSelection({
      from: props.editor.state.selection.from - 1,
      to: props.editor.state.selection.to,
    })
    props.editor.commands.deleteSelection()
  }
})

defineExpose({
  onKeyDown,
})
</script>

<template>
  <AIMenuShell ref="input" v-model="userPrompt" :editor="editor" :command="command">
    <OpenTransition>
      <div
        v-if="searchResult > 0"
        ref="aiMenuOptions"
        class="layer-2 w-[13rem] rounded border border-gray-100 bg-stone-100"
      >
        <div class="flex max-h-[28rem] flex-col overflow-y-auto">
          <div v-for="(item, blockIndex) in filterNotFoundBlocks" :key="item.title" class="bg-white">
            <div class="text-subheading my-2 px-4 text-stone-400">
              {{ item.title }}
            </div>
            <MenuButton
              v-for="block in item.blocks"
              :key="block.title"
              :ref="addItemRefs as any"
              :block-title="block.title"
              icon="magic"
              :now-title="selectedItem.item.title"
              @mouseover="selectedIndex = itemsFlat.findIndex((item) => item.title === block.title)"
              @click="selectItem(block)"
            />
            <div v-if="blockIndex <= filterNotFoundBlocks.length - 2" class="my-1 h-[1px] w-full bg-stone-100" />
          </div>
        </div>
      </div>
    </OpenTransition>
  </AIMenuShell>
</template>

<style lang="scss"></style>
