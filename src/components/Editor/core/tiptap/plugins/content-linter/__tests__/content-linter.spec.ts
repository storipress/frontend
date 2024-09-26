import { extendStartEnd } from '../content-linter'

it('linter word extend ok', async () => {
  const content = 'tech enthusiasts'
  expect(extendStartEnd(1, 2, content)).toEqual([0, 4])
  expect(extendStartEnd(6, 7, content)).toEqual([5, 16])
})
