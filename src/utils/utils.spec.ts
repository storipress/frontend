import { expect, it } from 'vitest'
import { addDecimal, filterHTMLTag } from './index'

it('filterHTMLTag', () => {
  expect(filterHTMLTag('<br />')).toBe('')
  expect(filterHTMLTag(' <img src="./test.png"> ')).toBe('')
})

// Decode HTML entities may not convert on happy-dom
it.skip('filterHTMLTag', () => {
  expect(filterHTMLTag('abc')).toBe('abc')
  expect(filterHTMLTag('<p>123</p>')).toBe('123')
  expect(filterHTMLTag('<p>12&nbsp;3</p>')).toBe('12 3')
})

it('addDecimal', () => {
  expect(addDecimal()).toBe('0.00')
  expect(addDecimal(null)).toBe('0.00')
  expect(addDecimal('abc')).toBe('0.00')
  expect(addDecimal('0')).toBe('0.00')
  expect(addDecimal('1')).toBe('1.00')
  expect(addDecimal('12')).toBe('12.00')
  expect(addDecimal('12345')).toBe('123.45')
  expect(addDecimal('123451')).toBe('1,234.51')
  expect(addDecimal('123.45')).toBe('123.45')
  expect(addDecimal('123.451')).toBe('123.45')
  expect(addDecimal(12345)).toBe('12,345.00')
  expect(addDecimal(123456)).toBe('123,456.00')
  expect(addDecimal(123.45)).toBe('123.45')
  expect(addDecimal(123.451)).toBe('123.45')
  expect(addDecimal(0)).toBe('0.00')
})
