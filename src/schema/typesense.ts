import { Schema } from '@effect/schema'

const TypesenseErrorResponse = Schema.Struct({
  code: Schema.Number,
  error: Schema.String,
})

export const decodeTypesenseErrorResponseOption = Schema.decodeUnknownOption(TypesenseErrorResponse)
