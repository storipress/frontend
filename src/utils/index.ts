export {
  mapChildren,
  REMOVE_CHILD,
  raf,
  contrast,
  formatDisplayTime,
  getRelativeTop,
  findBackgroundProvider,
  wrapPaidContent,
  walkChildren,
} from './editor'

function decode(text: string) {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

export function filterHTMLTag(text: string | null | undefined) {
  if (!text) return ''
  return decode(
    text
      .replace(/<\/?[^>]*>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .trim(),
  )
}

export function addDecimal(text?: string | number | null) {
  if (Number.isNaN(Number(text))) return '0.00'
  if (typeof text === 'number' || /\d+\.\d+/.test(String(text))) {
    text = Number(text).toFixed(2)
  }
  return Number(`${text ?? 0}`.replace(/\B(?=\d{2}$)/, '.'))
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export { isIframe, isFirefox, isSafari } from './detect'
export { checkClientIDFormat, isSpecialClientID } from './client-id'
