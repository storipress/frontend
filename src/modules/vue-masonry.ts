import { VueMasonryPlugin } from 'vue-masonry'
import type { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  app.use(VueMasonryPlugin)
}
