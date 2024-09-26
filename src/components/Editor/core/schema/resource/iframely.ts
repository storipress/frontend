import { iframely } from '@iframely/embed.js'
import { env } from '~/env'

iframely.extendOptions({ key: env.VITE_IFRAMELY_KEY })

/**
 * explicit load iframely iframe
 */
export function load() {
  iframely.load()
}
