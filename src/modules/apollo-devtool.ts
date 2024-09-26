import Plugin from '@storipress/apollo-vue-devtool'
import type { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  app.use(Plugin)
}
