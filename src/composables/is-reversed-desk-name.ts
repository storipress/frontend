import { object as yupObject, string as yupString } from 'yup'

export function isReversedDeskName(name: string) {
  return /^(?:all|featured|mine)$/i.test(name)
}

export function createDeskNameSchema(inputName: string) {
  return yupObject().shape({
    [inputName]: yupString()
      .trim()
      .required()
      .max(30, 'Max 30 characters allowed')
      .test('invalid', '', (value, ctx) => {
        if (isReversedDeskName(value)) {
          return ctx.createError({
            message: `Desks cannot be named ${value}`,
          })
        }
        return true
      })
      .label('This'),
  })
}
