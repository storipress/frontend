import type {
  ApolloClient,
  ApolloError,
  ApolloQueryResult,
  DocumentNode,
  FetchResult,
  NormalizedCacheObject,
  OperationVariables,
  SubscribeToMoreOptions,
  TypedDocumentNode,
  WatchQueryOptions,
} from '@apollo/client/core'
import { noop } from 'lodash-es'
import type {
  UseQueryReturn as ApolloUseQueryrReturn,
  MutateOverrideOptions,
  UseMutationOptions,
} from '@vue/apollo-composable'
import {
  provideApolloClient,
  useLazyQuery as useApolloLazyQuery,
  useMutation as useApolloMutation,
  useSubscription as useApolloSubscription,
} from '@vue/apollo-composable'
import { createEventHook } from '@vueuse/core'
import type { Ref } from 'vue'
import { isRef, ref, unref } from 'vue'
import type { MaybeRef, MaybeRefOrGetter } from '@vueuse/core'
import { resolveFeatureFlag } from './feature-flag'
import { useApolloClientID } from './client-id'
import { CANCEL_ERROR } from '~/api/blocking-link'
import { createApolloClient } from '~/api/client'
import { useAuthStore } from '~/stores/auth'
import { env } from '~/env'

const API_HOST = env.VITE_ENABLE_MOCK_API ? 'http://localhost:4000' : env.VITE_API_HOST
const DEFAULT_URL = `${API_HOST}/graphql`

export const clients: Record<string, ApolloClient<NormalizedCacheObject>> = {
  default: createApolloClient(DEFAULT_URL),
}
clients._ = clients.default

interface UseApolloClientReturn {
  client: ApolloClient<NormalizedCacheObject>
  clientID: string
}

export function getApolloClient(clientID: string) {
  clients[clientID] ??= createApolloClient(`${env.VITE_API_HOST}/client/${clientID}/graphql`, clientID)
  return clients[clientID] || clients.default
}

export function useApolloClient(): UseApolloClientReturn {
  const store = useAuthStore()
  const clientID = useApolloClientID()
  store.clientID = clientID
  const client = getApolloClient(clientID)
  return { client, clientID }
}

export function query<TResult, TVariables = undefined>(
  clientID: string,
  query: DocumentNode | TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  options = {},
): Promise<ApolloQueryResult<TResult>> {
  clients[clientID] ??= createApolloClient(`${env.VITE_API_HOST}/client/${clientID}/graphql`, clientID)
  const client = clients[clientID] || clients.default
  return client.query({ ...options, query, variables })
}

export function mutate<TResult, TVariables extends OperationVariables | undefined = undefined>(
  clientID: string,
  mutation: DocumentNode | TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  options = {},
): Promise<FetchResult<TResult>> {
  clients[clientID] ??= createApolloClient(`${env.VITE_API_HOST}/client/${clientID}/graphql`, clientID)
  const client = clients[clientID] || clients.default
  return client.mutate({ ...options, mutation, variables })
}

type ToReactiveSource<T> = MaybeRef<T> | (() => T)

// cache-and-network fetchPolicy is not working with useQuery in @vue/apollo-composable
export function useQuery<TResult, TVariables = undefined>(
  query: DocumentNode | TypedDocumentNode<TResult, TVariables>,
  variables?: MaybeRef<TVariables>,
  options: Omit<WatchQueryOptions<TVariables, TResult>, 'query' | 'variables'> = {},
): Pick<ApolloUseQueryrReturn<TResult, TVariables>, 'result' | 'refetch' | 'loading' | 'subscribeToMore'> {
  const { client } = useApolloClient()
  // must use ref for deep watch
  const result = ref<TResult>()
  const loading = ref<boolean>(false)
  const variablesRef: Ref<TVariables> = isRef<TVariables>(variables)
    ? variables
    : (ref<TVariables>(variables as TVariables) as Ref<TVariables>)

  const observableQuery = client.watchQuery({ ...options, query, variables: unref(variables) })
  loading.value = true
  observableQuery.subscribe(({ data }) => {
    result.value = data
    loading.value = false
    // data maybe same reference because of Apollo cache
    triggerRef(result)
  })

  watch(variablesRef, async (variables) => {
    loading.value = true
    await observableQuery.refetch(variables)
    loading.value = false
  })

  return {
    result,
    loading,
    refetch: async (variables?: TVariables) => {
      loading.value = true
      const queryResult = await observableQuery.refetch(variables)
      loading.value = false
      return queryResult
    },
    subscribeToMore<TSubscribeVariables = TVariables, TSubscribeResult = TResult>(
      options: ToReactiveSource<SubscribeToMoreOptions<TResult, TSubscribeVariables, TSubscribeResult>>,
    ) {
      let stop = noop
      const reactiveOptions = typeof options === 'function' ? options : ref(options)
      watch(
        reactiveOptions,
        (options, _old, onCleanup) => {
          stop = observableQuery.subscribeToMore(
            options as SubscribeToMoreOptions<TResult, TSubscribeVariables, TSubscribeResult>,
          )
          onCleanup(stop)
        },
        { immediate: true },
      )

      return () => {
        stop()
      }
    },
  }
}

