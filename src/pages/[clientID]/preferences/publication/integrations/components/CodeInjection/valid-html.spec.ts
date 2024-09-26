import { validateHTML } from './valid-html'

it.each([
  ['<div>test</div>', true],
  ['<div>test</div><div>test</div>', true],
  ['<meta charset="utf-8">', true],
  ['<>', false],
  ['<   >', false],
  ['{{PAGE_TITLE}}', false],
])('validateHTML(%s)', (html, expected) => {
  expect(validateHTML(html)).toBe(expected)
})
