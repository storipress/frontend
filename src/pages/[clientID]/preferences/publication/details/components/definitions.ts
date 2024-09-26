import type { Language, LanguageItem, LanguageKey, LanguageValue } from '~/utils/language'

export type { Language, LanguageItem, LanguageKey, LanguageValue }
export { default as language, languageList } from '~/utils/language'

export enum SocialNetworkList {
  Facebook = 'Facebook',
  Instagram = 'Instagram',
  Twitter = 'Twitter',
  LinkedIn = 'LinkedIn',
  YouTube = 'YouTube',
  Pinterest = 'Pinterest',
  Whatsapp = 'Whatsapp',
  Reddit = 'Reddit',
  TikTok = 'TikTok',
  Geneva = 'Geneva',
  Homepage = '__homepage',
}

export interface Timezone {
  text: string
  value: string
  utc: string
}

export interface NewSocialInfo {
  type: undefined | SocialNetworkList
  url: string
}

export interface SocialInfo {
  type: SocialNetworkList
  url: string
}

export interface SocialLink {
  type: 'currentSocial' | 'newSocial'
  index: number
}

export interface PublicationInfo {
  favicon: string
  name: string
  language: LanguageItem
  timezone: Timezone
  email: string
  socials: SocialInfo[]
  homepageUrl: string
}
