import { Brand } from 'effect'

export const ITEM_PRE_PAGE = 10

export type SourceArticleIndex = [stage: number, page: number, index: number] & Brand.Brand<'SourceArticleIndex'>

export interface Range {
  start: SourceArticleIndex
  end: SourceArticleIndex
}

const brand = Brand.refined<SourceArticleIndex>(
  (x) => Array.isArray(x) && x.length === 3 && x[0] >= 0 && x[1] >= 0 && x[2] >= 0,
  (x) => Brand.error(`Expected ${x} to be SourceArticleIndex`),
)

export function refine(x: Brand.Brand.Unbranded<SourceArticleIndex>): SourceArticleIndex {
  return brand(x)
}

export function make(stage: number, page: number, index: number): SourceArticleIndex {
  return brand([stage, page, index])
}

export function empty() {
  return make(0, 0, 0)
}

export function is(x: Brand.Brand.Unbranded<SourceArticleIndex>): x is SourceArticleIndex {
  return brand.is(x)
}

export function increase(self: SourceArticleIndex): SourceArticleIndex {
  return add(self, 1)
}

export function add(self: SourceArticleIndex, n: number): SourceArticleIndex {
  return brand([self[0], self[1], self[2] + n])
}
