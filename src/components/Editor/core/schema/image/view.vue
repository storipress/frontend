<script lang="ts" setup>
import type { NodeViewProps } from '@tiptap/vue-3'
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { Upload } from './drop-bus'
import { droppedItems } from './drop-bus'
import { useUploaderStore } from './uploader'
import { fetchExternalImage } from './external-image'
import type { DialogInfo } from '~/modules/editor/remote-dialog'
import { useRemoteDialog } from '~/modules/editor/remote-dialog/composite'
import { clientID } from '~/components/Editor/core/client'
import { getAPI } from '~/components/Editor/core/api'
import PhotoCard from '~/components/Manager/PhotoCard'
import { isInvalidImage } from '~/utils/file'
import { useEditorStore } from '~/stores/editor'
import { UploadImage } from '~/graphql-operations'
import { EXTERNAL_IMAGE, UNSPLASH, getImageSource } from '~/utils/image-source'

interface UnsplashPhoto {
  src: string
  alt: string
  title: string
}

type UnsplashDialogInfo = DialogInfo<'unsplash', true, UnsplashPhoto>

const { open: openUnsplashDialog } = useRemoteDialog<UnsplashDialogInfo>('unsplash')
const { open: openErrorDialog } = useRemoteDialog('error-notification')

defineOptions({
  name: 'ImageView',
})

const props = defineProps<NodeViewProps>()

const tmpSrc = ref('')
const uploader = useUploaderStore()
const editorStore = useEditorStore()

// ref: https://github.com/storipress/tiptap-schema/blob/68ab3ec5240a409110e332fe760f56580f5043b5/src/schema/image/utils.ts#L4
const photoStyle = computed(() => {
  if (props.node?.attrs.type === 'wide') {
    return 'wide'
  } else if (props.node?.attrs.type === 'full-width') {
    return 'full'
  } else {
    return 'mx-auto'
  }
})

async function withUploadPreview<T>(urlOrFile: string | Blob, fn: () => Promise<T>): Promise<T> {
  tmpSrc.value = typeof urlOrFile === 'string' ? urlOrFile : URL.createObjectURL(urlOrFile)
  try {
    return await fn()
  } finally {
    if (tmpSrc.value) {
      URL.revokeObjectURL(tmpSrc.value)
    }
    tmpSrc.value = ''
  }
}

function handleUploaded(info: { url: string; width: number; height: number }) {
  const api = getAPI()

  if (!info.url) {
    return ''
  }

  const url = api.createImageURL(info.url)
  try {
    props.updateAttributes({ src: url, source: [], file: null, cid: null, provider: null })
  } catch (e) {
    // Ignore error
  }
  return url
}

async function tryResumeUpload(resumeId: string) {
  const resumableUpload = uploader.resume(resumeId)
  if (!resumableUpload) {
    return false
  }

  const { file, uploadPromise } = resumableUpload
  return withUploadPreview(file, async () => {
    const info = await uploadPromise
    handleUploaded(info)
    return true
  })
}

function onUpload(img: Blob, isDrag?: boolean) {
  return withUploadPreview(img, async () => {
    const { resumeId, promise } = uploader.upload({
      id: editorStore.id,
      type: UploadImage.ArticleContentImage,
      file: img,
    })
    props.updateAttributes?.({ file: resumeId })

    const info = await promise

    sendTrack('editor_photo_upload', {
      type: isDrag ? 'drag' : 'upload',
      isHotLink: false,
    })

    return handleUploaded(info)
  })
}

function bindAttr<T>(key: string) {
  return computed<T>(() => props.node.attrs[key])
}
const id = bindAttr<string>('id')
const src = bindAttr<string>('src')
const title = bindAttr<string>('title')
const alt = bindAttr<string>('alt')
const style = bindAttr<string>('style')
const link = bindAttr<string>('link')
const provider = bindAttr<string | null>('provider')
const imgType = bindAttr<string>('type')
const isIssuer = computed(() => {
  return props.node.attrs.cid === clientID
})
const source = computed(() => {
  return JSON.stringify(props.node.attrs.source)
})

async function callUnsplash() {
  const res = await openUnsplashDialog(true)
  if (res) {
    props.updateAttributes({ ...res, cid: null, provider: null })
  }
  return res
}
async function processUpload(upload: Upload, isDrag: boolean) {
  switch (upload.kind) {
    case 'file':
      if (!(await isInvalidImage(upload.file))) onUpload(upload.file, isDrag)
      break
    case 'url':
      await withUploadPreview(upload.url, async () => {
        try {
          const file = await fetchExternalImage(upload.url)
          await onUpload(file, isDrag)
        } catch {
          openErrorDialog({ type: 'imageUrlUpload' })
          try {
            props.updateAttributes({ src: null, source: [], file: null, cid: null, provider: null })
          } catch (e) {
            // Ignore error
          }
        }
      })
      break
  }
}
function onRemove() {
  props.deleteNode()
}
function setSelection() {
  props.editor.chain().setNodeSelection(props.getPos()).focus().run()
}
function removeSelf() {
  props.deleteNode()
}
function updateCaption(title: string) {
  props.updateAttributes({ title })
}
function updateAlt(alt: string) {
  props.updateAttributes({ alt })
}
function updateType(type: string) {
  props.updateAttributes({ type })
  // remove user custom style
  props.updateAttributes({ style: '' })
}
function updateLink(link: string) {
  props.updateAttributes({ link })
}

function handleDrop(fileId: string) {
  const item = droppedItems.get(fileId)

  if (!item) {
    return
  }

  droppedItems.delete(fileId)
  processUpload(item, true)
}

onMounted(async () => {
  if (provider.value && isIssuer.value) {
    if (provider.value === UNSPLASH) {
      const res = await callUnsplash()
      if (!res) {
        removeSelf()
      }
      return
    } else if (provider.value === EXTERNAL_IMAGE) {
      if (getImageSource(src.value) === 'external-image') {
        processUpload({ kind: 'url', url: src.value }, false)
        return
      } else {
        props.updateAttributes({ cid: null, provider: null })
      }
    }
  }

  const fileId = props.node.attrs.file
  if (!fileId) {
    return
  }

  if (await tryResumeUpload(fileId)) {
    return
  }

  handleDrop(fileId)
})
</script>

<template>
  <NodeViewWrapper
    :id="id"
    class="interactive-node not-prose clear-both"
    :class="[photoStyle, !src && 'image']"
    data-format="image"
    :data-title="title"
    :data-alt="alt"
    :data-src="src"
    :data-source="source"
    :data-provider="provider"
    :data-sapling-ignore="true"
    @click="setSelection"
  >
    <PhotoCard
      :img="src"
      :tmp-img="tmpSrc"
      :alt="alt"
      :style="style"
      :caption="title"
      :link="link"
      :img-type="imgType"
      :upload-img="onUpload"
      :remove-img="onRemove"
      :call-unsplash="callUnsplash"
      :update-alt="updateAlt"
      :update-caption="updateCaption"
      :update-type="updateType"
      :update-link="updateLink"
    />
  </NodeViewWrapper>
</template>

<style lang="scss" scoped>
.image {
  @apply w-full;
}
</style>
