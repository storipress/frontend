<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
import { useFuse } from '@vueuse/integrations/useFuse'
import type { Editor, Range } from '@tiptap/core'
import { match } from 'ts-pattern'
import { useScrollableList } from '../scrollable-list'
import { storeAIResponse } from '../ask-ai'
import { useAIMenuStore } from '../store'
import { clickableTag, menuPlaceholder } from '../setting'
import { MenuButton } from '..'
import { checkScrollY, customInsertContent, transMarkdownContentToHtml } from '../utils'
import type { Item } from './menu-items'
import { Action, editItems, improveItems, improveItemsBottom, utilitiesItems } from './menu-items'
import OpenTransition from '~/components/Transitions/open-transition.vue'
import { hideSlashAndAIMenu } from '~/components/Editor/utils'

const props = withDefaults(
  defineProps<{
    editor: Editor
    range: Range
    placeholder?: string
  }>(),
  {
    placeholder: menuPlaceholder,
  },
)

defineEmits<(e: 'update:modelValue', value: string) => void>()

const AIStore = useAIMenuStore()
const { textarea: textArea, input: textAreaInput } = useTextareaAutosize({
  onResize: () => {
    textArea.value?.scrollTo(0, textArea.value.scrollHeight)
  },
})
const input = ref<HTMLInputElement>()
const searchLock = ref(false)
const userPrompt = ref<string | undefined>('')
const isGettingResponse = computed(() => AIStore.response)
const isResponseEnd = computed(() => AIStore.responseEnd)
const inLoading = computed(() => isGettingResponse.value && !isResponseEnd.value)
const inStepTwo = computed(() => isGettingResponse.value && isResponseEnd.value)
const inStepOne = computed(() => !isGettingResponse.value && isResponseEnd.value)

const selectedText = computed(() => props.editor.state.doc.textBetween(props.range.from, props.range.to, ' '))
const stepOneList = computed(() => {
  const options = {
    fuseOptions: {
      keys: ['title'],
      threshold: 0.1,
    },
    matchAllWhenSearchEmpty: true,
  }
  const { results: editResults } = useFuse((userPrompt.value || '').toLowerCase(), editItems, options)
  const { results: untitleResults } = useFuse((userPrompt.value || '').toLowerCase(), utilitiesItems, options)
  return [
    {
      title: 'EDIT',
      blocks: editResults.value.map((item) => item.item),
    },
    {
      title: 'UTILITIES',
      blocks: untitleResults.value.map((item) => item.item),
    },
  ]
})

const filterNotFoundBlocks = computed(() => {
  return stepOneList.value.filter((item) => item.blocks.length > 0)
})

const stepOneFlat = computed(() => stepOneList.value.flatMap((group) => group.blocks))

const stepTwoList = computed(() => [
  { title: 'improveTop', blocks: improveItems },
  { title: 'improveBottom', blocks: improveItemsBottom },
])

const stepTwoFlat = computed(() => stepTwoList.value.flatMap((group) => group.blocks))

const {
  itemRefs: stepOneRefs,
  selectedIndex: stepOneIndex,
  onKeyDown: stepOneKeydown,
  selectedItem: stepOneSelected,
} = useScrollableList({
  items: stepOneFlat,
  onSubmit: selectItem,
})

const {
  itemRefs: stepTwoRefs,
  selectedIndex: stepTwoIndex,
  onKeyDown: stepTwoKeydown,
  selectedItem: stepTwoSelected,
} = useScrollableList({
  items: stepTwoFlat,
  onSubmit: selectItem,
})

function addStepOneRefs(ref: HTMLElement | ComponentPublicInstance | null) {
  const el = unrefElement(ref)
  if (!el || !(el instanceof HTMLElement)) return
  stepOneRefs.value.push(el)
}

function addStepTwoRefs(ref: HTMLElement | ComponentPublicInstance | null) {
  const el = unrefElement(ref)
  if (!el || !(el instanceof HTMLElement)) return
  stepTwoRefs.value.push(el)
}

function insertContent(from: number) {
  customInsertContent(from, props.editor, transMarkdownContentToHtml(textAreaInput.value))
  props.editor.commands.closeAIMenu()
  AIStore.response = ''
}

function startAI(prebuiltPrompt: string, promptType?: string) {
  AIStore.prompt = prebuiltPrompt || userPrompt.value || ''
  // FIXME: this part of code will be remove in minify step so we move this to a different function
  // Currently, cannot reproduce this in local environment
  storeAIResponse({
    prompt: AIStore.prompt,
    promptType,
    content: selectedText.value,
    requestSource: inStepTwo.value ? 'next-step' : 'modify',
  })
}

function selectItem(block: Item) {
  if (!block) {
    AIStore.prompt = userPrompt.value || ''
    storeAIResponse({
      prompt: AIStore.prompt,
      promptType: AIStore.promptType,
      content: selectedText.value,
      requestSource: inStepTwo.value ? 'next-step' : 'modify',
    })
    return
  }

  if (block.shouldAskUser) {
    input.value?.focus()
    userPrompt.value = block.prompt
    AIStore.promptType = block.promptType || ''

    return
  } else if (block.type === 'prompt') {
    startAI(block.prompt, block.promptType)
  } else if (block.type === 'action') {
    match(block)
      .with({ action: Action.Discard }, () => {
        AIStore.selectChatId = ''
        props.editor.commands.closeAIMenu()
      })
      .with({ action: Action.Retry }, () => {
        AIStore.ABORT_CONTROLLER()
        AIStore.responseEnd = false
        storeAIResponse({
          prompt: AIStore.prompt,
          promptType: AIStore.promptType,
          content: selectedText.value,
          requestSource: 'next-step',
        })
      })
      .with({ action: Action.Insert }, () => {
        AIStore.selectChatId = ''
        props.editor.commands.insertContentAt(props.range.to, { type: 'paragraph' })
        insertContent(props.range.to)
      })
      .with({ action: Action.Replace }, () => {
        AIStore.selectChatId = ''
        props.editor.commands.deleteRange({ from: props.range.from, to: props.range.to })
        insertContent(props.range.from)
      })
      .exhaustive()
  }
  userPrompt.value = ''
}