export const useLazyQuery: typeof useApolloLazyQuery = <TResult, TVariables extends OperationVariables>(
  query: MaybeRef<DocumentNode | TypedDocumentNode<TResult, TVariables>>,
  variables?: MaybeRefOrGetter<TVariables>,
  options: MaybeRefOrGetter<Omit<WatchQueryOptions<TVariables, TResult>, 'query' | 'variables'>> = {},
) => {
  const { clientID, client } = useApolloClient()
  provideApolloClient(client)
  return useApolloLazyQuery(toValue(query), variables, { ...options, clientId: clientID })
}

/**
 * Conditionally load a query
 * ! Notice: It's useless to test it with Growthbook Devtool, because override value won't apply on the first request
 * @param featureFlag Feature flag key or feature flag
 * @param query Query
 * @param variables Query variables
 * @param options Query options
 */
export function useFeatureFlaggedQuery<TResult, TVariables = undefined>(
  featureFlag: MaybeRefOrGetter<boolean> | string,
  query: MaybeRefOrGetter<DocumentNode | TypedDocumentNode<TResult, TVariables>>,
  variables?: MaybeRefOrGetter<TVariables>,
  options: MaybeRefOrGetter<Omit<WatchQueryOptions<TVariables, TResult>, 'query' | 'variables'>> = {},
) {
  const { clientID, client } = useApolloClient()
  provideApolloClient(client)
  const res = useApolloLazyQuery(query, variables, { ...options, clientId: clientID })
  const flag = resolveFeatureFlag(featureFlag)
  whenever(
    flag,
    () => {
      res.load()
    },
    { immediate: true },
  )
  return {
    ...res,
    load() {
      if (!flag.value) {
        return
      }
      return res.load()
    },
    refetch() {
      if (!flag.value) {
        return
      }
      return res.refetch()
    },
  }
}

export const useMutation: typeof useApolloMutation = (document: any, options = {}) => {
  const { clientID, client } = useApolloClient()
  if (env.MODE !== 'test') {
    provideApolloClient(client)
  }
  return useApolloMutation(document, { ...options, clientId: clientID })
}

/**
 * This is similar to useMutation, but it accept a extra Promise as the first argument to indicate the cancellation.
 * @param document GraphQL mutation document
 * @param options Apollo mutation options
 * @returns
 */
export function useCancelableMutation<TResult = any, TVariables extends OperationVariables = OperationVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  options: UseMutationOptions<TResult, TVariables> = {},
) {
  const { clientID, client } = useApolloClient()
  provideApolloClient(client)
  const cancelEvent = createEventHook<void>()
  const res = useApolloMutation(document, { ...options, clientId: clientID })
  return {
    ...res,
    onCancel: cancelEvent.on,
    mutate: (
      cancelPromise: Promise<boolean>,
      variables?: TVariables | null | undefined,
      overrideOptions: MutateOverrideOptions<TResult> = {},
    ) => {
      return res
        .mutate(variables, {
          ...overrideOptions,
          context: {
            ...overrideOptions.context,
            blocking: cancelPromise,
          },
        })
        .catch((err: ApolloError) => {
          // Swallow cancellation errors
          if (err.networkError && err.networkError === CANCEL_ERROR) {
            cancelEvent.trigger()
            return
          }
          throw err
        })
    },
  }
}

export const useSubscription: typeof useApolloSubscription = ((document: any, variables?: any, options = {}) => {
  const { clientID, client } = useApolloClient()
  provideApolloClient(client)
  return useApolloSubscription(document, variables, {
    ...options,
    clientId: clientID,
  })
}) as any
