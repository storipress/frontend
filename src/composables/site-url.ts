import { P, match } from 'ts-pattern'
import { joinURL, withHttps } from 'ufo'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from '@vueuse/core'
import {
  GetSiteCustomSiteDocument,
  GetWordpressAuthorizedDocument,
  GetWordpressInfoDocument,
  WebflowInfoDocument,
} from '~/graphql-operations'
import { useSiteStore } from '~/stores/site'
import { Integrations, useIntegrationUtils } from '~/composables'

export enum ConnectedTarget {
  Shopify = 'Shopify',
  Webflow = 'Webflow',
  WordPress = 'WordPress',
  Karbon = 'Karbon',
  Storipress = 'Storipress',
}

export interface ArticleInfo {
  id: string
  slug: string
  url: string
}

/**
 * composable function to get site URL
 * respect to Shopify or Webflow integration status
 */
export function useSiteURL() {
  const siteStore = useSiteStore()
  const domain = computed(() => siteStore.site?.customer_site_domain ?? '')

  const { result: customSiteResult, loading: loadingCustomSite } = useQuery(GetSiteCustomSiteDocument)
  const isSetKarbon = computed(() => customSiteResult.value?.site.custom_site_template)

  const { result: webflowInfoResult, loading: loadingWebflow } = useQuery(WebflowInfoDocument)
  const webflowDomain = computed(() => webflowInfoResult.value?.webflowInfo.domain)

  const { result: wordpressInfoResult, loading: loadingWordpressInfo } = useQuery(GetWordpressInfoDocument)
  const wordpressUrl = computed(() => wordpressInfoResult.value?.wordPressInfo.url)

  const { getParseData, isThirdPartyEnabled, isReady: integrationIsReady } = useIntegrationUtils()

  const shopifyIntegration = getParseData(Integrations.Shopify)
  const isSetShopify = isThirdPartyEnabled(Integrations.Shopify)

  const isSetWebflow = isThirdPartyEnabled(Integrations.Webflow)

  const { result: wordpressAuthorizedResult, loading: loadingWordpressAuth } = useQuery(GetWordpressAuthorizedDocument)
  const isSetWordpress = computed(
    () => wordpressAuthorizedResult.value?.wordPressAuthorized && wordpressInfoResult.value?.wordPressInfo.activated_at,
  )

  const connectedTarget = computed(() => {
    if (isSetWebflow.value) {
      return ConnectedTarget.Webflow
    }

    if (isSetShopify.value) {
      return ConnectedTarget.Shopify
    }

    if (isSetWordpress.value) {
      return ConnectedTarget.WordPress
    }

    if (isSetKarbon.value) {
      return ConnectedTarget.Karbon
    }

    return ConnectedTarget.Storipress
  })

  const siteURL = computed(() => {
    const siteDomain: string = match(connectedTarget.value)
      .with(ConnectedTarget.Webflow, () => {
        return webflowDomain.value ?? ''
      })
      .with(ConnectedTarget.Shopify, () => {
        return shopifyIntegration.value?.domain ?? ''
      })
      .with(ConnectedTarget.WordPress, () => {
        return wordpressUrl.value ?? ''
      })
      .with(P.union(ConnectedTarget.Karbon, ConnectedTarget.Storipress), () => {
        return domain.value
      })
      .exhaustive()
    return withHttps(siteDomain)
  })

  function getArticleURL(article: MaybeRefOrGetter<ArticleInfo>) {
    return computed(() => {
      const { id, url } = toValue(article)

      return match(connectedTarget.value)
        .with(ConnectedTarget.Webflow, () => {
          return url
        })
        .with(ConnectedTarget.Shopify, () => {
          return url
        })
        .with(ConnectedTarget.WordPress, () => {
          return url
        })
        .with(ConnectedTarget.Karbon, () => {
          return joinURL(siteURL.value, `_storipress/redirect?type=article&id=${id}`)
        })
        .with(ConnectedTarget.Storipress, () => {
          return url
        })
        .exhaustive()
    })
  }

  const isReady = computed(() => {
    return (
      integrationIsReady.value &&
      !loadingCustomSite.value &&
      !loadingWebflow.value &&
      !loadingWordpressAuth.value &&
      !loadingWordpressInfo.value
    )
  })

  return {
    isReady,
    isSetKarbon,
    isSetShopify,
    isSetWebflow,
    isSetWordpress,
    connectedTarget,
    siteURL,
    isSupportCustomTheme: computed(() => {
      return connectedTarget.value === ConnectedTarget.Storipress
    }),
    isSupportToArticle: computed(() => {
      return connectedTarget.value !== ConnectedTarget.Shopify && connectedTarget.value !== ConnectedTarget.Webflow
    }),
    getArticleURL,
  }
}
