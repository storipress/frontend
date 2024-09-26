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
}

export type ProfileWalkthroughField = ('first_name' | 'last_name' | 'bio' | 'location')[]

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

export interface UserInfo {
  first_name: string
  last_name: string
  location: string
  job_title: string
  contact_email: string
  bio: string
  website: string
  avatar: string
  socials: SocialInfo[]
}
