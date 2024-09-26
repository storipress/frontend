import type { UserType } from '~/components/UserSelectTypeahead/definition'
import type { TagType } from '~/components/TagSelectTypeahead/definition'
import type { DeskType } from '~/components/DeskSelectTypeahead/definition'
import type { ArticlePlan } from '~/graphql-operations'

export enum SearchInputType {
  Article = 'Article',
  Members = 'Members',
  Schedule = 'Schedule',
  Other = 'Other',
}

export type TutorialKeyType =
  | 'setPublicationDetail'
  | 'setCreateDesks'
  | 'setCustomiseTheme'
  | 'setDomain'
  | 'setSocialConnect'

interface TypeaheadData {
  [key: string]: unknown
}
export interface PlanItem extends TypeaheadData {
  label: string
  key: ArticlePlan
}
export interface SearchDataInterface {
  text?: string
  people?: UserType[]
  tags?: TagType[]
  desks?: DeskType[]
  plans?: PlanItem[]
  range?: [Date, Date]
  persist?: boolean
}

export interface EventClickTextDataInterface {
  text: string
  checked: boolean
}

export interface TutorialDataInterface {
  name: string
  key: TutorialKeyType
  path?: string
}

export interface EventClickStepDataInterface extends EventClickTextDataInterface {
  index: number
  path: string
  key: string
}

export interface UserInfoInterface {
  avatarSrc: string
  name: string
}

interface BaseInfoInterface {
  id: string
  name: string
  domain: string
}

export interface WorkspaceInfoInterface extends BaseInfoInterface {}

export interface ShopifyIntegrationInfoInterface {
  data: BaseInfoInterface
  status: boolean
}
