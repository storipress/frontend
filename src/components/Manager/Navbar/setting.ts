import { warning } from '~/lib/linter'

export const planMapping = {
  free: 'Free access',
  member: 'Members only',
  subscriber: 'Paid members only',
} as Record<string, string>

export enum menuText {
  Unpublish = 'Unpublish',
  PublishNow = 'Publish now',
  UpdateChanges = 'Update changes',
  SubmitForApproval = 'Submit for review',
  UnsubmitForApproval = 'Unsubmit for review',
  QuickSchedule = 'Quick schedule',
  GoToLiveArticle = 'Go to live article',
  GoToShopify = 'Go to Shopify site',
  GoToWebflow = 'Go to Webflow site',
  GoToWordPress = 'Go to WordPress site',
  Loading = 'Loading...',
}

export enum emailText {
  ArticleAlreadyEmailed = 'Article already emailed',
  SendAsEmail = 'Send as email',
  EmailOnPublish = 'Email on publish',
  SetUpEmails = 'Set up emails',
}

export const warningOrder = [
  'slug',
  'coverUrl',
  'body-alt-text',
  'no-media',
  'title',
  'searchTitle',
  'searchDescription',
  'socialTitle',
  'socialDescription',
]

export const redOrder = new Set<string>([
  warning.coverUrl,
  warning.noBodyAlt,
  warning.shortTitle,
  warning.longTitle,
  warning.slug,
  warning.noSearchTitle,
  warning.noSocialTitle,
])

export const yellowOrder = new Set<string>([
  warning.shortSearchTitle,
  warning.longSearchTitle,
  warning.searchDescription,
  warning.shortSocialTitle,
  warning.longSocialTitle,
  warning.socialDescription,
  warning.noMedia,
])

export function userMenuSetting(
  liveUrl: string,
  goToText: menuText,
  updateArticle: () => void,
  unpublishArticle: () => void,
  publishArticle: () => void,
  modalOpen: () => void,
  changeArticleStage: (fromDefault: boolean) => void,
  sendEmail: () => void,
  newsletter: boolean,
  newsletterAt: string | null,
) {
  const route = useRoute()
  const memberUrl = `/${route.params.clientID}/members/setup`
  const initSetting = {
    href: undefined,
    disabled: false,
    hasSwitch: false,
    switchStatus: false,
    click: undefined,
  }

  return {
    canPublishPublished: [
      {
        ...initSetting,
        name: 'refresh',
        text: menuText.UpdateChanges,
        click: updateArticle,
      },
      {
        ...initSetting,
        name: 'draft',
        text: menuText.Unpublish,
        click: unpublishArticle,
      },
      {
        ...initSetting,
        name: 'web',
        disabled: !liveUrl,
        text: liveUrl ? goToText : menuText.Loading,
        href: liveUrl || '#',
      },
    ],
    canPublishNotPublished: [
      {
        ...initSetting,
        name: 'published',
        text: menuText.PublishNow,
        click: publishArticle,
      },
      {
        ...initSetting,
        name: 'schedule',
        text: menuText.QuickSchedule,
        click: modalOpen,
      },
    ],
    noPublishPublished: [
      {
        ...initSetting,
        name: 'refresh',
        text: menuText.UpdateChanges,
        click: updateArticle,
      },
      {
        ...initSetting,
        name: 'web',
        disabled: !liveUrl,
        text: liveUrl ? goToText : menuText.Loading,
        href: liveUrl || '#',
      },
    ],
    noPublishNotPublishedDraft: [
      {
        ...initSetting,
        name: 'for_review',
        text: menuText.SubmitForApproval,
        click: () => changeArticleStage(true),
      },
    ],
    noPublishNotPublishedNotDraft: [
      {
        ...initSetting,
        name: 'for_review',
        text: menuText.UnsubmitForApproval,
        click: () => changeArticleStage(false),
      },
    ],
    canEmailPublished: [
      {
        ...initSetting,
        name: 'email',
        text: newsletterAt ? emailText.ArticleAlreadyEmailed : emailText.SendAsEmail,
        disabled: newsletterAt,
        click: sendEmail,
      },
    ],
    canEmailNotPublished: [
      {
        ...initSetting,
        name: 'email',
        text: newsletterAt ? emailText.ArticleAlreadyEmailed : emailText.EmailOnPublish,
        switchStatus: newsletter,
        hasSwitch: !newsletterAt,
        disabled: true,
      },
    ],
    noEmail: [
      {
        ...initSetting,
        name: 'email',
        text: emailText.SetUpEmails,
        href: memberUrl,
      },
    ],
  }
}

export function canPublish(canPublishedArticle: boolean) {
  return canPublishedArticle ? 'canPublish' : 'noPublish'
}

export function canEmail(canEmail: boolean) {
  return canEmail ? 'canEmail' : 'noEmail'
}

export function isPublished(published: boolean) {
  return published ? 'Published' : 'NotPublished'
}

export function isDraft(canPublishedArticle: boolean, published: boolean, draft: boolean) {
  if (canPublishedArticle || published) return ''
  return draft ? 'Draft' : 'NotDraft'
}

export type TUserMenu =
  | 'canPublishPublished'
  | 'canPublishPublishedDraft'
  | 'canPublishPublishedNotDraft'
  | 'canPublishNotPublished'
  | 'canPublishNotPublishedDraft'
  | 'canPublishNotPublishedNotDraft'
  | 'noPublishPublished'
  | 'noPublishPublishedDraft'
  | 'noPublishPublishedNotDraft'
  | 'noPublishNotPublished'
  | 'noPublishNotPublishedDraft'
  | 'noPublishNotPublishedNotDraft'

export type TUserEmail =
  | 'canEmail'
  | 'canEmailPublished'
  | 'canEmailNotPublished'
  | 'noEmail'
  | 'noEmailNotPublished'
  | 'noEmailPublished'

export enum userMenuEnum {
  canPublishPublished = 'canPublishPublished',
  canPublishNotPublished = 'canPublishNotPublished',
  noPublishPublished = 'noPublishPublished',
  noPublishNotPublishedDraft = 'noPublishNotPublishedDraft',
  noPublishNotPublishedNotDraft = 'noPublishNotPublishedNotDraft',
  canEmailPublished = 'canEmailPublished',
  canEmailNotPublished = 'canEmailNotPublished',
  noEmail = 'noEmail',
}
