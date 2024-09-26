import type { NormalizedCacheObject } from '@apollo/client/core'
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, split } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { onError } from '@apollo/client/link/error'
import type { ServerError } from '@apollo/client/link/utils'
import fetch from 'cross-fetch'
import { createUploadLink } from 'apollo-upload-client'
import { SentryLink } from 'apollo-link-sentry'
import { DebugLink } from '@storipress/apollo-vue-devtool'
import * as Sentry from '@sentry/vue'
import { isContainFile } from './upload'
import { BlockingLink } from './blocking-link'
import { handleSeverErrors } from './error-handler'
import { reportKnownErrors } from './utils'
import { useAuthStore } from '~/stores/auth'
import { env } from '~/env'

const SENSITIVE_MUTATIONS = new Set(['SignUp', 'Login'])

export type ApiClient = ApolloClient<NormalizedCacheObject>

export function createApolloClient(uri: string, clientID = 'default'): ApiClient {
  const cache = new InMemoryCache({
    typePolicies: {
      CustomField: {
        keyFields: false,
      },
      CustomFieldColorValue: {
        keyFields: false,
      },
      WebflowInfo: {
        merge: true,
      },
    },
  })

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    const authStore = useAuthStore()
    const token = useStorage('storipress-token', '')
    const isUnauthenticated = graphQLErrors?.find((error) => error.message === 'Unauthenticated.')

    if (graphQLErrors && isUnauthenticated) {
      authStore.$reset()
      token.value = ''
    }

    reportKnownErrors(graphQLErrors, operation)

    if (networkError) {
      const { statusCode } = networkError as ServerError
      handleSeverErrors({ statusCode: statusCode ?? 0, error: networkError as ServerError, operation, clientID })
      if (window.location.pathname.startsWith('/auth') && token.value) {
        Sentry.captureException(new Error('API error in auth route'), (scope) => {
          scope.setContext('operation', {
            operationName: operation.operationName,
          })

          return scope
        })
      }
    }
  })

  const links: ApolloLink[] = [
    errorLink,
    BlockingLink,
    new SentryLink({
      uri,
      setTransaction: false,
      setFingerprint: false,
      attachBreadcrumbs: {
        includeVariables: true,
        includeError: true,
        transform(crumb, op) {
          // send variable if there has error and it's not a sensitive mutation
          if (SENSITIVE_MUTATIONS.has(op.operationName) || !crumb.data.error) {
            Reflect.deleteProperty(crumb.data, 'variables')
          } else {
            // re-attach variables to the crumb
            crumb.data.operationName = op.operationName
            crumb.data.variables = op.variables
          }
          return crumb
        },
      },
    }),
  ]

  if (env.DEV) {
    links.push(new DebugLink())
  }

  links.push(
    setContext(() => {
      const store = useAuthStore()
      if (store.token) {
        return {
          headers: {
            authorization: `Bearer ${store.token}`,
          },
        }
      }
      return {}
    }),
  )

  const httpLink = !env.VITE_ENABLE_MOCK_API ? new BatchHttpLink({ uri, fetch }) : new HttpLink({ uri, fetch })
  const uploadLink = createUploadLink({ uri, fetch })

  links.push(
    split(
      (op) => isContainFile(op.variables),
      uploadLink,
      split((op) => op.operationName === 'GetArticleSearchKey', new HttpLink({ uri, fetch }), httpLink),
    ),
  )

  return new ApolloClient({
    cache,
    link: ApolloLink.from(links),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  })
}
