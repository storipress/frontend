import type { Ref } from 'vue'
import { NOTIFICATION_KEY } from '@storipress/core-component'
import type { NotificationFactory } from '@storipress/core-component'
import type { FormModel } from '../types'
import { usePublishArticleStore } from '~/pages/[clientID]/articles/[id]/edit/store/publish'
import { usePublishArticle, useUnpublishArticle } from '~/composables'
import {
  GetArticleInfoDocument,
  ReleaseType,
  SendArticleNewsletterDocument,
  TriggerSiteBuildDocument,
} from '~/graphql-operations'
import { polling } from '~/utils/schedule'

export function usePublish(
  id: string,
  formModel: Ref<FormModel>,
  hasUpdated: Ref<boolean>,
  changeArticleSetApiSaved: <K extends keyof FormModel>(value: FormModel[K], column: K, ignoreUpdate?: boolean) => void,
) {
  const mutatePublishArticle = usePublishArticle()
  const mutateUnpublishArticle = useUnpublishArticle()
  const publishArticleStore = usePublishArticleStore()
  const { mutate: mutateTriggerSiteBuild } = useMutation(TriggerSiteBuildDocument)
  const { mutate: mutateSendArticleNewsletter } = useMutation(SendArticleNewsletterDocument)
  const notifications = inject(NOTIFICATION_KEY) as NotificationFactory
  const updateArticleInfo = useUpdateArticleInfo(id)

  function sendEmail() {
    mutateSendArticleNewsletter({ articleId: id })
    changeArticleSetApiSaved(true, 'newsletterAt')
  }

  function buildArticle() {
    publishArticleStore.SET_SEND_BUILD_STATELESS(true)
  }

  async function publishArticle() {
    publishArticleStore.SET_SEND_PUBLISH_STATELESS(true)
  }

  whenever(
    () => publishArticleStore.callBuildArticle,
    async () => {
      mutateTriggerSiteBuild({ input: { id, type: ReleaseType.Article } })
      notifications({
        title: 'Changes updated',
        type: 'primary',
        iconName: 'refresh',
        content: 'Site build triggered. Wait 3-5 mins for the article to go live.',
      })
      hasUpdated.value = true
      publishArticleStore.SET_SEND_BUILD_STATELESS(false)
      publishArticleStore.SET_CALL_BUILD_ARTICLE(false)
    },
  )

  whenever(
    () => publishArticleStore.callPublishArticle,
    async () => {
      const date = new Date()
      if (
        await mutatePublishArticle(
          {
            id,
            time: date,
            now: true,
          },
          true,
          'editor',
        )
      ) {
        updateArticleInfo()
        if (formModel.value.newsletter && !formModel.value.newsletterAt) {
          changeArticleSetApiSaved(true, 'newsletterAt')
          notifications({
            title: 'Email = blasted',
            type: 'primary',
            iconName: 'email',
            content: 'Article will be emailed to subscribers.',
          })
        }
        changeArticleSetApiSaved(true, 'published')
        hasUpdated.value = true
      }
      publishArticleStore.SET_SEND_PUBLISH_STATELESS(false)
      publishArticleStore.SET_CALL_PUBLISH_ARTICLE(false)
    },
  )

  async function unpublishArticle() {
    if (
      await mutateUnpublishArticle(
        {
          id,
        },
        true,
      )
    ) {
      changeArticleSetApiSaved(false, 'published')
    }
  }

  return { publishArticle, unpublishArticle, buildArticle, sendEmail }
}

export function useUpdateArticleInfo(id: string) {
  const { refetch, load } = useLazyQuery(GetArticleInfoDocument, { id }, { fetchPolicy: 'network-only' })

  return () =>
    polling({
      delay: 500,
      limit: 2,
      callback: async () => {
        load()
        await refetch()
      },
    })
}
