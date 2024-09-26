import type { UserModule } from '~/types'

export const install: UserModule = ({ router }) => {
  router.onError((error, to) => {
    const errors = ['Failed to fetch dynamically imported module', 'Unable to preload CSS']

    if (errors.some((e) => error.message.includes(e))) {
      window.location.assign(to.fullPath)
    }
  })
}
