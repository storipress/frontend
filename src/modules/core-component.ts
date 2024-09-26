import { NotificationsPlugin } from '@storipress/core-component'
import type { UserModule } from '~/types'
import '@storipress/core-component/index.css'
import '@storipress/core-component/dist/style.css'

export const install: UserModule = ({ app }) => {
  app.use(NotificationsPlugin)
}