onMounted(async () => {
  const initScrollY = window.scrollY
  input.value?.focus({ preventScroll: true })
  if (initScrollY > 0) {
    checkScrollY()
  }
  await nextTick()
  if (initScrollY > 0) {
    checkScrollY()
  }
  stepOneRefs.value[stepOneRefs.value.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
})

onUnmounted(() => {
  AIStore.response = ''
  userPrompt.value = ''
  AIStore.ABORT_CONTROLLER()
})

watch(
  () => AIStore.response,
  (response) => {
    textAreaInput.value = response
  },
)

watch(stepOneList, () => {
  stepOneIndex.value = 0
})

watch(stepTwoList, () => {
  stepTwoIndex.value = 0
})

onKeyStroke(['ArrowUp', 'ArrowDown', 'Backspace', 'Enter'], (e) => {
  if ((e.code === 'Enter' || e.code === 'Backspace') && searchLock.value) return

  if (e.code === 'Backspace' && !userPrompt.value && !inStepTwo.value) {
    props.editor.commands.closeAIMenu()
    return
  }

  if (inStepTwo.value) {
    stepTwoKeydown({ event: e })
  } else {
    stepOneKeydown({ event: e })
  }
})

onClickOutside(textArea, (e) => {
  if (
    e.target instanceof HTMLElement &&
    e.target.closest('.tippy-content') &&
    clickableTag.includes(e.target.tagName)
  ) {
    return
  }
  props.editor.commands.closeAIMenu()
  AIStore.ABORT_CONTROLLER()
  AIStore.selectChatId = ''
})

onClickOutside(input, (e) => {
  if (
    e.target instanceof HTMLElement &&
    e.target.closest('.tippy-content') &&
    clickableTag.includes(e.target.tagName)
  ) {
    return
  }
  props.editor.commands.closeAIMenu()
  AIStore.ABORT_CONTROLLER()
  AIStore.selectChatId = ''
})

defineExpose({
  focus: () => {
    if (!hideSlashAndAIMenu(props.editor)) {
      input.value?.focus({ preventScroll: true })
    }
  },
})
</script>

<template>
  <div v-show="!hideSlashAndAIMenu(editor)" class="text-body relative z-10 -ml-1 mt-2 flex flex-col gap-0.5">
    <div class="layer-2 flex w-[30rem] items-center justify-center space-x-2.5 rounded bg-white px-3 py-2">
      <textarea
        v-if="inStepTwo || inLoading"
        ref="textArea"
        v-model="textAreaInput"
        name="prompt"
        resize="none"
        class="text-body max-h-96 w-full overflow-y-scroll bg-transparent text-stone-600 focus:outline-none"
        :style="{ resize: 'none' }"
        :placeholder="placeholder"
        readonly
      />
      <input
        v-else-if="inStepOne"
        ref="input"
        v-model="userPrompt"
        name="prompt"
        class="w-full bg-transparent focus:outline-none"
        :placeholder="placeholder"
        @compositionstart="searchLock = true"
        @compositionend="searchLock = false"
      />
      <Icon
        v-if="inStepOne"
        class="mb-auto cursor-pointer text-[1rem] text-stone-500 transition-colors hover:text-stone-600"
        icon-name="circle-tick"
        @click="
          storeAIResponse({
            prompt: userPrompt || '',
            promptType: AIStore.promptType,
            content: selectedText,
            requestSource: inStepTwo ? 'next-step' : 'modify',
          })
        "
      />
    </div>

    <OpenTransition>
      <div
        v-if="(inStepTwo && stepTwoList.length > 0) || (inStepOne && filterNotFoundBlocks.length > 0)"
        class="layer-2 flex max-h-[28rem] w-[13rem] flex-col overflow-y-auto rounded border bg-white py-0.5"
      >
        <template v-if="inStepTwo">
          <div v-for="(item, blockIndex) in stepTwoList" :key="item.title" class="bg-white">
            <MenuButton
              v-for="block in item.blocks"
              :key="block.title"
              :ref="addStepTwoRefs as any"
              :block-title="block.title"
              :icon="block.icon"
              :now-title="stepTwoSelected.item.title"
              @mouseover="stepTwoIndex = stepTwoFlat.findIndex((item) => item.title === block.title)"
              @click="selectItem(block)"
            />
            <div v-if="blockIndex <= stepTwoList.length - 2" class="my-1 h-[1px] w-full bg-stone-100" />
          </div>
        </template>
        <template v-else-if="inStepOne">
          <div v-for="(item, blockIndex) in filterNotFoundBlocks" :key="item.title" class="bg-white">
            <div class="text-subheading mb-0.5 mt-1.5 px-4 text-stone-400">
              {{ item.title }}
            </div>
            <MenuButton
              v-for="block in item.blocks"
              :key="block.title"
              :ref="addStepOneRefs as any"
              :block-title="block.title"
              :icon="block.icon"
              :now-title="stepOneSelected.item.title"
              @mouseover="stepOneIndex = stepOneFlat.findIndex((item) => item.title === block.title)"
              @click="selectItem(block)"
            />
            <div v-if="blockIndex <= filterNotFoundBlocks.length - 2" class="my-1 h-[1px] w-full bg-stone-100" />
          </div>
        </template>
      </div>
    </OpenTransition>
  </div>
</template>
