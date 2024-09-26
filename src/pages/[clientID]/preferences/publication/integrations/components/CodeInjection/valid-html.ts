import { valid } from 'node-html-parser'

const EMPTY_TAG = /<\s*>/m

export function validateHTML(html: string) {
  const isValidateHTML = !EMPTY_TAG.test(html) && valid(html)
  if (!isValidateHTML) return false

  const templateReg = /\{\{\w+\}\}/g
  return !templateReg.test(html)
}
