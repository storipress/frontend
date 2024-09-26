<!-- eslint-disable tailwindcss/no-custom-classname -->
<script lang="ts" setup>
import { computed } from 'vue'
import { isEqual, truncate, uniqBy } from 'lodash-es'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import * as Sentry from '@sentry/vue'
import { Snackbar } from '@storipress/core-component'
import { useProvideFieldStorage, wrapFieldAsStorage } from '@storipress/custom-field'
import { withQuery } from 'ufo'
import { Effect, pipe } from 'effect'
import { useCustomField } from '../utils'
import Unsplash from './components/unsplash.vue'
import ErrorModal from './components/error-modal.vue'
import { deviceType, deviceWidth, retryConnectTimesLimit } from './setting'
import EditorBody from './components/editor-body.vue'
import type { Avatar, FormModel, TCover } from './types'
import LoadingPage from './components/loading-page.vue'
import {
  initArticle,
  initFormModel,
  initIgnoreFormModel,
  useIdleClearEditing,
  useLayouts,
  useLinter,
  usePerformance,
  usePreview,
  usePublish,
  useUnload,
  useUpdate,
  useWatch,
} from './utils'
import EditorHeader from './components/editor-header.vue'
import ColorModeButton from '~/components/color-mode-button.vue'
import { useEditorState } from '~/modules/editor/pinia'
import { useEditorStore } from '~/stores/editor'
import type { Article } from '~/components/Scheduler/definitions'
import { channelId } from '~/lib/channel'
import { WordCount } from '~/components/Editor/WordCount'
import Navbar from '~/components/Manager/Navbar'
import UploadHero from '~/components/Manager/UploadHero'
import { useProvideYDoc } from '~/composables/context'
import Meta from '~/components/Manager/Meta'
import type { LayoutData } from '~/components/Manager/StylePicker'
import StylePicker from '~/components/Manager/StylePicker'
import { useWorkspaceStore } from '~/stores/workspace'
import { UploadImage } from '~/graphql-operations'
import { useUnsplashPicker, useUploadImage } from '~/composables'
import { filterHTMLTag } from '~/utils'
import { useSiteStore } from '~/stores/site'
import { useMeStore } from '~/stores/me'
import { useSearchConditionStore } from '~/stores/search-condition'
import { initDragPoint } from '~/components/Manager/UploadHero/setting'
import { useRemoteDialog } from '~/modules/editor/remote-dialog/composite'
import { Flags, useWhenFeatureEnabled } from '~/lib/feature-flag'
import { useCommentYdocStore } from '~/pages/[clientID]/articles/[id]/edit/store/comment'
import { sendLog } from '~/utils/axiom-log'
import { useEffectRuntime } from '~/effects'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

sendTrackUnchecked('editor_view', {
  article_id: props.id,
})

useHead({
  bodyAttrs: { class: 'bg-stone-50 dark:bg-stone-900' },
})

const siteStore = useSiteStore()
const meStore = useMeStore()
const editorState = useEditorState()
const editorStore = useEditorStore()
const commentState = useCommentYdocStore()
const workspaceStore = useWorkspaceStore()
const online = useOnline()

const uploadImage = useUploadImage()
const { open } = useUnsplashPicker()
const route = useRoute()
const router = useRouter()
const { href: previewPath } = router.resolve({
  path: `/${route.params.clientID}/articles/${route.params.id}/preview`,
  query: { channel: channelId },
})
const ydoc = new Y.Doc()

