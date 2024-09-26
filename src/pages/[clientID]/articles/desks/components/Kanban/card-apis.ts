import {
  ChangeArticleStageDocument,
  CreateStageDocument,
  DeleteArticleDocument,
  DeleteStageDocument,
  DuplicateArticleDocument,
  MoveArticleAfterDocument,
  MoveArticleBeforeDocument,
  MoveArticleToDeskDocument,
  PublishArticleDocument,
  RestoreArticleDocument,
  SortArticleByDocument,
  UnpublishArticleDocument,
  UpdateArticleDocument,
  UpdateStageDocument,
} from '~/graphql-operations'

export type CardAPI = ReturnType<typeof useCardRelatedAPI>

export function useCardRelatedAPI() {
  const { mutate: mutateChangeArticleStage } = useMutation(ChangeArticleStageDocument)
  const { mutate: _mutatePublishArticle } = useMutation(PublishArticleDocument)
  const mutatePublishArticle = async (...args: Parameters<typeof _mutatePublishArticle>) => {
    const result = await _mutatePublishArticle(...args)
    sendTrackUnchecked('tenant_article_scheduled', {
      source: 'kanban',
      article_id: args[0]?.id,
      now: Boolean(args[0]?.now),
    })
    return result
  }
  const { mutate: mutateUnpublishArticle } = useMutation(UnpublishArticleDocument)
  const { mutate: mutateMoveArticleBefore } = useMutation(MoveArticleBeforeDocument)
  const { mutate: mutateMoveArticleAfter } = useMutation(MoveArticleAfterDocument)
  const { mutate: mutateUpdateArticle } = useMutation(UpdateArticleDocument)
  const { mutate: mutateDeleteArticle } = useMutation(DeleteArticleDocument)
  const { mutate: mutateRestoreArticle } = useMutation(RestoreArticleDocument)
  const { mutate: mutateDuplicateArticle } = useMutation(DuplicateArticleDocument)
  const { mutate: mutateSortArticleBy } = useMutation(SortArticleByDocument)
  const { mutate: mutateCreateStage } = useMutation(CreateStageDocument)
  const { mutate: mutateUpdateStage } = useMutation(UpdateStageDocument)
  const { mutate: mutateDeleteStage } = useMutation(DeleteStageDocument, {
    update(cache, result) {
      if (result?.data?.deleteStage) {
        const normalizedId = cache.identify(result?.data?.deleteStage)
        cache.evict({ id: normalizedId })
        cache.gc()
      }
    },
  })
  const { mutate: mutateMoveArticleToDesk } = useMutation(MoveArticleToDeskDocument)
  return {
    mutateChangeArticleStage,
    mutatePublishArticle,
    mutateUnpublishArticle,
    mutateMoveArticleBefore,
    mutateMoveArticleAfter,
    mutateUpdateArticle,
    mutateDeleteArticle,
    mutateRestoreArticle,
    mutateDuplicateArticle,
    mutateSortArticleBy,
    mutateCreateStage,
    mutateUpdateStage,
    mutateDeleteStage,
    mutateMoveArticleToDesk,
  }
}
