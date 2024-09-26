// from https://github.com/storipress/karbon/blob/2e3ce6c29f0619b3fe796982886cf7a20e64239a/packages/karbon-utils/src/html-filter.ts

export function createHTMLFilter(decode: (s: string) => string) {
  return (html: string): string => {
    if (!html) {
      return ''
    }
    return decode(filterHTMLTag(html))
  }
}

export function filterHTMLTag(text: string) {
  if (!text) {
    return ''
  }

  return text.replace(/<\/?[^>]*>/g, '').trim()
}

export function decodeEntities(html: string) {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = html
  return textarea.value
}

export const htmlFilter = createHTMLFilter(decodeEntities)
