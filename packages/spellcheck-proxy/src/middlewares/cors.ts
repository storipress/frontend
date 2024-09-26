import { cors } from 'hono/cors'
import { parseURL } from 'ufo'

export const corsMiddleware = cors({
  origin: (origin) => {
    const { host: parsedHost } = parseURL(origin)
    let allow = false
    const localhostParams = ['localhost', '127.0.0.1']
    const storipressParams = ['storipress.dev', 'storipress.pro', 'stori.press', 'storipress-app.pages.dev']
    localhostParams.forEach((host: string) => {
      if (parsedHost?.startsWith(host)) {
        allow = true
      }
    })
    storipressParams.forEach((host: string) => {
      if (parsedHost?.endsWith(host)) {
        allow = true
      }
    })
    return allow ? origin : ''
  },
  allowMethods: ['POST', 'GET', 'OPTIONS'],
})
