import AnchorElement from '~/components/AnchorElement/AnchorElement.vue'
import type { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  app.component('NuxtLink', AnchorElement)
}
