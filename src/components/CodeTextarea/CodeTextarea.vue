<script lang="ts" setup>
import type { ViewUpdate } from '@codemirror/view'
import { EditorView, lineNumbers } from '@codemirror/view'
import { useVModel } from '@vueuse/core'
import { defaultHighlightStyle, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { html } from '@codemirror/lang-html'
import { editorFromTextArea } from '~/utils/editor/codemirror'

const props = defineProps({
  textareaLabel: {
    type: String,
  },
  textareaId: {
    type: String,
  },
  textareaName: {
    type: String,
  },
  modelValue: {
    type: String,
  },
})
const emit = defineEmits<(event: 'update:modelValue', value: string) => void>()

const textareaContent = useVModel(props, 'modelValue')
const codeEditor = ref()

onMounted(() => {
  const theme = EditorView.theme({
    '&': { height: '160px', backgroundColor: '#FFF', fontSize: '13pt' },
    '&.cm-editor.cm-focused': { outline: 'transparent' },
    '.cm-scroller': { overflow: 'auto' },
    '.cm-content': {
      maxWidth: '100%',
      wordWrap: 'break-word',
    },
  })
  editorFromTextArea(codeEditor.value, [
    theme,
    EditorView.lineWrapping,
    EditorView.updateListener.of((v: ViewUpdate) => {
      if (v.docChanged) {
        emit('update:modelValue', v.state.doc.toString())
      }
    }),
    indentUnit.of('  '),
    lineNumbers(),
    html(),
    syntaxHighlighting(defaultHighlightStyle),
  ])
})
</script>

<template>
  <form class="w-full">
    <label class="text-subheading text-stone-800" :for="textareaId">{{ textareaLabel }}</label>
    <div class="mt-2 rounded-sm border border-gray-400">
      <textarea :id="textareaId" ref="codeEditor" v-model="textareaContent" :name="textareaName" />
    </div>
  </form>
</template>

<style lang="scss" scoped>
:deep .CodeMirror {
  @apply h-40 rounded-[3px] font-mono;
  &-gutters {
    @apply w-4 border-0 bg-[#f3f3f3];
  }
  &-linenumber {
    @apply min-w-fit text-sm text-[#707171];
    width: 0rem !important;
  }
}
</style>
