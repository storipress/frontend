<script lang="ts" setup>
import type { Editor } from '@tiptap/core'
import { noop } from 'lodash'
import { hasProtocol, withHttps } from 'ufo'

import type { LinkEditPluginProps } from './link-edit-plugin'
import { LinkEditPlugin, LinkEditPluginKey } from './link-edit-plugin'
import MenuLink from '~/components/Manager/MenuLink'

const props = withDefaults(
  defineProps<{
    editor: Editor
    tippyOptions?: LinkEditPluginProps['tippyOptions']
  }>(),
  {
    tippyOptions: () => ({}),
  },
)

const emit = defineEmits<{
  setLink: [string]
}>()

// these value will inject by ProseMirror plugin
const active = ref(false)
const url = ref('')
const update = ref<(url: string) => void>(noop)
const remove = ref<() => void>(noop)

const el = useCurrentElement()

const formattedLink = computed(() => {
  const value = url.value ?? ''
  if (!value) {
    return ''
  }

  return !hasProtocol(value) ? withHttps(value) : value
})

watch(
  () => props.editor,
  async (editor, old) => {
    if (old && !old.isDestroyed) {
      old.unregisterPlugin(LinkEditPluginKey)
    }
    if (editor) {
      await nextTick()
      // register plugin after nextTick to make sure it's ready, but in test environment, we have a chance that editor will be destroy immediately
      if (editor.isDestroyed) {
        return
      }

      editor.registerPlugin(
        LinkEditPlugin({
          editor,
          tippyOptions: props.tippyOptions,
          element: el.value as HTMLElement,
          onUpdate: (input) => {
            active.value = input.active
            url.value = input.url
            update.value = input.update
            remove.value = input.remove
          },
        }),
      )
    }
  },
  { immediate: true, flush: 'post' },
)

onBeforeUnmount(() => {
  props.editor.unregisterPlugin(LinkEditPluginKey)
})
</script>

<template>
  <MenuLink
    v-show="active"
    v-model="url"
    @change="emit('setLink', formattedLink), update(formattedLink)"
    @delete="$emit('setLink', '')"
  />
</template>
