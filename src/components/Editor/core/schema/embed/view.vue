<script lang="ts">
// ref: https://gitlab.com/emergence-engineering/prosemirror-codemirror-block
import type { Editor } from '@tiptap/vue-3'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
import type { PropType } from 'vue'
import { computed, defineComponent, ref } from 'vue'
import type { Node } from 'prosemirror-model'
import { Fragment } from 'prosemirror-model'
import { Icon } from '@storipress/core-component'
import { html } from '@codemirror/lang-html'
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { EditorView as CodeMirror, keymap as cmKeymap, drawSelection, placeholder } from '@codemirror/view'

import { useCodeMirror } from '../../tiptap/plugins/code-block/use-codemirror'
import Preview from './preview.vue'
import { sandboxIFrame } from './sandbox-iframe'
import { CustomBlockPreview } from './customBlockPreview'
import { purify } from '~/utils/editor/convert'

const renderer = {
  html(content: string) {
    const node = purify(content, true, true)
    sandboxIFrame(node)
    return node.innerHTML
  },
}

export default defineComponent({
  name: 'EmbedView',

  components: { NodeViewWrapper, NodeViewContent, Preview, Icon, CustomBlockPreview },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    node: {
      type: Object as PropType<Node>,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
    getPos: {
      type: Function as PropType<() => number>,
      required: true,
    },
    deleteNode: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },

  setup(props) {
    const editing = ref(true)
    const editorBlockNowSubmit = ref<unknown>(undefined)
    const content = computed(() => props.node.textContent)
    const isCustomBlock = computed(() => Boolean(props.node.attrs.blockName))

    const blurExtension = CodeMirror.domEventHandlers({
      blur() {
        editing.value = false
      },
    })

    const theme = CodeMirror.theme({
      '&': { height: '300px' },
      '&.cm-editor.cm-focused': { outline: 'transparent' },
      '.cm-scroller': { overflow: 'auto' },
    })
    const { cm, target, codeContent } = useCodeMirror({
      props,
      getExtensions: (keyMaps) => {
        return [
          blurExtension,
          cmKeymap.of([...keyMaps, ...defaultKeymap, indentWithTab]),
          theme,
          html(),
          drawSelection(),
          syntaxHighlighting(defaultHighlightStyle),
          placeholder('Write or paste your code here ...'),
        ]
      },
    })

    const previewContent = computed(() => {
      return renderer.html(codeContent.value)
    })

    function selectNode() {
      cm.value?.focus()
    }

    function updateNowSubmit(submit: unknown) {
      editorBlockNowSubmit.value = submit
    }

    function updateHTML(html: string) {
      const { editor, node, getPos } = props
      const { view } = editor

      const start = getPos() + 1

      const pmTr = view.state.tr.replaceWith(
        start,
        start + node.nodeSize - 1,
        html ? view.state.schema.text(html) : Fragment.empty,
      )
      view.dispatch(pmTr)
    }

    async function handleEditorClick() {
      editing.value = true
      await nextTick()
      if (cm) {
        cm.value?.focus()
      }
    }

    function removeSelf() {
      props.deleteNode?.()
    }

    return {
      isCustomBlock,
      target,
      editing,
      editorBlockNowSubmit,
      updateHTML,
      updateNowSubmit,
      name: computed(() => props.node.attrs.name),
      content,
      blockName: computed(() => props.node.attrs.blockName),
      uuid: computed(() => props.node.attrs.uuid),
      id: computed(() => props.node.attrs.id),
      previewContent,
      selectNode,
      handleEditorClick,
      removeSelf,
      removeCustomBlock() {
        // TODO:  do cleanup for custom block, now just an alias for removeSelf
        removeSelf()
      },
    }
  },
})
</script>

<template>
  <NodeViewWrapper
    :id="id"
    class="interactive-node clear-both p-px"
    :class="selected && 'has-focus'"
    data-format="embed"
    contenteditable="false"
    :data-name="name"
    :data-content="content"
    :data-block-name="blockName"
    :data-uuid="uuid"
    :data-sapling-ignore="true"
    @edit-mode="editing = true"
    @click="handleEditorClick"
  >
    <div v-if="isCustomBlock">
      <CustomBlockPreview
        :block-name="node.attrs.blockName"
        :uuid="node.attrs.uuid"
        :now-submit="editorBlockNowSubmit"
        @update="updateHTML"
        @update-now-submit="updateNowSubmit"
        @delete="removeCustomBlock"
      />
    </div>
    <div v-else>
      <span
        class="absolute left-0 flex size-8 -translate-x-full transform pt-2"
        :class="!content && !editing && 'hidden'"
      >
        <Icon icon-name="html_embed" class="text-[1.25rem] text-stone-600 dark:text-stone-200" />
      </span>

      <div
        v-if="!content"
        class="layer-1 text-body flex items-center space-x-2 rounded border border-stone-200 bg-stone-100 px-2.5 py-2"
        :class="editing && 'hidden'"
      >
        <Icon icon-name="html_embed" class="text-[1.5rem] text-stone-400" />
        <span class="text-body text-stone-400">HTML Embed</span>
      </div>

      <div class="relative" :class="{ 'border bg-stone-50 p-1': editing, 'p-2': !editing }">
        <div :class="!editing && 'hidden'">
          <textarea ref="target" :value="content" />
        </div>

        <Preview :class="editing && 'hidden'" :html="previewContent" />

        <div class="absolute inset-0 z-10" :class="{ hidden: editing }" @click="selectNode" />
        <span class="flex w-full items-center" :class="!editing && 'hidden'" role="button">
          <Icon
            class="ml-auto mr-0 cursor-pointer rounded-full p-1.5 text-[.75rem] hover:bg-stone-200 hover:duration-75"
            icon-name="delete"
            @mousedown="removeSelf"
          />
        </span>
      </div>
    </div>

    <!-- ProseMirror slot, this is required or ProseMirror will change the whole element into editable -->
    <NodeViewContent class="hidden" />
  </NodeViewWrapper>
</template>
