import { Data, Predicate } from 'effect'

export enum ErrorKind {
  /**
   * local article length is longer then expected
   */
  IncorrectLocalArticleLength = 'IncorrectLocalArticleLength',
}

const ERROR_MESSAGE = {
  [ErrorKind.IncorrectLocalArticleLength]: 'local article length is longer then expected',
}

const ERROR_TAG = 'InternalError' as const

// eslint-disable-next-line unicorn/throw-new-error
export const InternalError = Data.TaggedError(ERROR_TAG)<{ kind: ErrorKind; message: string }>

export function invariant(condition: unknown, errorKind: ErrorKind): asserts condition {
  if (!condition) {
    throw new InternalError({ kind: errorKind, message: ERROR_MESSAGE[errorKind] })
  }
}

const isInternalErrorTagged = Predicate.isTagged(ERROR_TAG)
export function isInternalError(error: unknown): error is typeof InternalError {
  return isInternalErrorTagged(error) && 'kind' in error
}
