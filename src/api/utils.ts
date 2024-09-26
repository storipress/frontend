import { z } from 'zod'
import type { GraphQLErrors } from '@apollo/client/errors'
import { Chunk, Option, pipe } from 'effect'
import type { Operation } from '@apollo/client/core'
import type { GraphQLFormattedError } from 'graphql'
import { useKnownAPIErrorsStore } from '~/stores/known-api-errors'
import { pinia } from '~/modules/pinia'

const knownAPIErrorSchema = z.object({
  message: z.string(),
  path: z.array(z.string()).optional(),
  extensions: z.object({
    code: z.number(),
  }),
})

export function findKnownErrors(errors: readonly GraphQLFormattedError[]) {
  return pipe(
    Chunk.fromIterable(errors),
    Chunk.filterMap((error) => {
      const result = knownAPIErrorSchema.safeParse(error)
      if (result.success) {
        return Option.some(result.data)
      }
      return Option.none()
    }),
    Chunk.toReadonlyArray,
  )
}

export function reportKnownErrors(
  graphQLErrors: GraphQLErrors | undefined,
  operation: Pick<Operation, 'operationName'>,
) {
  if (!graphQLErrors) {
    return
  }

  const knownErrors = findKnownErrors(graphQLErrors)

  if (knownErrors.length === 0) {
    return
  }

  const generalErrorsStore = useKnownAPIErrorsStore(pinia)

  for (const error of knownErrors) {
    generalErrorsStore.pushError({
      message: error.message,
      operationName: operation.operationName,
      path: error.path,
      code: error.extensions.code,
    })
  }
}
