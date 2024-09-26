import { plugin } from '@storipress/vue-slicksort'
import type { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  app.use(plugin)
}
