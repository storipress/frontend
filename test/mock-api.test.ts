import { expect, it } from 'vitest'
import fetch from 'cross-fetch'

it('mock api work', async () => {
  const res = await fetch('https://httpbin.org/json')
  const data = await res.json()
  expect(data).toEqual({ foo: 'bar' })
})
