// reference https://mswjs.io/docs/getting-started/mocks/graphql-api

import { handlers as unsplashHandlers } from './restful/unsplash'
import { handlers as httpbinHandlers } from './restful/httpbin'
import { handlers as typesenseHandlers } from './restful/typesense'

export const handlers = [
  ...Array.from(
    Object.values(import.meta.glob('./graphql/*.{js,ts}', { eager: true })),
    ({ default: handler }) => handler,
  ),
  ...unsplashHandlers,
  ...httpbinHandlers,
  ...typesenseHandlers,
]
