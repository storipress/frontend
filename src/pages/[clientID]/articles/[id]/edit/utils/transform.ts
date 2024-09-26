import type { TDesk } from '../types'

export function transDesk(desk: TDesk) {
  if (!desk) return {}
  return {
    deskId: desk.id,
    deskName: desk.name,
  } as Record<string, string>
}

export function transSeo(seo: string) {
  if (!seo) return {}
  const { meta, og, ogImage, hasSlug } = JSON.parse(seo)
  return {
    searchTitle: meta?.title,
    searchDescription: meta?.description,
    socialTitle: og?.title,
    socialDescription: og?.description,
    socialImageUrl: ogImage,
    hasSlug,
  } as Record<string, string>
}

export function subscribeTransSeo(seo: string) {
  if (!seo) return {}
  const { og, ogImage, hasSlug } = JSON.parse(seo)
  return {
    socialTitle: og?.title,
    socialDescription: og?.description,
    socialImageUrl: ogImage,
    hasSlug,
  } as Record<string, string>
}

export function transCover(cover: string) {
  if (!cover) return {}
  const { url, alt, caption, crop } = JSON.parse(cover)
  return {
    coverUrl: url,
    coverAlt: alt || '',
    coverCaption: caption,
    coverCrop: crop,
  } as Record<string, string>
}

export function transAutoPosting(autoPosting: string) {
  if (!autoPosting) return {}
  const { facebook, twitter, slack, linkedin } = JSON.parse(autoPosting)
  return {
    FBPageId: facebook?.page_id,
    FBEnable: facebook?.enable,
    FBText: facebook?.text || '',
    TWUserId: twitter?.user_id,
    TWEnable: twitter?.enable,
    TWText: twitter?.text || '',
    LNAuthorId: linkedin?.author_id,
    LNEnable: linkedin?.enable,
    LNText: linkedin?.text || '',
    slackText: slack?.text || '',
  } as Record<string, boolean>
}
