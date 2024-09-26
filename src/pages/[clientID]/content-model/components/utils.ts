import { number as yupNumber, string as yupString } from 'yup'
import type { CustomFieldType } from '~/graphql-operations'

export const errorMessage = {
  unique: 'The identifier already exists',
  regex: 'only allow a-z, 0-9, and _',
}

export function useContentModelValidate() {
  const nameValidate = () => yupString().max(200).required().label('this')
  const keyValidate = () =>
    yupString()
      .min(3)
      .max(32)
      .matches(/^([a-z]|_).*/, 'must begin with a-z or _')
      .matches(/^[a-z0-9_]+$/, 'only allow a-z, 0-9, and _')
      .required()
      .label('this')
  const descriptionValidate = () => yupString().max(2000).nullable().label('this')
  const minValidate = () =>
    yupNumber()
      .typeError('must specify a number')
      .transform((v, o) => (o === '' ? null : v))
      .default(0)
      .nullable(true)
      .label('this')
  const maxValidate = () =>
    yupNumber()
      .typeError('must specify a number')
      .transform((v, o) => (o === '' ? null : v))
      .default(0)
      .nullable(true)
      .label('this')
  const targetValidate = (type?: CustomFieldType) => {
    return type === 'reference' ? yupString().required().label('this') : yupString()
  }
  return { nameValidate, keyValidate, descriptionValidate, minValidate, maxValidate, targetValidate }
}
