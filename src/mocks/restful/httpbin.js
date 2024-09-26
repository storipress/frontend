import { rest } from 'msw'

export const handlers = [
  rest.get('https://httpbin.org/json', (req, res, ctx) => {
    return res(ctx.json({ foo: 'bar' }))
  }),
]
