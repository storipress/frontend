<script lang="ts" setup>
import { noop } from 'lodash-es'
import { maps } from '@block/blocks'
import { getImageDataUrl } from '@block/utils/linear-gradients'
import Preview from './components/preview.vue'
import type { ArticleData, SetDataPayload } from './types'
import type { StyleTree } from '~/lib/dynamic-style'
import { useStyleTree } from '~/lib/dynamic-style'
import { GetPagesDocument, GetSiteDocument, ListDesksDocument, ScraperDocument } from '~/graphql-operations'

const urlParams = new URLSearchParams(window.location.search)
const token = urlParams.get('token') ?? ''
const { result: scraperResult, loading: loadingScraper } = useQuery(ScraperDocument, { token })
const { result: pagesResult, loading: loadingPages } = useQuery(GetPagesDocument)
const { result: siteResult, loading: loadingSite } = useQuery(GetSiteDocument)
const { result: listDesksResult, loading: loadingListDesks } = useQuery(ListDesksDocument)
const currentArticle = ref(0)

const baseTree = useStyleTree()

const tree = ref<StyleTree>({
  name: 'preview',
  styles: {},
  children: {},
})

const logoUrl = computed(
  () => JSON.parse(scraperResult.value?.scraper?.articles?.data?.[0]?.data ?? '{}').publicationLogo,
)

const blockAPI = reactive({
  // 以下資料請使用 publication 的

  // pages query 的資料
  pages: [
    {
      id: '1',
      name: 'About us',
      slug: '#',
    },
  ],
  // desks 的資料
  desks: [
    {
      id: '1',
      name: 'Desk',
      slug: '#',
    },
  ],
  // site 的資料
  site: {
    name: 'Site name',
  },

  // 確定會需要實作的 API
  dataSource: {
    useDataSource: () => {
      const currentIndex = currentArticle.value
      const article = scraperResult.value?.scraper?.articles?.data?.[currentIndex]
      if (!article?.data) {
        return ref({
          title: '',
          headline: '',
          desk: '',
          deskUrl: '#',
          authors: [],
          blurb: '',
          url: '#',
          time: new Date(),
        })
      }

      const {
        articleTitle,
        articleSubheading,
        heroPhoto,
        publishDate,
        articleCategory,
        authorName,
        description,
        ogDescription,
      }: ArticleData = JSON.parse(article.data)

      const time = Number.isNaN(new Date(publishDate ?? '').getTime())
        ? (publishDate as string)
        : new Date(publishDate as string)

      const data = computed(() => ({
        title: articleTitle ?? '',
        blurb: description ?? ogDescription ?? '',
        headline: heroPhoto || getImageDataUrl(),
        headlineCaption: articleSubheading ?? '',
        url: '#',
        time,
        authors: [{ name: authorName, url: '#' }],
        desk: articleCategory ?? '',
        deskUrl: '#',
      }))

      currentArticle.value++

      return data
    },
  },
  setElementStyle({ path, data, breakpoint = 'xs' }: SetDataPayload<Record<string, unknown>>) {
    baseTree.insertToTree(path, data, breakpoint)
    tree.value = baseTree.tree.value
  },

  // 這幾個是讓 block 用來放資料用的，可能會需要實作，這個 task 先不實作，如果頁面顯示有問題請跟 David 反應
  texts: reactive({}),
  images: reactive({
    'b-psyche-1': {
      logo: logoUrl.value ?? 'https://assets.stori.press/storipress/sp-placeholder.svg',
    },
  }),
  setElementText: noop,
  setElementImage: noop,
  setSpacing: noop,

  // 只需要顯示 preview 時固定的資料與 API
  scale: 1,
  version: 0,
  selectedElement: null,
  hoveredElement: null,
  insertPoint: {},
  blocks: ['psyche-1', 'aeon-one'],
  blockStates: {},
  highlightedBlock: null,
  selectedBlock: null,
  isPreview: true,
  isPreviewHtml: false,
  uploadImage: noop,
  readStyle: noop,
  addColor: noop,
  addDesk: noop,
  setIsPreviewHtml: noop,
  setElementHover: noop,
  setElementSelect: noop,
  setInsert: noop,
  setSelectedBlock: noop,
  setImageSwapInfo: noop,
})

watchEffect(() => {
  // pages query 的資料
  if (pagesResult.value?.pages?.length) {
    blockAPI.pages = pagesResult.value?.pages.map(({ id, title }) => ({ id, name: title, slug: '#' }))
  }

  // desks 的資料
  if (listDesksResult.value?.desks?.length) {
    blockAPI.desks = listDesksResult.value?.desks.map(({ id, name, slug }) => ({ id, name, slug }))
  }

  // site 的資料
  if (siteResult.value?.site?.name) {
    blockAPI.site = { name: siteResult.value?.site?.name }
  }
})

provide('$element', blockAPI)

const isLoading = computed(
  () => loadingScraper.value || loadingPages.value || loadingSite.value || loadingListDesks.value,
)

const ready = computed(() => !isLoading.value && scraperResult.value?.scraper)
</script>

<template>
  <Preview v-if="ready" :style-tree="tree" class="overflow-x-hidden">
    <component :is="maps['psyche-1']" :block="{ id: 'psyche-1' }" />
    <component :is="maps['aeon-one']" :block="{ id: 'aeon-one' }" />
  </Preview>
</template>
