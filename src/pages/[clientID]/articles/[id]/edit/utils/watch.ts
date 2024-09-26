import { ref } from 'vue'
import type { Ref } from 'vue'
import * as Sentry from '@sentry/vue'
import { codeNotifcationMapping } from '../setting'
import type { Article, Author, Avatar, FormModel, IgnoreFormModel, TCoverCrop, Tag } from '../types'
import { usePermission } from './permission'
import type { PreviewData } from './types'
import { getCustomLayout, getLayoutId, getMetaPreviewId } from './utils'
import { transAutoPosting, transCover, transDesk, transSeo, useLayouts, useLinter } from '.'
import {
  ArticlePlan,
  GetArticleDocument,
  GetArticleMetafieldDocument,
  ListSimpleUsersDocument,
} from '~/graphql-operations'
import { useQuery } from '~/lib/apollo'
import { createStyleTree } from '~/lib/dynamic-style'
import { useSiteStore } from '~/stores/site'
import { useProviderStore } from '~/stores/preview-provider'
import { Flags } from '~/lib/feature-flag'
import { useNotification } from '~/composables'
import { useEditorNotificationStore } from '~/stores/editor-notification'
import { useEditorStore } from '~/stores/editor'
export interface ArticleLayout {
  layout?: {
    id: string
  } | null
  desk?: {
    layout?:
      | {
          id: string
        }
      | undefined
      | null
    desk?:
      | {
          layout?:
            | {
                id: string
              }
            | undefined
            | null
        }
      | undefined
      | null
  }
}

