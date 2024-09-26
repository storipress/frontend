<!-- embed link card -->
<script lang="ts" setup>
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { PropType, WritableComputedRef } from 'vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { Node } from 'prosemirror-model'
import { isUri } from 'valid-url'
import * as Sentry from '@sentry/vue'
import { Menu as HMenu } from '@headlessui/vue'
import { MenuItem } from '@storipress/core-component'
import Bookmark from './bookmark.vue'
import { getIframe, putIframe } from './iframe-recycler'
import { load } from './iframely'
import Instagram from './instagram.svg'
import Soundcloud from './soundcloud.svg'
import NoDragging from '~/components/NoDragging.vue'
import MenuLink from '~/components/Manager/MenuLink/MenuLink.vue'
import { raf } from '~/utils/editor'
import { getAPI } from '~/components/Editor/core/api'
import type { BookmarkMeta, EmbedMeta } from '~/components/Editor/core/api'
import { useRemoteDialog } from '~/modules/editor/remote-dialog/composite'
import { OpenTransition } from '~/components/Transitions'

defineOptions({
  name: 'ResourceView',
})

const props = defineProps({
  editor: {
    type: Object as PropType<import('@tiptap/core').Editor>,
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
  updateAttributes: {
    type: Function as PropType<(attributes: Record<string, string | boolean>) => void>,
    required: true,
  },
  deleteNode: {
    type: Function as PropType<() => void>,
    required: true,
  },
})

const AVAILABLE_ICONS = new Set(['twitter', 'instagram', 'vimeo', 'spotify', 'soundcloud', 'youtube', 'codepen'])

const DESCRIPTIONS: Record<string, string> = {
  twitter: 'Paste tweet URL',
  instagram: 'Paste Instagram URL',
  vimeo: 'Paste Vimeo video URL',
  spotify: 'Paste Spotify song or playlist URL',
  soundcloud: 'Paste Soundcloud song URL',
  youtube: 'Paste YouTube video URL',
  codepen: 'Paste Codepen URL',
  bookmark: 'URL of bookmark card',
}

function safeParseMeta(meta: string | null) {
  try {
    return meta ? JSON.parse(meta) : null
  } catch (e) {
    Sentry.captureException(new Error('invalid meta', { cause: e as Error }), (scope) => {
      scope.setContext('meta', {
        meta,
      })
      return scope
    })
    return null
  }
}

async function loadIframely() {
  // wait anothor tick for dom update
  await raf()
  load()
}

const img = { Instagram, Soundcloud }
const container = ref<HTMLElement>()
const refMenu = ref<HTMLElement>()
const urlInput = ref<HTMLInputElement>()
const input = ref('')
const html = ref('')

function bindAttr(key: string): WritableComputedRef<string | boolean> {
  return computed({
    get() {
      return props.node.attrs[key]
    },
    set(val: string | boolean) {
      return props.updateAttributes({ [key]: val })
    },
  })
}

const id = bindAttr('id')
const url = bindAttr('url')
const type = bindAttr('type')
const target = bindAttr('target') as Ref<string>
const showMenu = bindAttr('showMenu')

const meta = computed({
  get(): BookmarkMeta | null {
    return safeParseMeta(props.node.attrs.meta)
  },
  set(meta: BookmarkMeta | null) {
    try {
      props.updateAttributes({ meta: JSON.stringify(meta) })
    } catch (e) {
      // Ignore error
    }
  },
})
const bookmark = computed(() =>
  url.value && type.value === 'bookmark' && meta.value ? (meta.value as BookmarkMeta) : null,
)
const embed = computed(() => (url.value && type.value === 'embed' && meta.value ? (meta.value as EmbedMeta) : null))

watch(
  url,
  async (nowUrl, oldUrl) => {
    if (nowUrl && nowUrl !== oldUrl && nowUrl !== meta.value?.url) {
      const api = getAPI()
      try {
        if (typeof nowUrl === 'string' && typeof type.value === 'string') {
          meta.value = await api.getBookmarkMeta(nowUrl, type.value)
          input.value = nowUrl
        }
      } catch {
        const { getPos } = props
        if (getPos() >= 0) {
          Sentry.captureException(new Error('Url cannot parsed as bookmark'), (scope) => {
            scope.setContext('message', {
              url: nowUrl,
              input,
            })
            return scope
          })
          const { open } = useRemoteDialog('error-notification')
          url.value = ''
          input.value = ''
          open({ type: 'bookmark' })
        }
      }
      await nextTick()
      await raf()
      load()
    }
  },
  { immediate: true },
)

watch(
  embed,
  async (embed, old) => {
    if (embed && embed.html !== old?.html) {
      // since ProseMirror may recreate NodeView, we need to manage iframe by ourseleves to prevent unnecessary reload
      // unnecessary reload will eat up a lot of resource and may cause crash
      // here is the magic, we check if we already have iframe, we don't update the html, we inject the old iframe element instead
      const $iframe = getIframe(props.node.attrs.meta)
      if (!$iframe) {
        html.value = embed.html
      }
      // a tick for vue update
      await nextTick()

      const $container = container.value
      if ($container && $iframe) {
        $container.append($iframe)
      }

      await loadIframely()

      input.value = embed.url
    }
  },
  { immediate: true },
)

function setSelection() {
  props.editor.commands.setNodeSelection(props.getPos())
}

function handleDelete() {
  props.deleteNode()
}

function handleUrlClick() {
  urlInput.value?.focus()
}

function handleSubmit() {
  if (isUri(input.value)) {
    url.value = input.value
  }
}

function dismiss() {
  const pos = props.getPos()
  showMenu.value = false
  props.deleteNode()
  if (typeof url.value === 'string') {
    props.editor.commands.insertContentAt(pos, url.value)
  }
}

async function createBookMark() {
  const api = getAPI()
  showMenu.value = false
  type.value = 'bookmark'
  if (typeof url.value === 'string') {
    meta.value = await api.getBookmarkMeta(url.value, 'bookmark')
  }
  await nextTick()
  await loadIframely()
}

async function createEmbed() {
  const api = getAPI()
  showMenu.value = false
  type.value = 'embed'
  if (typeof url.value === 'string') {
    meta.value = await api.getBookmarkMeta(url.value, 'embed')
  }
  await nextTick()
  await loadIframely()
}

async function loadExistingUrl() {
  await nextTick()
  load()
  // process existing embed
  if (embed.value) {
    input.value = embed.value.url
    return
  }
  if (bookmark.value) {
    input.value = bookmark.value.url
  }
}

onClickOutside(urlInput, (e) => {
  if (e.target instanceof HTMLElement && e.target.tagName !== 'DIV') {
    handleSubmit()
  }
})

onClickOutside(refMenu, () => {
  showMenu.value = false
})

onMounted(async () => {
  await loadExistingUrl()
})

onUpdated(async () => {
  if (input.value === bookmark.value?.url || input.value === embed.value?.url) {
    return
  }
  await loadExistingUrl()
})

onBeforeUnmount(() => {
  const $container = container.value
  if ($container?.firstElementChild) {
    putIframe(props.node.attrs.meta, $container.firstElementChild as HTMLElement)
  }
})

watch(meta, (meta) => {
  if (!meta?.html) {
    createBookMark()
  }
})

const caption = bindAttr('caption')
const icon = computed(() => (AVAILABLE_ICONS.has(target.value) ? `icon-${target.value}` : 'icon-bookmark'))
const description = computed(() => DESCRIPTIONS[target.value] ?? 'Paste URL')
</script>

<template>
  <NodeViewWrapper
    :id="id"
    class="interactive-node not-prose relative clear-both flex flex-col items-center justify-center rounded outline-none"
    data-format="resource"
    :data-type="type"
    :data-url="url"
    :data-meta="node.attrs.meta"
    :data-sapling-ignore="true"
    @click="setSelection"
  >
    <div
      v-if="!(bookmark || embed)"
      class="layer-1 flex w-full cursor-pointer items-center rounded border border-stone-200 bg-stone-100 px-3 py-2.5"
      @click="handleUrlClick"
    >
      <img v-if="target === 'instagram'" :src="img.Instagram" alt="Instagram" class="w-4" />

      <img v-else-if="target === 'soundcloud'" :src="img.Soundcloud" alt="Soundcloud" class="w-4" />

      <span v-else :class="icon" class="text-stone-400" />

      <span class="text-body ml-2 flex flex-col items-center justify-center text-stone-400" v-text="description" />
    </div>

    <template v-if="bookmark">
      <Bookmark :meta="bookmark" />
    </template>

    <template v-else-if="embed">
      <div class="relative w-full">
        <template v-if="embed.html">
          <div class="absolute inset-0 z-10" />
          <div ref="container" v-html="html" />
        </template>
        <div v-else class="flex h-64 w-full items-center justify-center">Unsupported content</div>
      </div>

      <input
        v-model="caption"
        class="w-full p-1 text-center"
        :class="{ hidden: !caption, block: selected }"
        placeholder="Type caption for embed (optional)"
        @cut.stop
        @copy.stop
        @paste.stop
      />
    </template>
    <HMenu
      v-if="showMenu && meta"
      ref="refMenu"
      as="div"
      class="layer-2 absolute top-full z-[52] -mt-6 flex flex-col items-center rounded border border-gray-100 bg-white"
    >
      <div class="text-body w-full py-1">
        <MenuItem @click="createEmbed">Create embed</MenuItem>
        <MenuItem @click="createBookMark">Create bookmark</MenuItem>
        <MenuItem @click="dismiss">Paste plaintext</MenuItem>
      </div>
    </HMenu>
    <OpenTransition v-else>
      <div v-if="selected" class="absolute bottom-12 z-[50]">
        <NoDragging>
          <MenuLink
            ref="urlInput"
            v-model="input"
            type="text"
            placeholder="Paste link"
            @mousedown.stop
            @click.stop
            @cut.stop
            @copy.stop
            @paste.stop
            @change="handleSubmit"
            @delete="handleDelete"
          />
        </NoDragging>
      </div>
    </OpenTransition>
  </NodeViewWrapper>
</template>