useWhenFeatureEnabled(Flags.OfflineEditor, () => {
  const runtime = useEffectRuntime()
  pipe(
    Effect.async<void>((emit) => {
      const provider = new IndexeddbPersistence(`${route.params.clientID}-${route.params.id}`, ydoc)
      provider.on('synced', () => {
        editorStore.deferredGetIndexedDB.resolve()
        emit(Effect.void)
      })
    }),
    // probably shouldn't longer then 1s
    Effect.timeout(1000),
    Effect.catchAll(() => {
      // IndexedDB not initialized in 1s
      Sentry.captureException(new Error('indexed db not initialized'))
      sendTrack('ydoc_indexeddb_timeout')
      // force start
      editorStore.deferredGetIndexedDB.resolve()
      return Effect.void
    }),
    Effect.catchAllDefect((defect) => {
      Sentry.captureException(
        defect instanceof Error ? defect : new Error('unknown error when init indexeddb', { cause: defect }),
      )
      // force start
      editorStore.deferredGetIndexedDB.resolve()
      return Effect.void
    }),
    runtime.runPromise,
  )
})

const editingColumn = ref('')
const formModel = ref({ ...initFormModel, tags: [], authors: [] } as FormModel)
const ignoreFormModel = ref(initIgnoreFormModel)
const articleModel = ref<Article>(initArticle)
const userDevice = ref(deviceType.desktop)
const editorWrapper = ref()
const hasProseInit = ref({
  loaded: false,
  title: false,
  blurb: false,
})
const hasUpdated = ref(true)
const titleLoaded = ref(false)
const networkReconnecting = ref(false)

const { titleLinter } = useLinter()
const { layoutsResult, customLayouts } = useLayouts()
const {
  mutateSeo,
  mutateAutoPosting,
  mutateColumn,
  mutateCover,
  mutateCoverCrop,
  mutateOgImage,
  mutateHasSlug,
  mutateAll,
  saveClickedCustomLayout,
  apiSaved,
} = useUpdate(props.id, formModel)
const ydocCover = ydoc.getMap('cover') as Y.Map<TCover>
const showCover = ref<TCover>({
  url: '',
  alt: '',
  caption: '',
  crop: initDragPoint,
})
ydocCover.observe(() => {
  const getYdocCover = ydocCover.get('cover') as TCover

  showCover.value = getYdocCover || {
    url: '',
    alt: '',
    caption: '',
    crop: initDragPoint,
  }

  formModel.value.coverUrl = showCover.value.url
  formModel.value.coverAlt = showCover.value.alt
  formModel.value.coverCaption = showCover.value.caption
  formModel.value.coverCrop = showCover.value.crop
})

const { watchAll, initLoading, previewData, userList } = useWatch(props.id, formModel, ignoreFormModel, articleModel)

const { setPreviewStore, setCustomPreviewStore, isPreview, previewChange } = usePreview(
  props.id,
  formModel,
  previewData,
  initLoading,
)
const { publishArticle, unpublishArticle, buildArticle, sendEmail } = usePublish(
  props.id,
  formModel,
  hasUpdated,
  changeArticleSetApiSaved,
)

const { checkLoadTime } = usePerformance()

watch(isPreview, (previewMode) => {
  const event = previewMode ? 'editor_preview_opened' : 'editor_preview_closed'
  sendTrackUnchecked(event, { article_id: props.id })
})

const avatars = computed((): Avatar[] => {
  let avatars = editorState.state.clients
    .filter((client) => client.user.id)
    .map((client) => ({ ...client.user, src: client.user.avatar }))
  avatars = uniqBy(avatars, 'id')

  return avatars
})

whenever(avatars, (newVal, oldVal) => {
  const newUsersSet = new Set(newVal.map(({ id }) => id))
  const oldUsersSet = new Set((oldVal as Avatar[]).map(({ id }) => id))

  const isEqualSet = isEqual(newUsersSet, oldUsersSet)
  if (isEqualSet || newUsersSet.size <= 1) return

  sendTrackUnchecked('editor_online_users', {
    article_id: props.id,
    user_count: newUsersSet.size,
  })
})

useProvideYDoc(ydoc)
commentState.SET_YDOC(ydoc)

function ydocTransaction() {
  const check = (field: string) => ydoc.getXmlFragment(field)._start
  hasProseInit.value.loaded = Boolean(check('title') || check('blurb')) || ydoc._observers.size > 2
  hasProseInit.value.title = Boolean(check('title'))
  hasProseInit.value.blurb = Boolean(check('blurb'))
}

