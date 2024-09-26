import { Effect, Schedule, pipe } from 'effect'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { ServerParseError } from '@apollo/client/core'
import { isApolloError } from '@apollo/client/core'
import { captureException } from '@sentry/vue'
import invariant from 'tiny-invariant'
import { useApolloClient } from '~/lib/apollo'
import type { GetMeQuery } from '~/graphql-operations'
import { GetMeDocument } from '~/graphql-operations'
import { useConfirmFunction, useConfirmModal } from '~/components/ConfirmModalProvider/useConfirmModal'
import { useAuthStore } from '~/stores/auth'
import { useEffectRuntime } from '~/effects'

const ABORT_MESSAGE = 'abort request'

const ABORT_ERROR = new Error(ABORT_MESSAGE)

// skipcq: JS-0323
export function useMe(document: TypedDocumentNode<any, any> = GetMeDocument) {
  const result = ref<GetMeQuery>()
  const me = computed(() => result.value?.me)
  const auth = useAuthStore()
  const runtime = useEffectRuntime()

  const errorDescription = 'Uh oh... an error occurred. Please reload the page.'
  const [showErrorPopup] = useConfirmFunction([
    {
      type: 'warning',
      title: 'Error',
      description: errorDescription,
      okText: 'Reload page',
      cancelText: 'Close',
    },
  ])
  const confirmModal = useConfirmModal()

  const { client, clientID } = useApolloClient()

  const checkClientID = Effect.try({
    try: () => {
      invariant(clientID !== 'default', 'calling GetMe on central api')
      invariant(clientID === auth.clientID, 'calling api when jump to page without client id')
    },
    catch(error) {
      return new Error(ABORT_MESSAGE, { cause: error })
    },
  })

  const query = Effect.tryPromise({
    try: (signal) =>
      client.query({
        query: document,
        context: {
          fetchOptions: { signal },
        },
      }),
    catch: (_error: unknown) => {
      const error = _error instanceof Error ? _error : new Error('Unknown error', { cause: _error })
      if (!isApolloError(error)) return error

      const is404 = (error.networkError as ServerParseError)?.statusCode === 404
      const isUnauthenticated = error.message === 'Unauthenticated.'

      if (isUnauthenticated || is404 || clientID !== auth.clientID || clientID === 'default') {
        return ABORT_ERROR
      }

      return error
    },
  })

  pipe(
    checkClientID,
    Effect.flatMap(() => query),
    Effect.retry({
      schedule: Schedule.spaced('500 millis'),
      times: 2,
      while: (error) => error !== ABORT_ERROR && (!(error instanceof Error) || error.message === ABORT_MESSAGE),
    }),
    Effect.tap(({ data }) => {
      result.value = data
    }),
    Effect.catchAll((error) => {
      const isCanceled = error === ABORT_ERROR || (error instanceof Error && error.message === ABORT_MESSAGE)
      // do noting if it's cancelled
      if (isCanceled) return Effect.void

      captureException(error)
      const hadModal = confirmModal?.modalList?.some(({ content }) => content?.description === errorDescription)
      const confirm = hadModal ? Effect.succeed(false) : Effect.promise(showErrorPopup)
      return pipe(
        confirm,
        Effect.tap((shouldReload) => {
          if (shouldReload) {
            window.location.reload()
          }
        }),
      )
    }),
    runtime.runPromise,
  )

  return me
}
