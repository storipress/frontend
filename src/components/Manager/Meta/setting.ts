import * as yup from 'yup'
import transliterate from '@sindresorhus/transliterate'
import { warning } from '~/lib/linter'

export const options = [{ name: 'Free access' }, { name: 'Members only' }, { name: 'Paid members only' }]
export const featuredList = ['Featured', 'Unfeatured']

export const initialValues = {
  slug: '',
  searchTitle: '',
  searchDescription: '',
  socialTitle: '',
  socialDescription: '',
  TWText: '',
} as Record<string, string>

export function validationSchema() {
  return {
    slug: yup
      .string()
      .max(255, warning.lognSlug)
      .required(warning.slug)
      .test('test', '', (value, testContext) => {
        let transValue = value || ''
        transValue = transliterate(transValue, { customReplacements: [[' ', '-']] })
        transValue = encodeURIComponent(transValue)
          .replace(/[^a-zA-Z0-9_-]/g, '')
          .toLowerCase()
        if (transValue !== value) {
          return testContext.createError({
            message: `slug will be changed to ${transValue}`,
          })
        }
        return true
      }),
    searchTitle: yup
      .string()
      .required(warning.noSearchTitle)
      .min(50, warning.shortSearchTitle)
      .max(60, warning.longSearchTitle),
    searchDescription: yup.string().min(50, warning.searchDescription),
    socialTitle: yup
      .string()
      .required(warning.noSocialTitle)
      .min(50, warning.shortSocialTitle)
      .max(60, warning.longSocialTitle),
    socialDescription: yup.string().min(50, warning.socialDescription),
    TWText: yup.string().max(255, warning.TWText),
  }
}
