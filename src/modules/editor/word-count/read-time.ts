const FIRST_IMAGE_READ = 12
const IMAGE_THRESHOLD = 10
const TEN_IMAGE_READ_TIME = 75

const WORDS_READ_PER_MINUTE = 275

export const MINUTE = 60

export function getTotalReadMinute(wordSeconds: number, imageSeconds: number): number {
  return Math.max(Math.round((wordSeconds + imageSeconds) / 60), 1)
}

export function getWordReadSeconds(words: number) {
  return (words / WORDS_READ_PER_MINUTE) * MINUTE
}

export function getImageReadSeconds(images: number) {
  if (images < IMAGE_THRESHOLD) {
    // 1st take 12s, 2nd 11s, ... after 10th take 3s
    return ((FIRST_IMAGE_READ + (FIRST_IMAGE_READ - images + 1)) * images) / 2
  }
  return TEN_IMAGE_READ_TIME + (images - IMAGE_THRESHOLD) * 3
}