const isLoading = computed(() => initLoading.value || !hasProseInit.value.loaded)
const allSaved = computed(() => {
  return Boolean(editorState.state.saved && apiSaved.value)
})

let updateMounted = false
const cleanup = useEventListener(editorWrapper, 'click', () => {
  updateMounted = true
  cleanup()
})

watch(
  () => editorState.state.saved,
  (saved) => {
    if (!updateMounted) return
    if (!saved) {
      hasUpdated.value = false
      return
    }
    sendEditorLog('content')
  },
)

function sendEditorLog(field: string) {
  if (!formModel.value.published || !updateMounted) return

  sendLog({
    type: 'info',
    edit_field: field,
    user_id: meStore.me?.id,
    client_id: route.params.clientID,
    article_id: props.id,
  })
}

onMounted(() => {
  siteStore.fetchSiteSubscription()
  siteStore.fetchSite()
  ydoc.on('update', ydocTransaction)
})

onUnmounted(() => {
  ydoc.off('update', ydocTransaction)
})

useHead({
  title: computed(
    () =>
      `${truncate(filterHTMLTag(ignoreFormModel.value.title), { length: 20 })} - ${
        workspaceStore.currentWorkspace?.name ?? ''
      } - Storipress`,
  ),
})

const isMobile = useMediaQuery('(max-width: 768px)')
const articleUrlPrefix = computed(() => {
  const domain = siteStore.site?.customer_site_domain
  return isMobile.value ? '/' : `${domain}/posts/`
})

function editDesign(id: string) {
  location.href = withQuery(`/builder/${route.params.clientID}/article/${id}`, { return_url: route.fullPath })
}

function editing(column: string) {
  editingColumn.value = column
}

function changeTitle(value: FormModel['title']) {
  titleLoaded.value = true
  ignoreFormModel.value.title = value
  // Because title changed doesn't change formModel, we need to manually trigger linter instead of triggering linter in useWatch
  titleLinter(value as string)
}

function changeBlurb(value: FormModel['blurb']) {
  ignoreFormModel.value.blurb = value
}

function changeArticleSetApiSaved<K extends keyof FormModel>(value: FormModel[K], column: K) {
  apiSaved.value = false
  formModel.value[column] = value
}

function changeArticleSetUpdated<K extends keyof FormModel>(value: FormModel[K], column: K) {
  hasUpdated.value = false
  formModel.value[column] = value
}

function changeArticle<K extends keyof FormModel>(value: FormModel[K], column: K) {
  formModel.value[column] = value
}

async function addCover(uploadFile: File) {
  apiSaved.value = false
  const { url, width, height, key } = await uploadImage({
    id: props.id,
    file: uploadFile,
    type: UploadImage.ArticleHeroPhoto,
  })
  const getYdocCover = ydocCover.get('cover') as TCover
  ydocCover.set('cover', {
    url: url ?? '',
    alt: getYdocCover?.alt ?? '',
    caption: getYdocCover?.caption ?? '',
    crop: { ...initDragPoint, realWidth: width, realHeight: height, key: key ?? '' },
  })
  mutateCover(url, formModel.value.coverAlt, formModel.value.coverCaption)
  changeArticle(url, 'coverUrl')
  changeArticle({ ...initDragPoint, realWidth: width, realHeight: height, key: key ?? '' }, 'coverCrop')
  return url
}

function changeCover<K extends keyof FormModel>(value: FormModel[K], column: K, ydocColumn: string) {
  const getYdocCover = ydocCover.get('cover') as TCover
  ydocCover.set('cover', {
    ...getYdocCover,
    [ydocColumn]: value,
  })
  if (column === 'coverCaption') {
    changeArticleSetUpdated(value, column)
  } else {
    changeArticle(value, column)
  }
}
async function callUnsplash() {
  const res = await open()
  if (!res) {
    return false
  }

  mutateCover(res.src, res.alt, res.title)
  changeArticle(res.src, 'coverUrl')
  changeArticle(res.alt, 'coverAlt')
  changeArticle(res.title, 'coverCaption')
  changeArticle({ ...initDragPoint }, 'coverCrop')

  ydocCover.set('cover', {
    url: res.src,
    alt: res.alt,
    caption: res.title,
    crop: initDragPoint,
  })

  return true
}

