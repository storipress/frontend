import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { html } from '@codemirror/lang-html'
import { python } from '@codemirror/lang-python'
import { php } from '@codemirror/lang-php'
import { StreamLanguage } from '@codemirror/language'
import type { LanguageSupport } from '@codemirror/language'
import { swift } from '@codemirror/legacy-modes/mode/swift'

export type TLang = 'css' | 'html' | 'javascript' | 'json' | 'php' | 'python' | 'swift' | 'typescript'
interface ILangMapping {
  [key: string]: LanguageSupport | StreamLanguage<unknown>
}

export const langList: TLang[] = ['css', 'html', 'javascript', 'json', 'php', 'python', 'swift', 'typescript']
export const langListCapitalize = {
  css: 'CSS',
  html: 'HTML',
  javascript: 'JavaScript',
  json: 'JSON',
  php: 'PHP',
  python: 'Python',
  swift: 'Swift',
  typescript: 'TypeScript',
}

export const langMapping: ILangMapping = {
  css: css(),
  html: html(),
  javascript: javascript(),
  json: json(),
  php: php(),
  python: python(),
  swift: StreamLanguage.define(swift),
  typescript: javascript({ typescript: true }),
}

const languageAlias: Record<string, TLang> = {
  js: 'javascript',
  ts: 'typescript',
  markup: 'html',
}

export function normalizeLanguage(lang: string): TLang {
  // fallback to JavaScript if language not found
  return languageAlias[lang] ?? 'javascript'
}
