import { useColorMode as _useColorMode } from '@vueuse/core'
import { DEFAULT_PREVIEW_DATA } from '~/components/Preview/preview-data'
import type { Article } from '~/graphql-operations'
import { GetSiteDocument } from '~/graphql-operations'

export const useColorMode = _useColorMode

interface RecommendArticleOptions {
  count: number
}

export declare enum SocialMediaKey {
  Geneva = 'Geneva',
  Reddit = 'Reddit',
  TikTok = 'TikTok',
  Twitter = 'Twitter',
  YouTube = 'YouTube',
  Facebook = 'Facebook',
  LinkedIn = 'LinkedIn',
  Whatsapp = 'Whatsapp',
  Instagram = 'Instagram',
  Pinterest = 'Pinterest',
}

export function useArticle() {
  const res = {
    ...DEFAULT_PREVIEW_DATA,
    html: '',
  }
  return res
}

export function useRecommendArticle(article: Article, options: RecommendArticleOptions) {
  const { count } = options
  const res = article.relevances.map(({ id, title, blurb }) => ({ id, title, blurb })).slice(0, count)

  return res
}

export function useSite() {
  const { result } = useQuery(GetSiteDocument)

  const returnValue = computed(() => {
    const site = result?.value?.site
    const { name: publicationName, logo, socials, favicon, timezone, plan } = site || {}
    const socialLinks: Record<SocialMediaKey, string> = JSON.parse(socials || '{}')

    return {
      name: publicationName,
      publicationName,
      logo,
      socials: socialLinks,
      socialLinks,
      favicon,
      timezone,
      plan,
    }
  })

  return returnValue
}