function removeCover() {
  ydocCover.set('cover', {
    url: '',
    alt: '',
    caption: '',
    crop: initDragPoint,
  })
  changeArticle('', 'coverUrl')
  changeArticle('', 'coverAlt')
  changeArticle('', 'coverCaption')
  mutateCover('', '', '')
}

function updateCoverAlt(alt: string) {
  mutateCover(formModel.value.coverUrl, alt, formModel.value.coverCaption)
}

function updateCoverCaption(caption: string) {
  mutateCover(formModel.value.coverUrl, formModel.value.coverAlt, caption)
}

async function updateOgImage(e: Event | undefined) {
  if (!e) {
    changeArticle('', 'socialImageUrl')
    mutateOgImage('')
    return ''
  } else {
    apiSaved.value = false
    const target = e.target as HTMLInputElement
    const uploadFile = target?.files?.[0]
    if (!uploadFile) {
      const { open } = useRemoteDialog('error-notification')
      open({ type: 'imageUpload' })
      return ''
    }
    const { url } = await uploadImage({ id: props.id, file: uploadFile, type: UploadImage.ArticleSeoImage })
    changeArticle(url, 'socialImageUrl')
    mutateOgImage(url)
    return url
  }
}

function clickLayout(id: string, template: string, data: LayoutData) {
  formModel.value.previewId = id
  setPreviewStore(template, data)
  mutateColumn(id, 'layoutId')
}

function clickCustomLayout(id: string, url: string) {
  formModel.value.previewId = id
  saveClickedCustomLayout(id)
  setCustomPreviewStore(url)
}

function changeDevice(device: deviceType) {
  userDevice.value = device
}

function buildOrPublish() {
  return formModel.value.published ? buildArticle() : publishArticle()
}

watchAll(avatars)
useUnload(allSaved, mutateAll)
useIdleClearEditing(editingColumn)
useProvideFieldStorage(wrapFieldAsStorage(useCustomField(props.id)))
checkLoadTime(isLoading)
watch(online, (nowOnline) => {
  if (nowOnline && networkReconnecting.value) {
    editorStore.SET_RETRY_CONNECT_TIMES(0)
    networkReconnecting.value = false
  } else if (!nowOnline && !networkReconnecting.value) {
    networkReconnecting.value = true
  }
})

watch(hasUpdated, (nowUpdated) => {
  if (isLoading.value && !nowUpdated) {
    Sentry.captureException(new Error('article is updated when it is loading'), (scope) => {
      scope.setContext('formModel', formModel.value)
      return scope
    })
  }
})

const searchConditionStore = useSearchConditionStore()
onBeforeRouteLeave((to) => {
  if ((to.name as string)?.startsWith('clientID-articles')) {
    searchConditionStore.persist = true
  }
})
</script>

