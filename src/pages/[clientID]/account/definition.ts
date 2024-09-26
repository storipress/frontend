import type { InjectionKey } from 'vue'
import type { RoleKeys } from '~/utils/definition'

export const SymbolAccountState: InjectionKey<AccountState> = Symbol('accountState')

export interface AccountState {
  showSidebar: boolean
}

export type StripePlansGroup = 'blogger' | 'publisher'
export type AppSumoPlanGroup =
  | 'storipress_tier1'
  | 'storipress_tier2'
  | 'storipress_tier3'
  | 'storipress_bf_tier1'
  | 'storipress_bf_tier2'
  | 'storipress_bf_tier3'
export type AllPlanGroup = StripePlansGroup | AppSumoPlanGroup

export const lifetimePlans = new Set<string>([
  'storipress_bf_tier1',
  'storipress_bf_tier2',
  'storipress_bf_tier3',
  'storipress_tier1',
  'storipress_tier2',
  'storipress_tier3',
])

export const groupNameMap: Record<AllPlanGroup, string> = {
  blogger: 'Standard',
  publisher: 'Plus',
  storipress_tier1: 'Lifetime Plan Plus (Tier1)',
  storipress_tier2: 'Lifetime Plan Plus (Tier2)',
  storipress_tier3: 'Lifetime Plan Plus (Tier3)',
  storipress_bf_tier1: 'Lifetime Plan Plus (Tier1)',
  storipress_bf_tier2: 'Lifetime Plan Plus (Tier2)',
  storipress_bf_tier3: 'Lifetime Plan Plus (Tier3)',
}

export const plansDotPoints: Record<StripePlansGroup, string[]> = {
  blogger: [
    'Custom domain for 1 publication',
    'Invite Editors to your team',
    'Earn money on your paywall',
    '1,000 subcribers',
    '150,000 Pageviews/Month',
  ],
  publisher: [
    'Create 4 publications',
    'Public GraphQL API access',
    'Custom fields',
    '20,000 subscribers',
    '450,000 Pageviews/Month',
  ],
}

export const cardBrands = {
  amex: 'American Express',
  cartes_bancaires: 'Cartes Bancaires',
  diners_club: 'Diners Club',
  discover: 'Discover & Diners',
  jcb: 'Japan Credit Bureau (JCB)',
  mastercard: 'Mastercard',
  visa: 'Visa',
  unionpay: 'China UnionPay',
}

export type TCardBrands = keyof typeof cardBrands

export interface PublicationsInfo {
  key: RoleKeys
  title: string
  info: string
}
