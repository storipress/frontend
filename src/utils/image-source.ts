// Image providers
export const UNSPLASH = 'unsplash'
export const EXTERNAL_IMAGE = 'externalImage'

// Image url utils

const SP_CDN_REGEX = /^https:\/\/assets\.stori\.press\/.*/i
const UNSPLASH_REGEX = /^https:\/\/images\.unsplash\.com\/.*/i
// eslint-disable-next-line regexp/no-unused-capturing-group
const DATA_URI_REGEX = /^(data:)([\w+/-]*)(;charset=[\w-]+|;base64)?,(.*)/gi

export function isStoripressCDN(url: string) {
  return SP_CDN_REGEX.test(url)
}

export function isUnsplash(url: string) {
  return UNSPLASH_REGEX.test(url)
}

export function isDataUri(url: string) {
  return DATA_URI_REGEX.test(url)
}

type ImageSource = 'storipress' | 'unsplash' | 'data-uri' | 'external-image'

export function getImageSource(src: string): ImageSource {
  if (isStoripressCDN(src)) return 'storipress'
  if (isUnsplash(src)) return 'unsplash'
  if (isDataUri(src)) return 'data-uri'
  return 'external-image'
}
