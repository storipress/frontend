import { $fetch } from 'ofetch'
import { joinURL } from 'ufo'
import { env } from '~/env'

export function fetchExternalImage(url: string): Promise<Blob> {
  return $fetch(joinURL(env.VITE_IMAGE_PROXY, url), {
    responseType: 'blob',
  })
}
