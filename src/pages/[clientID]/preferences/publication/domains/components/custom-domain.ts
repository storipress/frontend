import shopifySvg from '@assets/icons-shopify.svg'
import webflowSvg from '@assets/icons-webflow.svg'
import wordpressSvg from '@assets/icons-wordpress.svg'
import { ConnectedTarget, useSiteURL } from '~/composables'

export type ManagedCustomDomainIntegration =
  | ConnectedTarget.Shopify
  | ConnectedTarget.Webflow
  | ConnectedTarget.WordPress

interface ThirdPartyBanner {
  name: string
  logo: string
}

export const THIRD_PARTY_BANNER: Record<ManagedCustomDomainIntegration, ThirdPartyBanner> = {
  [ConnectedTarget.Webflow]: {
    name: 'Webflow',
    logo: webflowSvg,
  },
  [ConnectedTarget.Shopify]: {
    name: 'Shopify',
    logo: shopifySvg,
  },
  [ConnectedTarget.WordPress]: {
    name: 'WordPress',
    logo: wordpressSvg,
  },
}

const MANAGED_TARGETS = new Set([ConnectedTarget.Shopify, ConnectedTarget.Webflow, ConnectedTarget.WordPress])

function isManagedTargets(connectedTarget: ConnectedTarget): connectedTarget is ManagedCustomDomainIntegration {
  return MANAGED_TARGETS.has(connectedTarget)
}

export function useThirdPartyCustomDomain() {
  const { isReady, connectedTarget } = useSiteURL()

  return {
    isReady,
    connectedTarget: computed((): ManagedCustomDomainIntegration | null => {
      const target = connectedTarget.value
      if (isManagedTargets(target)) {
        return target
      }
      return null
    }),
  }
}
