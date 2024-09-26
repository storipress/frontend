import { trackPage } from '~/lib/integrations'
import type { UserModule } from '~/types'

export const install: UserModule = ({ router }) => {
  router.afterEach((route) => {
    trackPage(route)
  })
}
