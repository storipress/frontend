<script lang="ts" setup>
import type { NodeViewProps } from '@tiptap/vue-3'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { EditorView as CodeMirror, keymap as cmKeymap, drawSelection } from '@codemirror/view'
import { Compartment } from '@codemirror/state'
import { minimalSetup } from 'codemirror'
import { MenuButton } from '@headlessui/vue'
import { Dropdowns, Icon, MenuItem, Toggles } from '@storipress/core-component'
import invariant from 'tiny-invariant'
import { useNodeAttr } from '../../node-view-helper'
import type { TLang } from './setting'
import { langList, langListCapitalize, langMapping, normalizeLanguage } from './setting'
import { useCodeMirror } from './use-codemirror'

const props = defineProps<NodeViewProps>()
const languageConf = new Compartment()
const themeConf = new Compartment()

const content = computed(() => props.node.textContent ?? '')
const id = computed(() => props.node?.attrs.id)
const wrapCode = useNodeAttr<boolean>(props, 'wrapCode')
const nowLang = useNodeAttr<TLang>(props, 'language')

function codeMirrorTheme(wrapCode: boolean) {
  return CodeMirror.theme({
    // '&': {
    //   backgroundColor: '#f5f5f4',
    // },
    '&.cm-focused': { outline: 'none' },
    '&.cm-editor .cm-content': { padding: '2.4rem 1rem 2rem 2rem' },
    '.cm-content': {
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;',
      fontSize: '14px',
      maxWidth: wrapCode ? '100%' : null,
      wordBreak: 'break-all',
    },
  })
}

const { cm, target } = useCodeMirror({
  props,
  getExtensions(keyMaps) {
    // `nowLang` is a attribute binding, which cause its value won't immediately update
    const lang = !langMapping[nowLang.value] ? normalizeLanguage(nowLang.value) : nowLang.value
    nowLang.value = lang
    invariant(lang, 'unsupported language')
    return [
      cmKeymap.of([...keyMaps, ...defaultKeymap, indentWithTab]),
      minimalSetup,
      themeConf.of(codeMirrorTheme(wrapCode.value)),
      languageConf.of(langMapping[lang]),
      drawSelection(),
      syntaxHighlighting(defaultHighlightStyle),
    ]
  },
})

function selectNode() {
  cm.value?.focus()
}

function handleLangChange(value: TLang) {
  nowLang.value = value
  cm.value?.dispatch({
    effects: languageConf.reconfigure(langMapping[value]),
  })
}

function handleWrapCodeChange(toggleState: boolean) {
  wrapCode.value = toggleState
  cm.value?.dispatch({
    effects: themeConf.reconfigure(codeMirrorTheme(toggleState)),
  })
}

function removeSelf() {
  props.deleteNode?.()
}
</script>

<template>
  <NodeViewWrapper
    :id="id"
    class="interactive-node relative clear-both mb-1"
    :class="selected && 'has-focus'"
    :contenteditable="false"
    data-format="code-block"
    :data-sapling-ignore="true"
  >
    <div class="group/code-block rounded-lg bg-stone-200">
      <div
        class="absolute left-2 right-auto top-2 z-[1] w-full opacity-0 transition-opacity duration-150 group-hover/code-block:opacity-100"
      >
        <div class="flex">
          <Dropdowns class="h-fit">
            <template #button>
              <MenuButton class="rounded-md hover:bg-stone-200/50">
                <span class="flex items-center justify-center py-1 pl-2 pr-1.5">
                  <span class="text-caption mr-1.5 text-stone-500/70">{{
                    langListCapitalize[nowLang] ?? 'Select Language'
                  }}</span>
                  <Icon class="text-[.5rem] text-stone-500/50" icon-name="chevron_down" />
                </span>
              </MenuButton>
            </template>
            <template #default>
              <MenuItem
                v-for="item of langList"
                :key="item"
                class="text-caption"
                @click.prevent="handleLangChange(item)"
              >
                {{ langListCapitalize[item] }}
              </MenuItem>
            </template>
          </Dropdowns>
          <Dropdowns is-vertical class="ml-auto mr-3 h-fit">
            <template #button>
              <MenuButton
                class="inline-flex size-7 items-center justify-center rounded-sm bg-stone-200/50 transition-colors duration-75 ease-in-out hover:bg-stone-200 focus:outline-none"
                @click.stop
              >
                <Icon icon-name="dots_horizontal" />
              </MenuButton>
            </template>
            <template #default>
              <MenuItem class="text-caption" @click.prevent="removeSelf">Delete</MenuItem>
              <MenuItem class="pr-2">
                <div class="flex w-full items-center justify-center" @click.stop="handleWrapCodeChange">
                  <span class="text-caption mb-1.5"> Wrap Code </span>
                  <div class="ml-auto mr-0">
                    <Toggles
                      class="ml-auto mr-0"
                      :model-value="wrapCode"
                      type="short"
                      color="bg-emerald-600"
                      @update:model-value="handleWrapCodeChange"
                    />
                  </div>
                </div>
              </MenuItem>
            </template>
          </Dropdowns>
        </div>
      </div>
      <textarea ref="target" :value="content" @click="selectNode" />
    </div>
    <NodeViewContent class="hidden" />
  </NodeViewWrapper>
</template>
