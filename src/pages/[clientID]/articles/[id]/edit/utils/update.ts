import { debounce } from 'lodash-es'
import type { Ref } from 'vue'
import { debounceLimit } from '../setting'
import type { FormModel } from '../types'
import { initUser } from './init'
import {
  CreateCustomFieldDocument,
  CreateCustomFieldGroupDocument,
  CreateCustomFieldValueDocument,
  CustomFieldGroupType,
  CustomFieldType,
  GetArticleMetafieldDocument,
  UpdateArticleDocument,
  UpdateCustomFieldValueDocument,
} from '~/graphql-operations'
import type { UpdateArticleMutationVariables } from '~/graphql-operations'
import { useMutation } from '~/lib/apollo'
import { createBatch } from '~/lib/batch'
import { useLinterStore } from '~/stores/linter'
import { Flags } from '~/lib/feature-flag'
import type { SEO } from '~/schema/seo'

export function useUpdate(id: string, formModel: Ref<FormModel>) {
  const { mutate: mutateUpdateArticle } = useMutation(UpdateArticleDocument)
  const { mutate: createCustomFieldGroup } = useMutation(CreateCustomFieldGroupDocument)
  const { mutate: createCustomFieldMutation } = useMutation(CreateCustomFieldDocument)
  const { mutate: createCustomFieldValueMutate } = useMutation(CreateCustomFieldValueDocument)
  const { mutate: updateCustomFieldValueMutate } = useMutation(UpdateCustomFieldValueDocument)
  const { TWuser, FBuser, LNuser } = initUser()

  const { result: articleMetafieldResult, refetch: refetchArticleMetafield } = useFeatureFlaggedQuery(
    Flags.CustomSite,
    GetArticleMetafieldDocument,
    {
      id,
    },
  )
  const { batchUpdate, completed } = createBatch<UpdateArticleMutationVariables>(mutateUpdateArticle)
  const linterStore = useLinterStore()

  const mutateSeo = debounce(() => {
    batchUpdate({
      id,
      seo: JSON.stringify(readSEOFromFormModel(formModel.value)),
    })
  }, debounceLimit)

  const mutateAutoPosting = debounce(() => {
    const { FBPageId, FBEnable, FBText, TWUserId, TWEnable, TWText, slackText, LNAuthorId, LNText, LNEnable } =
      formModel.value
    if (linterStore.issues.TWText) return
    batchUpdate({
      id,
      autoPosting: JSON.stringify({
        facebook: {
          page_id: FBPageId || FBuser.value.id,
          enable: FBEnable,
          text: FBText,
        },
        twitter: {
          user_id: TWUserId || TWuser.value.id,
          enable: TWEnable,
          text: TWText,
        },
        linkedin: {
          author_id: LNAuthorId || LNuser.value.id,
          enable: LNEnable,
          text: LNText,
        },
        slack: {
          text: slackText,
        },
      }),
    })
  }, debounceLimit)

  const mutateHasSlug = debounce(() => {
    batchUpdate({
      id,
      seo: JSON.stringify(readSEOFromFormModel(formModel.value)),
    })
  }, debounceLimit)

  function mutateCover(url: string, alt: string, caption: string) {
    const { coverCrop } = formModel.value
    batchUpdate({
      id,
      cover: JSON.stringify({
        url,
        alt,
        caption,
        crop: coverCrop,
      }),
    })
  }

  function mutateCoverCrop() {
    const { coverUrl, coverAlt, coverCaption, coverCrop } = formModel.value
    batchUpdate({
      id,
      cover: JSON.stringify({
        url: coverUrl,
        alt: coverAlt,
        caption: coverCaption,
        crop: coverCrop,
      }),
    })
  }

  function mutateOgImage(ogImage: string) {
    batchUpdate({
      id,
      seo: JSON.stringify({
        ...readSEOFromFormModel(formModel.value),
        ogImage,
      }),
    })
  }

  function mutateAll() {
    const { coverUrl, coverAlt, coverCaption, coverCrop, slug, plan, newsletter } = formModel.value

    batchUpdate({
      id,
      slug,
      plan,
      seo: JSON.stringify(readSEOFromFormModel(formModel.value)),
      cover: JSON.stringify({
        url: coverUrl,
        alt: coverAlt,
        caption: coverCaption,
        crop: coverCrop,
      }),
      newsletter,
    })
  }

  async function saveClickedCustomLayout(layoutId: string) {
    const articleId = id
    if (articleMetafieldResult.value?.article?.metafields) {
      const metafields = articleMetafieldResult.value.article.metafields
      for (const { group, values, id } of metafields) {
        if (group.key === '__layoutmeta') {
          const filedId = values?.[0]?.id
          if (filedId) {
            await updateCustomFieldValueMutate({
              input: {
                id: filedId,
                value: layoutId,
              },
            })
          } else {
            await createCustomFieldValueMutate({
              input: {
                id,
                target_id: articleId,
                value: layoutId,
              },
            })
          }
          refetchArticleMetafield()

          return
        }
      }
    }

    const result = await createCustomFieldGroup({
      input: {
        key: '__layoutmeta',
        type: CustomFieldGroupType.ArticleMetafield,
        name: '__layoutmeta',
        description: 'layout setting',
      },
    })

    if (result?.data?.createCustomFieldGroup) {
      const { id } = result.data.createCustomFieldGroup
      const filedResult = await createCustomFieldMutation({
        input: {
          custom_field_group_id: id,
          name: 'layoutId',
          key: 'layoutid',
          description: '',
          type: CustomFieldType.Text,
          options: JSON.stringify({
            type: 'text',
            required: false,
            repeat: false,
            multiline: false,
            min: null,
            max: null,
            regex: null,
          }),
        },
      })

      const filedId = filedResult?.data?.createCustomField.id
      if (filedId) {
        await createCustomFieldValueMutate({
          input: {
            id: filedId,
            target_id: articleId,
            value: layoutId,
          },
        })
      }
      refetchArticleMetafield()
    }
  }

  const mutateColumn = debounce((value: string, column: string) => {
    batchUpdate({
      id,
      [column]: value,
    })
  }, debounceLimit)

  return {
    mutateSeo,
    mutateAutoPosting,
    mutateHasSlug,
    mutateCover,
    mutateCoverCrop,
    mutateOgImage,
    mutateAll,
    mutateColumn,
    saveClickedCustomLayout,
    apiSaved: completed,
  }
}

export function readSEOFromFormModel(formModel: FormModel): SEO {
  const { searchTitle, searchDescription, socialTitle, socialDescription, socialImageUrl, hasSlug } = formModel

  return {
    meta: { title: searchTitle, description: searchDescription },
    og: { title: socialTitle, description: socialDescription },
    ogImage: socialImageUrl,
    hasSlug,
  }
}
