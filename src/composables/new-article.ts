import { noop } from 'lodash-es'
import type { CreateNewArticle } from '~/components/NewArticle/definitions'
import { NEW_ARTICLE_KEY } from '~/components/NewArticle'

export function useNewArticle(): CreateNewArticle {
  return inject(NEW_ARTICLE_KEY, noop)
}
