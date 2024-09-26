import { partition, sortBy } from 'lodash-es'
import type { Article, UnscheduledArticle } from '../definitions'
import { isAdmin } from '~/composables'

export function sortArticles(articles: Article[], role?: string, selfId?: string) {
  const isSelf = (article: Article) => article.authors.some((author) => author.id === selfId)
  if (role && selfId) {
    const filter = isAdmin(role) ? isSelf : isEditable
    const [self, others] = partition(articles, filter)
    return [...sortByStage(self), ...sortByStage(others)]
  }
  return sortByStage(articles)
}

// sort by reverse order of stages
function sortByStage(articles: Article[]) {
  return sortBy(
    articles,
    // sort by stage order, desc
    ({ stage }) => -stage.order,
    // sort by update time, desc
    ({ updatedAt }) => -updatedAt,
  )
}

export function isUnscheduledArticle(article: Article): article is UnscheduledArticle {
  return !article.scheduledAt
}

function isEditable(article: Article): boolean {
  return article.editable
}
