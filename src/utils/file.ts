import type { Promisable } from 'type-fest'

// currently do nothing
export function isInvalidImage(file?: Blob): Promisable<boolean> {
  return !file
}

export const allowedImageType = '.jpeg, .jpg, .png, .gif, .webp, .bmp, .svg'
export const allowedImageTypeArray = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'bmp', 'svg']
export const allowedImageTypeExtension = new Set(allowedImageTypeArray)

export function filterSupportImageFiles<T extends File[] | DataTransferItem[]>(files: T): T {
  return files.filter((item) => isSupportedImageMime(item.type)) as T
}

export function isSupportedImageMime(mime: string) {
  return /image/i.test(mime) && allowedImageTypeExtension.has(mime.split('/')[1])
}
