import type { IntegrationsData } from './types'
import type { LinkedInAuthors } from '~/graphql-operations'
import type { FBuser, TWuser } from '~/pages/[clientID]/articles/[id]/edit/types'

export const seoColumns = ['searchTitle', 'searchDescription']

export enum SocialMedia {
  facebook = 'Facebook',
  twitter = 'Twitter',
  linkedin = 'LinkedIn',
}

export const mediaSetting = {
  [SocialMedia.facebook]: {
    toggle: 'FBEnable',
    text: 'FBText',
    id: 'FBPageId',
    shareText: 'Share to Facebook',
    labelText: 'Post text',
    postText: 'to your Facebook page on publish',
    buttonText: 'Facebook',
  },
  [SocialMedia.twitter]: {
    toggle: 'TWEnable',
    text: 'TWText',
    id: 'TWUserId',
    shareText: 'Share to Twitter',
    labelText: 'Tweet (max 255 characters)',
    postText: 'to Twitter on publish',
    buttonText: 'Twitter',
  },
  [SocialMedia.linkedin]: {
    toggle: 'LNEnable',
    text: 'LNText',
    id: 'LNAuthorId',
    shareText: 'Share to LinkedIn',
    labelText: 'Post text',
    postText: 'to LinkedIn on publish',
    buttonText: 'LinkedIn',
  },
}

export interface MediaEnableSetting {
  [SocialMedia.facebook]: boolean
  [SocialMedia.twitter]: boolean
  [SocialMedia.linkedin]: boolean
}
export interface MediaUserSetting {
  [SocialMedia.facebook]?: IntegrationsData | FBuser
  [SocialMedia.twitter]?: IntegrationsData | TWuser
  [SocialMedia.linkedin]?: LinkedInAuthors
}

export interface MediaUserSettingCard {
  [SocialMedia.facebook]: IntegrationsData
  [SocialMedia.twitter]: IntegrationsData
  [SocialMedia.linkedin]: IntegrationsData
}

export { useSocial } from './social'
export { useConnectYdoc } from './ydoc'
export type { IDefineYdocMapReturn } from './ydoc'
export { useAI } from './ai'