<template>
  <div ref="editorWrapper" class="flex h-auto flex-col border-0 bg-stone-50 dark:bg-stone-900">
    <Navbar
      :id="id"
      :form-model="formModel"
      :avatars="avatars"
      :slug="`${articleUrlPrefix}${formModel.slug}`"
      :title="titleLoaded ? ignoreFormModel.title : ''"
      :is-preview="isPreview"
      :user-device="userDevice"
      :article-model="articleModel"
      :has-updated="hasUpdated"
      :ydoc="ydoc"
      :user-list="userList"
      @change-article="changeArticle"
      @update-article="mutateAll"
      @update-auto-posting="mutateAutoPosting"
      @preview-change="previewChange"
      @change-device="changeDevice"
      @publish-article="publishArticle"
      @unpublish-article="unpublishArticle"
      @build-article="buildArticle"
      @send-email="sendEmail"
    />
    <!-- use h-0 w-0 to hide preview page is want to fix firefox bug,
      from this card https://storipress-media.atlassian.net/jira/software/projects/SPMVP/boards/1?selectedIssue=SPMVP-3179 -->
    <div
      v-if="!initLoading"
      class="flex bg-stone-50 dark:bg-stone-900"
      :class="{ 'size-0': !isPreview, 'h-[100vh] min-h-full': isPreview }"
    >
      <div class="mr-1 mt-10 flex w-[85%] items-center justify-center">
        <div class="h-full border-r border-gray-100" :class="deviceWidth[userDevice]">
          <iframe
            class="bg-white dark:bg-stone-900"
            :class="deviceWidth[userDevice]"
            height="100%"
            :src="previewPath"
            data-hj-allow-iframe=""
          />
        </div>
      </div>
      <div v-show="isPreview" class="h-full min-w-[16rem]">
        <StylePicker
          :layout-list="layoutsResult?.layouts || []"
          :custom-layouts="customLayouts || []"
          :preview-id="formModel.previewId"
          @click-layout="clickLayout"
          @click-custom-layout="clickCustomLayout"
          @edit-design="editDesign"
        />
      </div>
    </div>
    <div v-show="!isPreview" class="pb-[60vh]">
      <LoadingPage v-if="isLoading" class="mt-[24rem]" />
      <div v-show="!isLoading" class="flex flex-col px-4 lg:pl-[12vw]">
        <div class="mb-4 flex w-full flex-col md:w-[45rem]">
          <UploadHero
            class="mt-12 pb-4"
            :cover-url="showCover.url"
            :cover-alt="showCover.alt"
            :cover-caption="showCover.caption"
            :cover-crop="showCover.crop"
            :call-unsplash="callUnsplash"
            :add-cover="addCover"
            :remove-cover="removeCover"
            :update-cover-alt="updateCoverAlt"
            :update-cover-caption="updateCoverCaption"
            @change-cover="changeCover"
            @update-article="mutateAll"
            @update-cover-crop="mutateCoverCrop"
          />
          <EditorHeader
            :has-prose-init="hasProseInit"
            :form-model="formModel"
            :ydoc="ydoc"
            :change-title="changeTitle"
            :change-blurb="changeBlurb"
          />
        </div>
        <Meta
          :id="id"
          :form-model="formModel"
          :ignore-form-model="ignoreFormModel"
          :url-prefix="articleUrlPrefix"
          :cover-url="formModel.coverUrl"
          :social-image-url="formModel.socialImageUrl"
          :has-slug="formModel.hasSlug"
          :user-list="userList"
          :update-og-image="updateOgImage"
          :ydoc="ydoc"
          @editing="editing"
          @update-seo="mutateSeo"
          @update-auto-posting="mutateAutoPosting"
          @update-article-column="mutateColumn"
          @update-has-slug="mutateHasSlug"
          @change-article="changeArticle"
          @change-article-set-updated="changeArticleSetUpdated"
        />
        <EditorBody :id="id" :ydoc="ydoc" />
        <ErrorModal />
        <WordCount class="fixed bottom-0 left-0 mx-6 mb-6" />
      </div>
    </div>
    <Unsplash />
    <ColorModeButton class="fixed bottom-0 right-0 mb-5 mr-16 hidden rounded-full p-2 md:block" />
    <Snackbar
      v-if="!online || editorStore.retryConnectTimes > retryConnectTimesLimit"
      class="pointer-events-none"
      icon="internet"
      title="You're offline. Changes won't be saved until you reconnect to the internet."
      type="warning"
    />
    <Snackbar
      v-if="!hasUpdated && formModel.published"
      class="custom-snackbar"
      icon="warning"
      title="There are some changes to this article which are not live"
      button-text="Update changes"
      type="warning"
      @button-click="buildOrPublish"
    />
  </div>
</template>

<style lang="scss" scoped>
:deep .custom-snackbar {
  @apply pointer-events-none;
  button {
    @apply pointer-events-auto;
  }
}
</style>
