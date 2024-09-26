export interface PartialStage {
  ready: boolean
}

export interface ArticleLike {
  published: boolean
  stage: PartialStage
}

export function isPublished(article: ArticleLike): boolean {
  return article.published && article.stage.ready
}
