import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { Promisable } from 'type-fest'
import { ApolloError } from '@apollo/client/core'
import type { MaybeRefOrGetter } from 'vue'
import { SetupShopifyOauthDocument } from '~/graphql-operations'
import { getApolloClient } from '~/lib/apollo'
import type { ConfirmOptionInterface } from '~/components/ConfirmModalProvider/useConfirmModal'

export type OAuthIntegration = 'shopify'

const documents = {
  shopify: SetupShopifyOauthDocument,
} satisfies Record<OAuthIntegration, TypedDocumentNode<unknown, { code: string }>>

interface UseContinueOauthInput {
  integration: string
  code: MaybeRefOrGetter<string>
}

export function useContinueOauth({
  integration,
  code,
}: UseContinueOauthInput): (clientID: string) => Promisable<boolean | number> {
  if (!isContinuableOauth(integration)) {
    return () => false
  }

  const document = documents[integration]

  return async (clientID: string) => {
    const client = getApolloClient(clientID)
    const oauthCode = toValue(code)
    if (!oauthCode) {
      return false
    }
    try {
      const res = await client.mutate({
        mutation: document,
        variables: { code: oauthCode },
      })
      return res.data?.setupShopifyOauth ?? false
    } catch (error) {
      if (error instanceof ApolloError) {
        const errorCode = error.graphQLErrors[0]?.extensions?.code ?? false
        return errorCode as number | false
      }
      return false
    }
  }
}

function isContinuableOauth(key: string): key is keyof typeof documents {
  return key in documents
}

const errorMessage: Record<number, string> = {
  3040060: 'The shopify shop has already been connected. Please disconnect the previous site and reconnect.',
  3040070: 'You are not allowed to connect shopify and webflow at the same time.',
  3050140: 'You are not allowed to connect webflow and shopify at the same time.',
}
export function getFailDialogMessage(errorCode?: number): Record<OAuthIntegration, ConfirmOptionInterface> {
  return {
    shopify: {
      type: 'warning',
      title: 'Integration failed.',
      description: errorCode
        ? errorMessage[errorCode]
        : 'We have detected that the Shopify app was not installed correctly. Please try to reinstall it again.',
      okText: 'OK',
      cancelButtonClass: 'hidden',
    },
  }
}