export function useWatch(
  id: string,
  formModel: Ref<FormModel>,
  ignoreFormModel: Ref<IgnoreFormModel>,
  articleModel: Ref<Article>,
) {
  const { result: nowArticleResult, loading: nowArticleLoading } = useQuery(GetArticleDocument, {
    id,
  })
  const { result: usersListResult } = useQuery(ListSimpleUsersDocument)
  const userList = computed(() => usersListResult.value)

  const { result: articleMetafieldResult } = useFeatureFlaggedQuery(Flags.CustomSite, GetArticleMetafieldDocument, {
    id,
  })
  const siteStore = useSiteStore()
  const { layouts, layoutsResult, customLayouts } = useLayouts()
  const { titleLinter, coverLinter } = useLinter()
  const router = useRouter()
  const route = useRoute()
  const store = useProviderStore()
  const editorStore = useEditorStore()

  const previewData: PreviewData = {
    id: ref(''),
    templateInfo: ref({ template: '', data: { elements: {}, styles: createStyleTree() } }),
  }

  function changeFormModel<K extends keyof FormModel>(value: FormModel[K], column: K) {
    formModel.value[column] = value
  }

  const initWatch = () => {
    watchOnce(nowArticleResult, (articleResult) => {
      if (!articleResult?.article) {
        router.push(`/${route.params.clientID}/articles/desks/all`)
        return
      }

      const { seo, tags, authors, cover, stage, desk, auto_posting, newsletter_at, ...restValues } =
        articleResult?.article
      const seoTrans = transSeo(seo)
      const coverTrans = transCover(cover)
      const deskTrans = transDesk(desk)
      const autoPostTrans = transAutoPosting(auto_posting)
      const newResult = {
        ...restValues,
        ...seoTrans,
        ...coverTrans,
        ...deskTrans,
        ...autoPostTrans,
        newsletterAt: newsletter_at,
      } as Record<string, string | null | boolean | ArticlePlan | TCoverCrop | Tag[] | Author[]>

      Object.keys(newResult).forEach((key) => {
        changeFormModel(newResult[key], key as keyof FormModel)
      })

      articleModel.value = {
        ...articleModel.value,
        stage,
        desk: { id: desk.id },
      }

      ignoreFormModel.value.title = restValues.title
      ignoreFormModel.value.blurb = restValues.blurb
      formModel.value.draft = stage.default
      formModel.value.navColor = stage.color
      formModel.value.tags = tags.map((tag) => ({ id: tag.id, name: tag.name }))
      formModel.value.authors = authors.map((author) => ({
        id: author.id,
        email: author.email,
        name: author.full_name || author.email,
        avatar: author.avatar,
      }))
      editorStore.deferredGetArticle.resolve()
    })
  }

  const previewWatch = () => {
    const defaultLayoutId = computed(() => {
      // only start find default layout when data loaded
      if (!nowArticleResult.value || !layoutsResult.value) {
        return ''
      }

      return getLayoutId(nowArticleResult.value.article, layouts.value)
    })

    const defaultCustomLayout = computed(() => {
      if (!customLayouts.value) {
        return { name: '', url: '' }
      }
      return getCustomLayout(customLayouts.value)
    })

    // for subscribe update
    watch(
      formModel.value,
      (newFormModel) => {
        if (!newFormModel.previewId) {
          if (defaultCustomLayout.value?.name) {
            previewData.id.value = defaultCustomLayout.value?.name
          } else if (defaultLayoutId.value) {
            previewData.id.value = defaultLayoutId.value
          }
        }
      },
      { deep: true },
    )

    const userCustomLayout = computed((): { name: string; url: string } | undefined => {
      const metaPreviewId = getMetaPreviewId(articleMetafieldResult)
      if (metaPreviewId) {
        const url = (store.customLayoutUrl = customLayouts.value?.find((item) => item.name === metaPreviewId)?.url)
        if (url) {
          return {
            name: metaPreviewId,
            url,
          }
        }
      }

      return defaultCustomLayout.value
    })

    whenever(userCustomLayout, ({ name, url }) => {
      previewData.id.value = name
      store.isCustomLayout = true
      store.customLayoutUrl = url
    })

    whenever(defaultLayoutId, (id) => {
      if (formModel.value.previewId || formModel.value.previewId === id || defaultCustomLayout.value?.name) {
        return
      }
      previewData.id.value = id
    })
  }

  const linterWatch = (avatars: Ref<Avatar[]>) => {
    function formToArticle() {
      const { id, title } = formModel.value
      articleModel.value = {
        ...articleModel.value,
        id,
        title,
        authors: avatars.value.map((avatar: Avatar) => ({
          id: avatar.id,
          name: avatar.name,
          avatar: avatar.src,
        })),
      }
    }
    // if formModel is changed, update the linterStore and article
    // title changed will not trigger watch, because title change doesn't set formModel
    watch(
      formModel.value,
      (newFormModel) => {
        titleLinter(newFormModel?.title)
        coverLinter(newFormModel?.coverUrl)
        formToArticle()
      },
      {
        deep: true,
      },
    )
  }

  const subscriptionWatch = () => {
    const subscription = computed(() => {
      return siteStore?.subscription
    })
    watch(subscription, (newSubscrition) => {
      if (formModel.value.plan === 'subscriber' && newSubscrition === false) {
        formModel.value.plan = ArticlePlan.Member
      }
    })
  }

  const notificationWatch = () => {
    const editorNotification = useEditorNotificationStore()
    const { create: notifications } = useNotification()

    watch(
      () => editorNotification.errorCode,
      (code) => {
        if (code === 0) return
        Sentry.captureException(new Error(editorNotification.errorContent))
        if (codeNotifcationMapping[code as keyof typeof codeNotifcationMapping]) {
          notifications({
            title: 'Error',
            type: 'warning',
            iconName: 'warning',
            content: codeNotifcationMapping[code as keyof typeof codeNotifcationMapping],
          })
        } else {
          notifications({
            title: 'Error',
            type: 'warning',
            iconName: 'warning',
            content: 'Internal error.',
          })
        }
      },
    )
  }

  const checkEdit = () => {
    const article = computed(() => ({
      id: formModel.value.id,
      authors: formModel.value.authors.map((author) => ({ id: author.id })),
      desk: { id: formModel.value.deskId },
    }))

    watchEffect(() => {
      if (!usePermission(article).value) {
        router.push(`/${route.params.clientID}/articles/desks/all`)
      }
    })
  }

  const watchAll = (avatars: Ref<Avatar[]>) => {
    initWatch()
    previewWatch()
    linterWatch(avatars)
    subscriptionWatch()
    checkEdit()
    notificationWatch()
  }

  return {
    watchAll,
    initLoading: nowArticleLoading,
    previewData,
    userList,
  }
}
