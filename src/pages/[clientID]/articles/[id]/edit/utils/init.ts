import { z } from 'zod'
import type { FormModel, IgnoreFormModel } from '../types'
import { ArticlePlan } from '~/graphql-operations'
import { Integrations, useIntegrationUtils } from '~/composables/integration'

export const initFormModel: FormModel = {
  id: '',
  title: '',
  blurb: '',
  slug: '',
  coverUrl: '',
  coverAlt: '',
  coverCaption: '',
  coverCrop: {
    key: '',
    left: 50,
    top: 50,
    zoom: 1,
    realWidth: 0,
    realHeight: 0,
    width: 0,
    height: 0,
  },
  searchTitle: '',
  searchDescription: '',
  socialTitle: '',
  socialDescription: '',
  socialImageUrl: '',
  newsletter: false,
  newsletterAt: null,
  FBPageId: '',
  FBEnable: false,
  FBText: '',
  TWUserId: '',
  TWEnable: false,
  TWText: '',
  LNAuthorId: '',
  LNEnable: false,
  LNText: '',
  slackText: '',
  navColor: '#FFF',
  deskId: '',
  deskName: '',
  draft: false,
  published: false,
  hasSlug: false,
  featured: false,
  previewId: '',
  plan: ArticlePlan.Free,
  imgUrl: '',
  imgAlt: '',
  tags: [],
  authors: [],
}

export const initIgnoreFormModel: IgnoreFormModel = {
  title: '',
  blurb: '',
}

export const initArticle = {
  id: '',
  title: '',
  authors: [],
  editable: true,
  stage: {
    id: '',
    name: '',
    color: '',
    order: 0,
    icon: '',
    ready: false,
    default: true,
  },
  desk: {
    id: '',
  },
  updatedAt: 0,
}

const defaultString = (x: string | undefined | null) => x ?? ''

const basicSocialDataSchema = z.object({
  id: z.string().nullish().transform(defaultString),
  name: z.string().nullish().transform(defaultString),
  thumbnail: z.string().nullish().transform(defaultString),
})

export const socialDataSchema = basicSocialDataSchema.nullish().transform(
  (x) =>
    x ?? {
      id: '',
      name: '',
      thumbnail: '',
    },
)

export type SocialData = z.infer<typeof socialDataSchema>

export const facebookSocialDataSchema = basicSocialDataSchema
  .omit({ id: true })
  .extend({ page_id: z.string().nullish().transform(defaultString) })
  .nullish()
  .transform((x) => ({
    ...x,
    id: x?.page_id,
  }))
  .pipe(socialDataSchema)

export const twitterSocialDataSchema = basicSocialDataSchema
  .omit({ id: true })
  .extend({ user_id: z.string().nullish().transform(defaultString) })
  .nullish()
  .transform((x) => ({
    ...x,
    id: x?.user_id,
  }))
  .pipe(socialDataSchema)

export function initUser() {
  const { getThirdPartyData, getConfiguration } = useIntegrationUtils()
  const linkedin = getConfiguration(Integrations.LinkedIn)
  const LNuser = computed(() => {
    return socialDataSchema.parse(linkedin.value?.authors?.[0])
  })

  const facebook = getThirdPartyData(Integrations.Facebook)
  const FBuser = computed(() => {
    return facebookSocialDataSchema.parse(facebook.value?.[0])
  })

  const twitter = getThirdPartyData(Integrations.Twitter)
  const TWuser = computed(() => {
    return twitterSocialDataSchema.parse(twitter.value?.[0])
  })

  return { FBuser, TWuser, LNuser }
}
