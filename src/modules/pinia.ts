import { createPinia } from 'pinia'
import { sync } from '~/lib/sync'
import type { UserModule } from '~/types'

// Safety: we are not using SSR
export const pinia = createPinia()

// Setup Pinia
// https://pinia.esm.dev/
export const install: UserModule = ({ isClient, initialState, app }) => {
  pinia.use(sync)
  app.use(pinia)
  // Refer to
  // https://github.com/antfu/vite-ssg/blob/main/README.md#state-serialization
  // for other serialization strategies.
  if (isClient) pinia.state.value = initialState.pinia || {}
  else initialState.pinia = pinia.state.value
}
