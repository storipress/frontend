export function onRequestGet(context) {
  const {
    request, // same as existing Worker API
    next, // used for middleware or to fetch assets
  } = context

  const url = new URL(request.url)

  const filename = url.pathname.split('/').pop()

  if (filename.includes('.') || ['/builder', '/builder/'].includes(url.pathname)) {
    return next()
  }

  return fetch(`${url.origin}/builder/index.html`, { headers: request.headers })
}

export const onRequestHead = onRequestGet
