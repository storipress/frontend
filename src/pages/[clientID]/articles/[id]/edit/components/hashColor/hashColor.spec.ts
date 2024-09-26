import { pickColor } from '.'

it('test color changed ok', () => {
  expect(pickColor('1')).toMatchInlineSnapshot('"hsl(49, 50%, 50%)"')
  expect(pickColor('2')).toMatchInlineSnapshot('"hsl(50, 50%, 50%)"')
  expect(pickColor('3')).toMatchInlineSnapshot('"hsl(51, 50%, 50%)"')
  expect(pickColor('myName')).toMatchInlineSnapshot('"hsl(0, 50%, 50%)"')
  expect(pickColor('testMyName')).toMatchInlineSnapshot('"hsl(73, 50%, 50%)"')
  expect(pickColor('testMy123456789')).toMatchInlineSnapshot('"hsl(39, 50%, 50%)"')
})
