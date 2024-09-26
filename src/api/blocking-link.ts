import { ApolloLink, Observable } from '@apollo/client/core'

export const CANCEL_ERROR = new Error('Blocking cancelled')

export const BlockingLink = new ApolloLink((operation, forward) => {
  const context = operation.getContext()
  if (context.blocking) {
    return new Observable((observer) => {
      const { blocking } = context
      let cleanup = () => {}

      async function waitBlocking() {
        const shouldContinue = await blocking

        if (shouldContinue === false) {
          observer.error(CANCEL_ERROR)
          return
        }

        const subscription = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        })

        cleanup = () => subscription.unsubscribe()
      }

      waitBlocking()

      return () => {
        cleanup()
      }
    })
  }

  return forward(operation)
})
