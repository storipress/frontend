import type { InjectionKey } from 'vue'
import { CustomFieldGroupType } from '~/graphql-operations'

export interface ContentModelState {
  searchValue: string
}

export const SymbolContentModelState: InjectionKey<ContentModelState> = Symbol('ContentModelState')

export const parametersTypeMap: Record<string, string> = {
  all: '',
  block: CustomFieldGroupType.ArticleContentBlock,
  meta: CustomFieldGroupType.ArticleMetafield,
  desk: CustomFieldGroupType.DeskMetafield,
}
