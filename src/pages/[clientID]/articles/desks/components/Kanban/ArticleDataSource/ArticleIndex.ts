import { Brand } from 'effect'
import type { SourceArticleIndex } from '.'

export type ArticleIndex = [stage: number, index: number] & Brand.Brand<'ArticleIndex'>

export interface Range {
  start: ArticleIndex
  end: ArticleIndex
}

const brand = Brand.refined<ArticleIndex>(
  (x) => Array.isArray(x) && x.length === 2 && x[0] >= 0 && x[1] >= 0,
  (x) => Brand.error(`Expected ${x} to be ArticleIndex`),
)

export function refine(x: Brand.Brand.Unbranded<ArticleIndex>): ArticleIndex {
  return brand(x)
}

export function make(stage: number, index: number): ArticleIndex {
  return brand([stage, index])
}

export function empty() {
  return make(0, 0)
}

export function is(x: Brand.Brand.Unbranded<ArticleIndex>): x is ArticleIndex {
  return brand.is(x)
}

export function increase(self: ArticleIndex): ArticleIndex {
  return add(self, 1)
}

export function add(self: ArticleIndex, n: number): ArticleIndex {
  return brand([self[0], self[1] + n])
}

export function fromSourceArticleIndex(
  sourceArticleIndex: SourceArticleIndex.SourceArticleIndex,
  perPage: number,
): ArticleIndex {
  return make(sourceArticleIndex[0], sourceArticleIndex[1] * perPage + sourceArticleIndex[2])
}
